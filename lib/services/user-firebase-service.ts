import { UserChatService } from './firebase/user-chat-service';
import { UserSubscriptionService } from './firebase/user-subscription-service';
import { MessageService } from './firebase/message-service';
import { Chat, Message, MessagePreview } from '../types';

export class UserFirebaseService {
  private static instance: UserFirebaseService;
  private chatService: UserChatService;
  private messageService: MessageService;
  private subscriptionService: UserSubscriptionService;

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

  subscribeToChatUpdates(phoneNumber: string, callback: (chat: Chat | null) => void) {
    return this.subscriptionService.subscribeToChatUpdates(phoneNumber, callback);
  }

  async loadMoreMessages(chatId: string, lastMessageId: string): Promise<Message[]> {
    return this.messageService.loadMoreMessages(chatId, lastMessageId);
  }

  async getUserChat(phoneNumber: string): Promise<Chat | null> {
    return this.chatService.getUserChat(phoneNumber);
  }

  async createUserChat(phoneNumber: string): Promise<Chat> {
    return this.chatService.createUserChat(phoneNumber);
  }

  async sendMessage(chatId: string, content: string, preview: MessagePreview | null = null, isFromAdmin: boolean = false): Promise<void> {
    return this.messageService.sendMessage(chatId, content, preview, isFromAdmin);
  }

  async updateOnlineStatus(chatId: string, isOnline: boolean): Promise<void> {
    return this.chatService.updateUserOnlineStatus(chatId, isOnline);
  }

  cleanup() {
    this.subscriptionService.cleanup();
  }
}