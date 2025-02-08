import { DocumentData } from 'firebase/firestore';
import { Chat, Message } from '@/lib/types';

export function convertToChat(doc: DocumentData): Chat {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    phoneNumber: data.phoneNumber || '',
    lastMessage: data.lastMessage || '',
    time: data.time || '',
    unread: data.unread || 0,
    avatar: data.avatar || "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
    online: data.online || false,
    messages: [],
    about: data.about || "Hey there! I am using WhatsApp"
  };
}

export function convertToMessage(doc: DocumentData): Message {
  const data = doc.data();
  return {
    id: doc.id,
    content: data.content || '',
    time: data.time || '',
    sent: data.sent || false,
    status: data.status || 'sent',
    preview: data.preview || undefined
  };
}