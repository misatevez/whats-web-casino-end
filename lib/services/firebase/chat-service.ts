import { collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat, MessagePreview } from '@/lib/types';
import { convertToChat } from './converters';

export class ChatService {
  async createOrGetChat(phoneNumber: string): Promise<Chat> {
    try {
      console.log('🔵 Creating/getting chat for phone number:', phoneNumber);
      
      // Check if chat already exists
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('✅ Existing chat found');
        return convertToChat(querySnapshot.docs[0]);
      }

      // Create new chat
      console.log('🔵 Creating new chat');
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

      const docRef = await addDoc(chatsRef, chatData);
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

      console.log('✅ New chat created successfully');
      return {
        id: chatId,
        ...chatData,
        messages: []
      } as Chat;
    } catch (error) {
      console.error('❌ Error creating/getting chat:', error);
      throw error;
    }
  }

  async updateOnlineStatus(chatId: string, isOnline: boolean): Promise<void> {
    try {
      console.log('🔵 Updating online status:', { chatId, isOnline });
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        online: isOnline,
        lastSeen: serverTimestamp()
      });
      console.log('✅ Online status updated successfully');
    } catch (error) {
      console.error('❌ Error updating online status:', error);
      throw error;
    }
  }

  async updateContactName(chatId: string, newName: string): Promise<void> {
    try {
      console.log('🔵 Updating contact name:', { chatId, newName });
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        name: newName,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Contact name updated successfully');
    } catch (error) {
      console.error('❌ Error updating contact name:', error);
      throw error;
    }
  }
}