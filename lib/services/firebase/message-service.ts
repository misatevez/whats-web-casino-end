import { collection, query, orderBy, limit, startAfter, doc, getDoc, addDoc, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, MessagePreview } from '@/lib/types';
import { convertToMessage } from './converters';

export class MessageService {
  private readonly MESSAGES_PER_PAGE = 50;

  async loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]> {
    try {
      console.log('🔵 [MessageService] Loading more messages:', { chatId, lastMessageId });
      
      // Get the last message document
      const lastMessageRef = doc(db, 'chats', chatId, 'messages', lastMessageId);
      const lastMessageDoc = await getDoc(lastMessageRef);
      
      if (!lastMessageDoc.exists()) {
        console.error('❌ [MessageService] Last message not found');
        throw new Error('Last message not found');
      }

      // Query for older messages
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

  async sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
    try {
      console.log('🔵 [MessageService] Sending message:', { 
        chatId, 
        hasContent: !!content, 
        hasPreview: !!preview, 
        isFromAdmin 
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(chatRef, 'messages');
      
      const messageData = {
        content: preview ? '' : content,
        time,
        sent: !isFromAdmin,
        status: "sent",
        preview: preview || null,
        timestamp: serverTimestamp()
      };

      // Add the message
      const messageDoc = await addDoc(messagesRef, messageData);
      console.log('✅ [MessageService] Message added:', messageDoc.id);

      // Update the chat with the last message info
      const lastMessage = preview ? 
        preview.type === 'image' ? '📷 Photo' : `📄 ${preview.name}` :
        content;

      await updateDoc(chatRef, {
        lastMessage,
        time,
        lastMessageTime: serverTimestamp(),
        unread: isFromAdmin ? 1 : 0
      });

      console.log('✅ [MessageService] Chat updated with last message');
    } catch (error) {
      console.error('❌ [MessageService] Error sending message:', error);
      throw error;
    }
  }
}