// lib/firestore/messages.ts

import { db } from "../firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore"
import type { Message } from "@/types/interfaces"

export const fetchChatMessages = async (chatId: string): Promise<Message[]> => {
  console.log("[Firestore] Fetching chat messages for chatId:", chatId)
  const messagesRef = collection(db, `chats/${chatId}/messages`)
  const q = query(messagesRef, orderBy("timestamp"))
  const snapshot = await getDocs(q)
  const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
  console.log("[Firestore] Fetched messages:", messages.length)
  return messages
}

export const sendMessage = async (chatId: string, message: Omit<Message, "id">): Promise<string> => {
  console.log("[Firestore] Sending message to chatId:", chatId)
  const messagesRef = collection(db, `chats/${chatId}/messages`)
  const docRef = await addDoc(messagesRef, { ...message, timestamp: serverTimestamp() })
  console.log("[Firestore] Message sent, ID:", docRef.id)
  return docRef.id
}

export const updateMessageStatus = async (chatId: string, messageId: string, status: string): Promise<void> => {
  console.log("[Firestore] Updating message status:", chatId, messageId, status)
  const messageRef = doc(db, `chats/${chatId}/messages`, messageId)
  await updateDoc(messageRef, { status })
  console.log("[Firestore] Message status updated")
}

export const addMessageToChat = async (chatId: string, message: Omit<Message, "id">): Promise<string> => {
  console.log("[Firestore] Adding message to chat:", chatId, message)
  const messagesRef = collection(db, `chats/${chatId}/messages`)
  const docRef = await addDoc(messagesRef, { ...message, timestamp: serverTimestamp() })
  console.log("[Firestore] Message added to chat, ID:", docRef.id)
  return docRef.id
}

export const markMessagesAsRead = async (chatId: string, lastMessageId: string): Promise<void> => {
  console.log("[Firestore] Marking messages as read:", chatId, lastMessageId)
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`)
    const q = query(messagesRef, orderBy("timestamp"))
    const snapshot = await getDocs(q)

    const batch = writeBatch(db)
    snapshot.docs.forEach((doc) => {
      if (doc.id <= lastMessageId && doc.data().status !== "read") {
        batch.update(doc.ref, { status: "read" })
      }
    })

    await batch.commit()
    console.log("[Firestore] Messages marked as read")
  } catch (error) {
    console.error("[Firestore] Error in markMessagesAsRead:", error)
    throw error
  }
}

export const getUnreadCount = (messages: Message[], lastReadMessageId?: string): number => {
  if (!lastReadMessageId) return messages.length
  const lastReadIndex = messages.findIndex((m) => m.id === lastReadMessageId)
  return lastReadIndex === -1 ? messages.length : messages.length - lastReadIndex - 1
}


export const sendInitialMessage = async (chatId: string, dispatch: any): Promise<void> => {
  console.log("[Firestore] Sending initial message for chatId:", chatId);

  // Definimos el mensaje inicial (mensaje de bienvenida del admin)
  const initialMessage: Omit<Message, "id"> = {
    content: "¡Hola! ¿En qué puedo ayudarte?",
    // Usamos un timestamp local; si prefieres, se puede dejar que addMessageToChat lo asigne con serverTimestamp()
    timestamp: new Date().toISOString(),
    isOutgoing: true,  // true indica que es un mensaje enviado por el admin
    type: "text",
    status: "sent",
  };

  // Agregamos el mensaje a la subcolección "messages" del chat
  const messageId = await addMessageToChat(chatId, initialMessage);

  // Preparamos un timestamp para actualizar el documento del chat.
  // Este valor se usará en el campo "timestamp" y "lastReadByAdmin".
  const newTimestamp = new Date().toISOString();

  // Actualizamos el documento del chat con los campos necesarios para el cálculo:
  // - "timestamp": representa el último mensaje del admin.
  // - "lastReadByAdmin": indica que el admin ya "leyó" ese mensaje.
  // (No se actualiza lastMessageUserTimestamp, ya que aún no hay mensaje del usuario)
  const chatDocRef = doc(db, "chats", chatId);
  await updateDoc(chatDocRef, {
    timestamp: newTimestamp,
    lastReadByAdmin: newTimestamp,
    lastMessageAdmin: initialMessage.content, // opcional, para guardar el contenido del último mensaje admin
  });

  // Despachamos las acciones para actualizar el estado local (por ejemplo, en Redux)
  dispatch({
    type: "ADD_MESSAGE",
    payload: { chatId, message: { ...initialMessage, id: messageId, timestamp: newTimestamp } },
  });
  dispatch({
    type: "UPDATE_CHAT",
    payload: {
      id: chatId,
      timestamp: newTimestamp,
      lastReadByAdmin: newTimestamp,
      lastMessageAdmin: initialMessage.content,
    },
  });

  console.log("[Firestore] Initial message sent and dispatched");
};

