"use client";

import { FirebaseService } from '../services/firebase-service';
import { Chat, MessagePreview } from "../types";

const firebaseService = FirebaseService.getInstance();

// Update online status
export async function updateOnlineStatus(chatId: string, isOnline: boolean): Promise<void> {
  return firebaseService.updateOnlineStatus(chatId, isOnline);
}

// Update contact name
export async function updateContactName(chatId: string, newName: string): Promise<void> {
  try {
    console.log('🔵 Updating contact name:', { chatId, newName });
    await firebaseService.updateContactName(chatId, newName);
    console.log('✅ Contact name updated successfully');
  } catch (error) {
    console.error('❌ Error updating contact name:', error);
    throw error;
  }
}

// Subscribe to chats
export function subscribeToChats(callback: (chats: Chat[]) => void) {
  return firebaseService.subscribeToChatUpdates(callback);
}

// Create or get chat
export async function createOrGetChat(phoneNumber: string): Promise<Chat> {
  return firebaseService.createOrGetChat(phoneNumber);
}

// Send message
export async function sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
  return firebaseService.sendMessage(chatId, content, preview, isFromAdmin);
}