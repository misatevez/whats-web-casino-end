import { FirebaseServiceInterface, ChatSubscriptionCallback } from './firebase/types';
import { ChatService } from './firebase/chat-service';
import { MessageService } from './firebase/message-service';
import { SubscriptionService } from './firebase/subscription-service';
import { Chat, Message, MessagePreview } from '../types';
import { showOfflineToast, showOnlineToast } from '@/components/ui/toast';

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
    this.subscriptionService = SubscriptionService.getInstance(); // 🔹 Ahora usa Singleton
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

  cleanup() {
    console.log('🔵 [FirebaseService] Cleaning up service');
    this.subscriptionService.cleanup();
  }
}
