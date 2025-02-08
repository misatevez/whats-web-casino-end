import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/lib/types';
import { convertToChat } from './converters';
import { ChatSubscriptionCallback } from './types';

export class SubscriptionService {
  private static instance: SubscriptionService | null = null;
  private unsubscribeFromChats: (() => void) | null = null;
  private activeSubscription = false;
  private lastProcessedUpdate = 0;
  private readonly UPDATE_THROTTLE = 1500; // 🔹 Aumentado a 1.5s
  private callbacks = new Set<ChatSubscriptionCallback>();
  private lastChatIds = new Set<string>();

  private constructor() {}

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  subscribeToChatUpdates(callback: ChatSubscriptionCallback): () => void {
    console.log('🔵 [SubscriptionService] New subscription requested');
    this.callbacks.add(callback);

    if (!this.activeSubscription) {
      this.startGlobalSubscription();
    }

    return () => {
      console.log('🔵 [SubscriptionService] Unsubscribing callback');
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.cleanup();
      }
    };
  }

  private async startGlobalSubscription() {
    if (this.activeSubscription) {
      console.log('🟡 [SubscriptionService] Subscription already active');
      return;
    }

    try {
      console.log('🔵 [SubscriptionService] Starting global subscription');
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, orderBy('lastMessageTime', 'desc'));

      const initialSnapshot = await getDocs(q);
      await this.processSnapshot(initialSnapshot);

      this.unsubscribeFromChats = onSnapshot(q, async (snapshot) => {
        const now = Date.now();
        if (now - this.lastProcessedUpdate < this.UPDATE_THROTTLE) {
          console.log('🟡 [SubscriptionService] Update throttled');
          return;
        }

        await this.processSnapshot(snapshot);
      });

      this.activeSubscription = true;
      console.log('✅ [SubscriptionService] Global subscription active');
    } catch (error) {
      console.error('❌ [SubscriptionService] Error starting subscription:', error);
      this.activeSubscription = false;
    }
  }

  private async processSnapshot(snapshot: any) {
    try {
      const chats = snapshot.docs.map((chatDoc: any) => convertToChat(chatDoc));

      const newChatIds = new Set(chats.map(chat => chat.id));

      if (this.lastChatIds.size === newChatIds.size &&
          [...this.lastChatIds].every(id => newChatIds.has(id))) {
        console.log('🟡 [SubscriptionService] No new chats detected, skipping update');
        return;
      }

      this.lastChatIds = newChatIds;
      this.lastProcessedUpdate = Date.now();

      this.callbacks.forEach(callback => callback(chats));

      console.log('✅ [SubscriptionService] Update processed:', {
        chats: chats.length,
        subscribers: this.callbacks.size
      });
    } catch (error) {
      console.error('❌ [SubscriptionService] Error processing snapshot:', error);
    }
  }

  cleanup() {
    console.log('🔵 [SubscriptionService] Cleaning up');
    if (this.unsubscribeFromChats) {
      this.unsubscribeFromChats();
      this.unsubscribeFromChats = null;
    }
    this.activeSubscription = false;
    this.callbacks.clear();
    this.lastChatIds.clear();
    console.log('✅ [SubscriptionService] Cleanup complete');
  }
}
