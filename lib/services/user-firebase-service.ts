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

    // Primero intentamos cargar desde caché
    const cachedChat = this.cacheManager?.getCachedChat();
    if (cachedChat) {
      console.log('🔵 Chat loaded from cache');
      callback(cachedChat);
    }

    // Luego nos suscribimos a actualizaciones en tiempo real
    return this.subscriptionService.subscribeToChatUpdates(phoneNumber, async (chat) => {
      if (chat) {
        // Actualizamos el caché con los nuevos datos
        await this.cacheManager?.cacheChat(chat);
      }
      callback(chat);
    });
  }

  async loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]> {
    const messages = await this.messageService.loadMoreMessages(chatId, lastMessageId);
    // Actualizamos el caché con los mensajes antiguos
    await this.cacheManager?.updateCachedMessages(messages);
    return messages;
  }

  async getUserChat(phoneNumber: string): Promise<Chat | null> {
    this.initializeCache(phoneNumber);
    
    // Primero intentamos obtener del caché
    const cachedChat = this.cacheManager?.getCachedChat();
    if (cachedChat) {
      console.log('🔵 Chat found in cache');
      return cachedChat;
    }

    // Si no está en caché, lo obtenemos de Firebase
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

  async sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
    await this.messageService.sendMessage(chatId, content, preview, isFromAdmin);
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