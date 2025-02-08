"use client";

import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { MessagePreview } from "../types";

// Create welcome message
export async function createWelcomeMessage(chatId: string): Promise<void> {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    content: "¡Hola! ¿Cómo podemos ayudarte?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sent: false,
    status: "sent",
    timestamp: serverTimestamp()
  });
}

// Send message
export async function sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
  try {
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
    await addDoc(messagesRef, messageData);

    // Update the chat with the last message info
    await updateDoc(chatRef, {
      lastMessage: preview ? 
        preview.type === 'image' ? '📷 Photo' : `📄 ${preview.name}` :
        content,
      time,
      lastMessageTime: serverTimestamp(),
      unread: isFromAdmin ? 1 : 0
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Mark message as read
export async function markMessageAsRead(chatId: string, messageId: string): Promise<void> {
  try {
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    await updateDoc(messageRef, {
      status: "read"
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}