import { useState, useEffect } from 'react';
import { Chat, MessagePreview } from '@/lib/types';
import { FirebaseService } from '@/lib/services/firebase-service';
import { CacheManager } from '@/lib/storage/cache-manager';
import { toast } from 'sonner';

export function useChatView(chat: Chat) {
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

        // Add chat avatar
        imageUrls.add(chat.avatar);

        // Add message images
        chat.messages.forEach(message => {
          if (message.preview?.type === 'image') {
            imageUrls.add(message.preview.url);
          }
        });

        // Preload and cache all images
        const preloadPromises = Array.from(imageUrls).map(async url => {
          // Check cache first
          const cachedResponse = await cacheManager.getCachedImage(url);
          if (cachedResponse) {
            console.log('✅ Image loaded from cache:', url);
            return;
          }

          // If not in cache, load and cache
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

  const handleSendMessage = async (content: string, preview: MessagePreview | null) => {
    if ((!content.trim() && !preview)) return;

    try {
      await firebaseService.sendMessage(chat.id, content, preview, false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleImageClick = async (imageUrl: string) => {
    try {
      // Try to get from cache first
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

  const loadMoreMessages = async () => {
    if (isLoadingMore || !chat.messages.length) return;

    try {
      setIsLoadingMore(true);
      const lastMessage = chat.messages[chat.messages.length - 1];
      const newMessages = await firebaseService.loadMoreMessages(chat.id, lastMessage.id);
      
      // Cache new messages
      await cacheManager.updateCachedMessages(newMessages);
      
      // Preload and cache new message images
      const imageUrls = newMessages
        .filter(msg => msg.preview?.type === 'image')
        .map(msg => msg.preview!.url);
      
      await Promise.all(
        imageUrls.map(url => cacheManager.cacheImage(url))
      );
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    showImageViewer,
    setShowImageViewer,
    selectedImage,
    setSelectedImage,
    handleSendMessage,
    handleImageClick,
    loadMoreMessages,
    isLoadingMore,
    isInitializing
  };
}