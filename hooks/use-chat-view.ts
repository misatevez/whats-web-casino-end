import { useState, useEffect } from 'react';
import { Chat, MessagePreview } from '@/lib/types';
import { FirebaseService } from '@/lib/services/firebase-service';
import { CacheManager } from '@/lib/storage/cache-manager';
import { toast } from 'sonner';

// Create two separate hooks for admin and user chat views
export function useAdminChatView(chat: Chat) {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const firebaseService = FirebaseService.getInstance();
  const cacheManager = CacheManager.getInstance(chat.phoneNumber);

  // Preload and cache all media
  useEffect(() => {
    const preloadMedia = async () => {
      if (!chat.messages.length) {
        setIsInitializing(false);
        return;
      }

      try {
        const imageUrls = new Set<string>();
        imageUrls.add(chat.avatar);
        chat.messages.forEach(message => {
          if (message.preview?.type === 'image') {
            imageUrls.add(message.preview.url);
          }
        });

        const preloadPromises = Array.from(imageUrls).map(async url => {
          const cachedResponse = await cacheManager.getCachedImage(url);
          if (cachedResponse) {
            console.log('✅ Image loaded from cache:', url);
            return;
          }

          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
              try {
                await cacheManager.cacheImage(url);
                console.log('✅ Image cached:', url);
                resolve(undefined);
              } catch (error) {
                console.error('❌ Error caching image:', error);
                reject(error);
              }
            };
            img.onerror = reject;
            img.src = url;
          });
        });

        await Promise.all(preloadPromises);
        console.log('✅ All media preloaded and cached');
      } catch (error) {
        console.error('❌ Error preloading media:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    preloadMedia();
  }, [chat]);

  const handleSendMessage = async (content: string, preview: MessagePreview | null = null) => {
    if ((!content.trim() && !preview)) return;

    try {
      console.log('🔵 [useAdminChatView] Sending admin message:', {
        chatId: chat.id,
        content,
        hasPreview: !!preview,
        hook: 'useAdminChatView'
      });
      await firebaseService.sendAdminMessage(chat.id, content, preview);
    } catch (error) {
      console.error('❌ [useAdminChatView] Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleImageClick = async (imageUrl: string) => {
    try {
      const cachedImage = await cacheManager.getCachedImage(imageUrl);
      if (cachedImage) {
        const objectUrl = URL.createObjectURL(await cachedImage.blob());
        setSelectedImage(objectUrl);
      } else {
        setSelectedImage(imageUrl);
      }
      setShowImageViewer(true);
    } catch (error) {
      console.error('Error loading image:', error);
      setSelectedImage(imageUrl);
      setShowImageViewer(true);
    }
  };

  return {
    showImageViewer,
    setShowImageViewer,
    selectedImage,
    setSelectedImage,
    handleSendMessage,
    handleImageClick,
    isLoadingMore,
    isInitializing
  };
}

export function useUserChatView(chat: Chat) {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const firebaseService = FirebaseService.getInstance();
  const cacheManager = CacheManager.getInstance(chat.phoneNumber);

  // Preload and cache all media
  useEffect(() => {
    const preloadMedia = async () => {
      if (!chat.messages.length) {
        setIsInitializing(false);
        return;
      }

      try {
        const imageUrls = new Set<string>();
        imageUrls.add(chat.avatar);
        chat.messages.forEach(message => {
          if (message.preview?.type === 'image') {
            imageUrls.add(message.preview.url);
          }
        });

        const preloadPromises = Array.from(imageUrls).map(async url => {
          const cachedResponse = await cacheManager.getCachedImage(url);
          if (cachedResponse) {
            console.log('✅ Image loaded from cache:', url);
            return;
          }

          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
              try {
                await cacheManager.cacheImage(url);
                console.log('✅ Image cached:', url);
                resolve(undefined);
              } catch (error) {
                console.error('❌ Error caching image:', error);
                reject(error);
              }
            };
            img.onerror = reject;
            img.src = url;
          });
        });

        await Promise.all(preloadPromises);
        console.log('✅ All media preloaded and cached');
      } catch (error) {
        console.error('❌ Error preloading media:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    preloadMedia();
  }, [chat]);

  const handleSendMessage = async (content: string, preview: MessagePreview | null = null) => {
    if ((!content.trim() && !preview)) return;

    try {
      console.log('🔵 [useUserChatView] Sending user message:', {
        chatId: chat.id,
        content,
        hasPreview: !!preview,
        hook: 'useUserChatView'
      });
      await firebaseService.sendUserMessage(chat.id, content, preview);
    } catch (error) {
      console.error('❌ [useUserChatView] Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleImageClick = async (imageUrl: string) => {
    try {
      const cachedImage = await cacheManager.getCachedImage(imageUrl);
      if (cachedImage) {
        const objectUrl = URL.createObjectURL(await cachedImage.blob());
        setSelectedImage(objectUrl);
      } else {
        setSelectedImage(imageUrl);
      }
      setShowImageViewer(true);
    } catch (error) {
      console.error('Error loading image:', error);
      setSelectedImage(imageUrl);
      setShowImageViewer(true);
    }
  };

  return {
    showImageViewer,
    setShowImageViewer,
    selectedImage,
    setSelectedImage,
    handleSendMessage,
    handleImageClick,
    isLoadingMore,
    isInitializing
  };
}