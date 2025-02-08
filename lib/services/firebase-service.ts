import { FirebaseServiceInterface, ChatSubscriptionCallback } from './firebase/types';
import { ChatService } from './firebase/chat-service';
import { MessageService } from './firebase/message-service';
import { SubscriptionService } from './firebase/subscription-service';
import { Chat, Message, MessagePreview } from '../types';

export class FirebaseService implements FirebaseServiceInterface {
  private static instance: FirebaseService;
  private chatService: ChatService;
  private messageService: MessageService;
  private subscriptionService: SubscriptionService;
  private activeSubscriptions = new Set<string>();
  private isOffline = false;

  private constructor() {
    console.log('🔵 [FirebaseService] Initializing services');
    this.chatService = new ChatService();
    this.messageService = new MessageService();
    this.subscriptionService = SubscriptionService.getInstance();
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      console.log('🔵 [FirebaseService] Creating new instance');
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  subscribeToChatUpdates(callback: ChatSubscriptionCallback) {
    return this.subscriptionService.subscribeToChatUpdates(callback);
  }

  async loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]> {
    return this.messageService.loadMoreMessages(chatId, lastMessageId);
  }

  async createOrGetChat(phoneNumber: string): Promise<Chat> {
    return this.chatService.createOrGetChat(phoneNumber);
  }

  async sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
    return this.messageService.sendMessage(chatId, content, preview, isFromAdmin);
  }

  async updateOnlineStatus(chatId: string, isOnline: boolean): Promise<void> {
    return this.chatService.updateOnlineStatus(chatId, isOnline);
  }

  async updateContactName(chatId: string, newName: string): Promise<void> {
    return this.chatService.updateContactName(chatId, newName);
  }

  cleanup() {
    console.log('🔵 [FirebaseService] Cleaning up service');
    this.subscriptionService.cleanup();
  }
}