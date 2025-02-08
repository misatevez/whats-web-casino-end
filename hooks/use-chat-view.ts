import { useState } from 'react';
import { Chat, MessagePreview } from '@/lib/types';
import { FirebaseService } from '@/lib/services/firebase-service';
import { toast } from 'sonner';

export function useChatView(chat: Chat) {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const firebaseService = FirebaseService.getInstance();

  const handleSendMessage = async (content: string, preview: MessagePreview | null) => {
    if ((!content.trim() && !preview)) return;

    try {
      await firebaseService.sendMessage(chat.id, content, preview, true);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !chat.messages.length) return;

    try {
      setIsLoadingMore(true);
      const lastMessage = chat.messages[chat.messages.length - 1];
      await firebaseService.loadMoreMessages(chat.id, lastMessage.id);
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
    isLoadingMore
  };
}