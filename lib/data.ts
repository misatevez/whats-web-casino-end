"use client";

import { collection, query, orderBy, onSnapshot, doc, addDoc, serverTimestamp, updateDoc, getDocs, DocumentData, where, getDoc } from 'firebase/firestore';
import { Chat, Message, MessagePreview, UserProfile, Status } from "./types";
import { db } from './firebase';

// Get admin profile from Firebase
export async function getAdminProfile(): Promise<UserProfile> {
  try {
    const profileRef = doc(db, 'admin/profile');
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      throw new Error('Admin profile not found');
    }

    const profileData = profileDoc.data();
    
    // Get statuses
    const statusesRef = collection(db, 'admin/profile/statuses');
    const statusesQuery = query(statusesRef, orderBy('timestamp', 'desc'));
    const statusesSnapshot = await getDocs(statusesQuery);
    
    const statuses: Status[] = statusesSnapshot.docs.map(doc => ({
      id: doc.id,
      imageUrl: doc.data().imageUrl,
      timestamp: doc.data().timestamp,
      caption: doc.data().caption,
      createdAt: doc.data().createdAt,
      fileName: doc.data().fileName
    }));

    return {
      name: profileData.name || '',
      image: profileData.image || '',
      about: profileData.about || '',
      statuses
    };
  } catch (error) {
    throw error;
  }
}

// Convert DocumentData to Chat
function convertToChat(doc: DocumentData): Chat {
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

// Convert DocumentData to Message
function convertToMessage(doc: DocumentData): Message {
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

// Subscribe to chats and their messages in real-time
export function subscribeToChats(callback: (chats: Chat[]) => void) {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, orderBy('lastMessageTime', 'desc'));

  return onSnapshot(q, async (snapshot) => {
    const chatsPromises = snapshot.docs.map(async (chatDoc) => {
      const chat = convertToChat(chatDoc);

      // 🔹 Obtener mensajes del chat
      const messagesRef = collection(db, 'chats', chat.id, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      chat.messages = messagesSnapshot.docs.map(convertToMessage);
      return chat;
    });

    const chats = await Promise.all(chatsPromises);

    // 🔹 Evitar renderizados innecesarios
    const updateHash = JSON.stringify(chats.map(c => ({
      id: c.id,
      lastMessage: c.lastMessage,
    })));

    if (updateHash === (subscribeToChats as any).lastUpdateHash) {
      console.log('🟡 [subscribeToChats] No hay cambios en los chats, omitiendo actualización.');
      return;
    }

    (subscribeToChats as any).lastUpdateHash = updateHash;
    callback(chats);
  });
}

// Create or get existing chat
export async function createOrGetChat(phoneNumber: string): Promise<Chat> {
  try {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('phoneNumber', '==', phoneNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('✅ [createOrGetChat] Chat existente encontrado:', phoneNumber);
      return convertToChat(querySnapshot.docs[0]);
    }

    console.log('🔵 [createOrGetChat] Creando nuevo chat:', phoneNumber);
    
    const chatData = {
      name: phoneNumber,
      phoneNumber,
      lastMessage: "¡Hola! ¿Cómo podemos ayudarte?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 1,
      avatar: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
      online: false,
      lastMessageTime: serverTimestamp()
    };

    const docRef = await addDoc(chatsRef, chatData);
    const chatId = docRef.id;

    // 🔹 Crear mensaje de bienvenida
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      content: "¡Hola! ¿Cómo podemos ayudarte?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: false,
      status: "sent",
      timestamp: serverTimestamp()
    });

    console.log('✅ [createOrGetChat] Chat creado con éxito:', chatId);
    
    return { id: chatId, ...chatData, messages: [] } as Chat;
  } catch (error) {
    console.error('❌ [createOrGetChat] Error creando chat:', error);
    throw error;
  }
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

    // 🔹 Enviar mensaje y actualizar chat en una sola transacción
    await addDoc(messagesRef, messageData);
    await updateDoc(chatRef, {
      lastMessage: preview ? (preview.type === 'image' ? '📷 Photo' : `📄 ${preview.name}`) : content,
      time,
      lastMessageTime: serverTimestamp(),
      unread: isFromAdmin ? 1 : 0
    });

    console.log('✅ [sendMessage] Mensaje enviado con éxito:', messageData);
  } catch (error) {
    console.error('❌ [sendMessage] Error enviando mensaje:', error);
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
    throw error;
  }
}