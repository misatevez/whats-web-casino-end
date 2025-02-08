import { collection, query, orderBy, onSnapshot, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/lib/types';
import { convertToChat, convertToMessage } from './converters';
import { ChatSubscriptionCallback } from './types';
import { getStoredPhoneNumber } from '@/lib/storage/local-storage';

export class SubscriptionService {
  private unsubscribeFromChats: (() => void) | null = null;
  private readonly MESSAGES_PER_PAGE = 50;

  subscribeToChatUpdates(callback: ChatSubscriptionCallback) {
    try {
      console.log('🔵 Starting chat subscription');
      const phoneNumber = getStoredPhoneNumber();
      
      if (!phoneNumber) {
        console.log('❌ No phone number found in storage');
        callback([]);
        return () => {};
      }

      const chatsRef = collection(db, 'chats');
      // Query only chats for this phone number
      const q = query(
        chatsRef, 
        where('phoneNumber', '==', phoneNumber),
        orderBy('lastMessageTime', 'desc')
      );

      this.unsubscribeFromChats = onSnapshot(q, async (snapshot) => {
        const chatsPromises = snapshot.docs.map(async (chatDoc) => {
          const chat = convertToChat(chatDoc);
          
          // Get initial messages for this chat
          const messagesRef = collection(db, 'chats', chat.id, 'messages');
          const messagesQuery = query(
            messagesRef, 
            orderBy('timestamp', 'desc'),
            limit(this.MESSAGES_PER_PAGE)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          
          // Convert and reverse messages to show newest last
          chat.messages = messagesSnapshot.docs
            .map(convertToMessage)
            .reverse();
          
          return chat;
        });

        const chats = await Promise.all(chatsPromises);
        console.log('✅ Chats updated:', chats.length);
        callback(chats);
      });

      return () => this.cleanup();
    } catch (error) {
      console.error('❌ Error in chat subscription:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.unsubscribeFromChats) {
      console.log('🔵 Cleaning up subscription service');
      this.unsubscribeFromChats();
      this.unsubscribeFromChats = null;
    }
  }
}