import { Chat, Message, MessagePreview } from "@/lib/types";

const CACHE_VERSION = 'v1';
const MESSAGES_CACHE_KEY = 'whatsapp_messages';
const CHAT_CACHE_KEY = 'whatsapp_chat';
const IMAGE_CACHE_PREFIX = 'whatsapp_image_';
const MAX_CACHED_MESSAGES = 1000;

export class CacheManager {
  private static instance: CacheManager;
  private phoneNumber: string;

  private constructor(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  static getInstance(phoneNumber: string): CacheManager {
    if (!CacheManager.instance || CacheManager.instance.phoneNumber !== phoneNumber) {
      CacheManager.instance = new CacheManager(phoneNumber);
    }
    return CacheManager.instance;
  }

  // Cache chat data
  async cacheChat(chat: Chat): Promise<void> {
    try {
      const key = `${CHAT_CACHE_KEY}_${this.phoneNumber}`;
      localStorage.setItem(key, JSON.stringify({
        ...chat,
        lastUpdated: Date.now()
      }));

      // Cache messages separately for better performance
      await this.cacheMessages(chat.messages);

      // Cache images from messages
      await this.cacheMessageImages(chat.messages);
    } catch (error) {
      console.error('Error caching chat:', error);
    }
  }

  // Get cached chat
  getCachedChat(): Chat | null {
    try {
      const key = `${CHAT_CACHE_KEY}_${this.phoneNumber}`;
      const cachedData = localStorage.getItem(key);
      if (!cachedData) return null;

      const chat = JSON.parse(cachedData);
      const messages = this.getCachedMessages();
      
      return {
        ...chat,
        messages: messages || []
      };
    } catch (error) {
      console.error('Error getting cached chat:', error);
      return null;
    }
  }

  // Cache messages
  private async cacheMessages(messages: Message[]): Promise<void> {
    try {
      const key = `${MESSAGES_CACHE_KEY}_${this.phoneNumber}`;
      // Keep only the last MAX_CACHED_MESSAGES messages
      const messagesToCache = messages.slice(-MAX_CACHED_MESSAGES);
      localStorage.setItem(key, JSON.stringify({
        messages: messagesToCache,
        lastUpdated: Date.now()
      }));
    } catch (error) {
      console.error('Error caching messages:', error);
    }
  }

  // Get cached messages
  private getCachedMessages(): Message[] | null {
    try {
      const key = `${MESSAGES_CACHE_KEY}_${this.phoneNumber}`;
      const cachedData = localStorage.getItem(key);
      if (!cachedData) return null;

      const { messages } = JSON.parse(cachedData);
      return messages;
    } catch (error) {
      console.error('Error getting cached messages:', error);
      return null;
    }
  }

  // Cache a single image
  async cacheImage(url: string): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(`${CACHE_VERSION}_images`);
      const response = await fetch(url);
      await cache.put(url, response.clone());
    } catch (error) {
      console.error('Error caching image:', error);
    }
  }

  // Cache message images
  private async cacheMessageImages(messages: Message[]): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const imagesToCache = messages
        .filter(msg => msg.preview?.type === 'image')
        .map(msg => msg.preview?.url)
        .filter((url): url is string => !!url);

      await Promise.all(
        imagesToCache.map(url => this.cacheImage(url))
      );
    } catch (error) {
      console.error('Error caching message images:', error);
    }
  }

  // Get cached image
  async getCachedImage(url: string): Promise<Response | null> {
    if (!('caches' in window)) return null;

    try {
      const cache = await caches.open(`${CACHE_VERSION}_images`);
      const response = await cache.match(url);
      return response || null;
    } catch (error) {
      console.error('Error getting cached image:', error);
      return null;
    }
  }

  // Update cached messages with new ones
  async updateCachedMessages(newMessages: Message[]): Promise<void> {
    const cachedMessages = this.getCachedMessages() || [];
    const updatedMessages = [...cachedMessages, ...newMessages];
    await this.cacheMessages(updatedMessages);
    await this.cacheMessageImages(newMessages);
  }

  // Clear cache for a specific user
  async clearCache(): Promise<void> {
    try {
      // Clear localStorage
      localStorage.removeItem(`${CHAT_CACHE_KEY}_${this.phoneNumber}`);
      localStorage.removeItem(`${MESSAGES_CACHE_KEY}_${this.phoneNumber}`);

      // Clear image cache
      if ('caches' in window) {
        await caches.delete(`${CACHE_VERSION}_images`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}