import { collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat, MessagePreview } from '@/lib/types';
import { convertToChat } from './converters';

export class UserChatService {
  async getUserChat(phoneNumber: string): Promise<Chat | null> {
    try {
      console.log('🔵 Getting user chat for phone number:', phoneNumber);
      
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('✅ User chat found');
        return convertToChat(querySnapshot.docs[0]);
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting user chat:', error);
      throw error;
    }
  }

  async createUserChat(phoneNumber: string): Promise<Chat> {
    try {
      console.log('🔵 Creating new user chat');
      const chatData = {
        name: phoneNumber,
        phoneNumber,
        lastMessage: "¡Hola! ¿Cómo podemos ayudarte?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 1,
        avatar: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
        online: false,
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);
      const chatId = docRef.id;

      // Create welcome message
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        content: "¡Hola! ¿Cómo podemos ayudarte?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: false,
        status: "sent",
        timestamp: serverTimestamp()
      });

      console.log('✅ User chat created successfully');
      return {
        id: chatId,
        ...chatData,
        messages: []
      } as Chat;
    } catch (error) {
      console.error('❌ Error creating user chat:', error);
      throw error;
    }
  }

  async updateUserOnlineStatus(chatId: string, isOnline: boolean): Promise<void> {
    try {
      console.log('🔵 Updating user online status:', { chatId, isOnline });
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        online: isOnline,
        lastSeen: serverTimestamp()
      });
      console.log('✅ User online status updated successfully');
    } catch (error) {
      console.error('❌ Error updating user online status:', error);
      throw error;
    }
  }
}