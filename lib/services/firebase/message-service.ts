"use client";

import { collection, query, orderBy, limit, startAfter, doc, getDoc, addDoc, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, MessagePreview } from '@/lib/types';
import { convertToMessage } from './converters';

export class MessageService {
  private readonly MESSAGES_PER_PAGE = 50;

  async loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]> {
    try {
      console.log('🔵 [MessageService] Loading more messages:', { chatId, lastMessageId });
      
      const lastMessageRef = doc(db, 'chats', chatId, 'messages', lastMessageId);
      const lastMessageDoc = await getDoc(lastMessageRef);
      
      if (!lastMessageDoc.exists()) {
        console.error('❌ [MessageService] Last message not found');
        throw new Error('Last message not found');
      }

      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastMessageDoc),
        limit(this.MESSAGES_PER_PAGE)
      );
      
      const messagesSnapshot = await getDocs(q);
      const newMessages = messagesSnapshot.docs
        .map(convertToMessage)
        .reverse();
      
      console.log('✅ [MessageService] Loaded more messages:', newMessages.length);
      return newMessages;
    } catch (error) {
      console.error('❌ [MessageService] Error loading more messages:', error);
      throw error;
    }
  }

  private async validateChat(chatId: string): Promise<void> {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      console.error('❌ [MessageService] Chat not found:', chatId);
      throw new Error('Chat not found');
    }
  }

  async sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
    try {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }

      if (!content.trim() && !preview) {
        throw new Error('Message content or preview is required');
      }

      // Validate chat exists
      await this.validateChat(chatId);

      console.log('🔵 [MessageService] Sending message:', { 
        chatId, 
        hasContent: !!content, 
        hasPreview: !!preview,
        isFromAdmin,
        timestamp: new Date().toISOString()
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      
      const messageData = {
        content: preview ? '' : content.trim(),
        time,
        sent: !isFromAdmin,
        status: "sent",
        preview: preview || null,
        timestamp: serverTimestamp(),
        unread: true
      };

      // Add the message
      const messageDoc = await addDoc(messagesRef, messageData);
      console.log('✅ [MessageService] Message added:', messageDoc.id);

      // Get current unread count
      const chatDoc = await getDoc(chatRef);
      const currentUnread = chatDoc.data()?.unread || 0;

      // Update chat with last message info
      const lastMessage = preview ? 
        preview.type === 'image' ? '📷 Photo' : `📄 ${preview.name}` :
        content.trim();

      const updates = {
        lastMessage,
        time,
        lastMessageTime: serverTimestamp()
      };

      // Only update unread count for user messages
      if (!isFromAdmin) {
        updates['unread'] = currentUnread + 1;
      }

      await updateDoc(chatRef, updates);
      console.log('✅ [MessageService] Chat updated with last message');
    } catch (error) {
      console.error('❌ [MessageService] Error sending message:', error);
      throw error;
    }
  }

  async sendUserMessage(chatId: string, content: string, preview: MessagePreview | null = null): Promise<void> {
    return this.sendMessage(chatId, content, preview, false);
  }

  async sendAdminMessage(chatId: string, content: string, preview: MessagePreview | null = null): Promise<void> {
    return this.sendMessage(chatId, content, preview, true);
  }

  async markMessagesAsRead(chatId: string): Promise<void> {
    try {
      console.log('🔵 [MessageService] Marking messages as read:', chatId);
      const chatRef = doc(db, 'chats', chatId);
      
      await updateDoc(chatRef, {
        unread: 0
      });
      
      console.log('✅ [MessageService] Messages marked as read');
    } catch (error) {
      console.error('❌ [MessageService] Error marking messages as read:', error);
      throw error;
    }
  }
}