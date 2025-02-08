import { FirebaseServiceInterface, ChatSubscriptionCallback } from './firebase/types';
import { ChatService } from './firebase/chat-service';
import { MessageService } from './firebase/message-service';
import { SubscriptionService } from './firebase/subscription-service';
import { Chat, Message, MessagePreview } from '../types';

export class FirebaseService implements FirebaseServiceInterface {
  private chatService: ChatService;
  private messageService: MessageService;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.chatService = new ChatService();
    this.messageService = new MessageService();
    this.subscriptionService = new SubscriptionService();
  }

  static createInstance(): FirebaseService {
    return new FirebaseService();
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
    this.subscriptionService.cleanup();
  }
}