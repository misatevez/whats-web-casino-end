import { collection, query, where, orderBy, onSnapshot, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/lib/types';
import { convertToChat, convertToMessage } from './converters';

export class UserSubscriptionService {
  private unsubscribeFromChat: (() => void) | null = null;
  private readonly MESSAGES_PER_PAGE = 50;

  subscribeToChatUpdates(phoneNumber: string, callback: (chat: Chat | null) => void) {
    try {
      console.log('🔵 Starting user chat subscription for:', phoneNumber);
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('phoneNumber', '==', phoneNumber),
        orderBy('lastMessageTime', 'desc'),
        limit(1)
      );

      this.unsubscribeFromChat = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          console.log('❌ No chat found for phone number:', phoneNumber);
          callback(null);
          return;
        }

        const chatDoc = snapshot.docs[0];
        const chat = convertToChat(chatDoc);
        
        // Get messages for this chat
        const messagesRef = collection(db, 'chats', chat.id, 'messages');
        const messagesQuery = query(
          messagesRef, 
          orderBy('timestamp', 'desc'),
          limit(this.MESSAGES_PER_PAGE)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        
        chat.messages = messagesSnapshot.docs
          .map(convertToMessage)
          .reverse();
        
        console.log('✅ User chat updated:', chat.id);
        callback(chat);
      });

      return () => this.cleanup();
    } catch (error) {
      console.error('❌ Error in user chat subscription:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.unsubscribeFromChat) {
      console.log('🔵 Cleaning up user subscription service');
      this.unsubscribeFromChat();
      this.unsubscribeFromChat = null;
    }
  }
}