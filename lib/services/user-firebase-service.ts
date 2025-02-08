import { UserChatService } from './firebase/user-chat-service';
import { UserSubscriptionService } from './firebase/user-subscription-service';
import { MessageService } from './firebase/message-service';
import { Chat, Message, MessagePreview } from '../types';
import { CacheManager } from '../storage/cache-manager';

export class UserFirebaseService {
  private static instance: UserFirebaseService;
  private chatService: UserChatService;
  private messageService: MessageService;
  private subscriptionService: UserSubscriptionService;
  private cacheManager: CacheManager | null = null;

  private constructor() {
    this.chatService = new UserChatService();
    this.messageService = new MessageService();
    this.subscriptionService = new UserSubscriptionService();
  }

  static getInstance(): UserFirebaseService {
    if (!UserFirebaseService.instance) {
      UserFirebaseService.instance = new UserFirebaseService();
    }
    return UserFirebaseService.instance;
  }

  private initializeCache(phoneNumber: string) {
    if (!this.cacheManager) {
      this.cacheManager = CacheManager.getInstance(phoneNumber);
    }
  }

  subscribeToChatUpdates(phoneNumber: string, callback: (chat: Chat | null) => void) {
    this.initializeCache(phoneNumber);

    // First try to load from cache
    const cachedChat = this.cacheManager?.getCachedChat();
    if (cachedChat) {
      console.log('✅ Chat loaded from cache');
      callback(cachedChat);
    }

    // Then subscribe to real-time updates
    return this.subscriptionService.subscribeToChatUpdates(phoneNumber, async (chat) => {
      if (chat) {
        await this.cacheManager?.cacheChat(chat);
      }
      callback(chat);
    });
  }

  async loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]> {
    const messages = await this.messageService.loadMoreMessages(chatId, lastMessageId);
    await this.cacheManager?.updateCachedMessages(messages);
    return messages;
  }

  async getUserChat(phoneNumber: string): Promise<Chat | null> {
    this.initializeCache(phoneNumber);
    
    const cachedChat = this.cacheManager?.getCachedChat();
    if (cachedChat) {
      console.log('✅ Chat found in cache');
      return cachedChat;
    }

    const chat = await this.chatService.getUserChat(phoneNumber);
    if (chat) {
      await this.cacheManager?.cacheChat(chat);
    }
    return chat;
  }

  async createUserChat(phoneNumber: string): Promise<Chat> {
    this.initializeCache(phoneNumber);
    const chat = await this.chatService.createUserChat(phoneNumber);
    await this.cacheManager?.cacheChat(chat);
    return chat;
  }

  async sendMessage(chatId: string, content: string, preview: MessagePreview | null = null): Promise<void> {
    try {
      console.log('🔵 [UserFirebaseService] Sending user message:', {
        chatId,
        hasContent: !!content,
        hasPreview: !!preview
      });
      await this.messageService.sendUserMessage(chatId, content, preview);
      console.log('✅ [UserFirebaseService] Message sent successfully');
    } catch (error) {
      console.error('❌ [UserFirebaseService] Error sending message:', error);
      throw error;
    }
  }

  async updateOnlineStatus(chatId: string, isOnline: boolean): Promise<void> {
    return this.chatService.updateUserOnlineStatus(chatId, isOnline);
  }

  async clearCache(phoneNumber: string) {
    this.initializeCache(phoneNumber);
    await this.cacheManager?.clearCache();
  }

  cleanup() {
    this.subscriptionService.cleanup();
  }
}