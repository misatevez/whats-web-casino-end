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

  private isValidUrl(urlString: string): boolean {
    if (!urlString || typeof urlString !== 'string') {
      console.warn('⚠️ [CacheManager] Invalid URL: Empty or not a string');
      return false;
    }

    try {
      // Clean the URL string
      const cleanUrl = urlString.trim();
      
      // Handle relative URLs by prepending base URL if needed
      const url = cleanUrl.startsWith('/') 
        ? new URL(cleanUrl, window.location.origin)
        : new URL(cleanUrl);

      // Validate protocol
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        console.warn('⚠️ [CacheManager] Invalid URL protocol:', url.protocol);
        return false;
      }

      // Validate hostname
      if (!url.hostname) {
        console.warn('⚠️ [CacheManager] Invalid URL hostname');
        return false;
      }

      return true;
    } catch (error) {
      console.warn('⚠️ [CacheManager] Invalid URL:', urlString, error);
      return false;
    }
  }

  // Cache chat data
  async cacheChat(chat: Chat): Promise<void> {
    try {
      console.log('🔵 [CacheManager] Caching chat:', chat.id);
      const key = `${CHAT_CACHE_KEY}_${this.phoneNumber}`;
      localStorage.setItem(key, JSON.stringify({
        ...chat,
        lastUpdated: Date.now()
      }));

      // Cache messages separately for better performance
      await this.cacheMessages(chat.messages);

      // Cache images from messages
      await this.cacheMessageImages(chat.messages);
      
      console.log('✅ [CacheManager] Chat cached successfully:', chat.id);
    } catch (error) {
      console.error('❌ [CacheManager] Error caching chat:', error);
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
      console.error('❌ [CacheManager] Error getting cached chat:', error);
      return null;
    }
  }

  // Cache messages
  private async cacheMessages(messages: Message[]): Promise<void> {
    try {
      console.log('🔵 [CacheManager] Caching messages:', messages.length);
      const key = `${MESSAGES_CACHE_KEY}_${this.phoneNumber}`;
      // Keep only the last MAX_CACHED_MESSAGES messages
      const messagesToCache = messages.slice(-MAX_CACHED_MESSAGES);
      localStorage.setItem(key, JSON.stringify({
        messages: messagesToCache,
        lastUpdated: Date.now()
      }));
      console.log('✅ [CacheManager] Messages cached successfully');
    } catch (error) {
      console.error('❌ [CacheManager] Error caching messages:', error);
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
      console.error('❌ [CacheManager] Error getting cached messages:', error);
      return null;
    }
  }

  // Cache a single image
  async cacheImage(url: string): Promise<void> {
    if (!('caches' in window)) {
      console.log('⚠️ [CacheManager] Cache API not available');
      return;
    }

    if (!this.isValidUrl(url)) {
      console.warn('⚠️ [CacheManager] Skipping invalid image URL:', url);
      return;
    }

    try {
      console.log('🔵 [CacheManager] Caching image:', url);
      const cache = await caches.open(`${CACHE_VERSION}_images`);
      
      const response = await fetch(url, {
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      }).catch(error => {
        console.warn('⚠️ [CacheManager] Fetch failed, using fallback:', error);
        return new Response(null, { status: 200, statusText: 'OK' });
      });
      
      await cache.put(url, response.clone());
      console.log('✅ [CacheManager] Image cached successfully:', url);
    } catch (error) {
      console.warn('⚠️ [CacheManager] Error caching image:', url, error);
    }
  }

  // Cache message images
  private async cacheMessageImages(messages: Message[]): Promise<void> {
    if (!('caches' in window)) {
      console.log('⚠️ [CacheManager] Cache API not available');
      return;
    }

    try {
      const imagesToCache = messages
        .filter(msg => msg.preview?.type === 'image' && msg.preview?.url)
        .map(msg => msg.preview!.url)
        .filter(url => this.isValidUrl(url));

      if (imagesToCache.length === 0) {
        console.log('🟡 [CacheManager] No valid images to cache');
        return;
      }

      console.log('🔵 [CacheManager] Caching message images:', imagesToCache.length);
      
      const results = await Promise.allSettled(
        imagesToCache.map(url => this.cacheImage(url))
      );
      
      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log('✅ [CacheManager] Image caching completed:', {
        total: imagesToCache.length,
        succeeded,
        failed
      });
    } catch (error) {
      console.error('❌ [CacheManager] Error caching message images:', error);
    }
  }

  // Get cached image
  async getCachedImage(url: string): Promise<Response | null> {
    if (!('caches' in window)) {
      console.log('⚠️ [CacheManager] Cache API not available');
      return null;
    }

    if (!this.isValidUrl(url)) {
      console.warn('⚠️ [CacheManager] Invalid image URL for retrieval:', url);
      return null;
    }

    try {
      console.log('🔵 [CacheManager] Getting cached image:', url);
      const cache = await caches.open(`${CACHE_VERSION}_images`);
      const response = await cache.match(url);
      
      if (response) {
        console.log('✅ [CacheManager] Image found in cache:', url);
      } else {
        console.log('⚠️ [CacheManager] Image not found in cache:', url);
      }
      
      return response;
    } catch (error) {
      console.warn('⚠️ [CacheManager] Error getting cached image:', url, error);
      return null;
    }
  }

  // Update cached messages with new ones
  async updateCachedMessages(newMessages: Message[]): Promise<void> {
    try {
      console.log('🔵 [CacheManager] Updating cached messages');
      const cachedMessages = this.getCachedMessages() || [];
      const updatedMessages = [...cachedMessages, ...newMessages];
      await this.cacheMessages(updatedMessages);
      await this.cacheMessageImages(newMessages);
      console.log('✅ [CacheManager] Cache updated with new messages');
    } catch (error) {
      console.error('❌ [CacheManager] Error updating cached messages:', error);
    }
  }

  // Clear cache for a specific user
  async clearCache(): Promise<void> {
    try {
      console.log('🔵 [CacheManager] Clearing cache');
      // Clear localStorage
      localStorage.removeItem(`${CHAT_CACHE_KEY}_${this.phoneNumber}`);
      localStorage.removeItem(`${MESSAGES_CACHE_KEY}_${this.phoneNumber}`);

      // Clear image cache
      if ('caches' in window) {
        await caches.delete(`${CACHE_VERSION}_images`);
      }
      console.log('✅ [CacheManager] Cache cleared successfully');
    } catch (error) {
      console.error('❌ [CacheManager] Error clearing cache:', error);
    }
  }
}