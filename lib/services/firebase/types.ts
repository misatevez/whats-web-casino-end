import { Chat, Message, MessagePreview } from '@/lib/types';

export interface ChatSubscriptionCallback {
  (chats: Chat[]): void;
}

export interface FirebaseServiceInterface {
  subscribeToChatUpdates(callback: ChatSubscriptionCallback): () => void;
  loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]>;
  createOrGetChat(phoneNumber: string): Promise<Chat>;
  sendUserMessage(chatId: string, content: string, preview: MessagePreview | null): Promise<void>;
  sendAdminMessage(chatId: string, content: string, preview: MessagePreview | null): Promise<void>;
  updateOnlineStatus(chatId: string, isOnline: boolean): Promise<void>;
  updateContactName(chatId: string, newName: string): Promise<void>;
  cleanup(): void;
}