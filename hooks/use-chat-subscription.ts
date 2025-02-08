import { useState, useEffect, useCallback } from 'react';
import { FirebaseService } from '@/lib/services/firebase-service';
import { Chat } from '@/lib/types';

export function useChatSubscription() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseService, setFirebaseService] = useState<FirebaseService | null>(null);

  // Memoize the chat update handler
  const handleChatsUpdate = useCallback((updatedChats: Chat[]) => {
    setChats(prevChats => {
      // Only update if there are actual changes
      if (JSON.stringify(prevChats) !== JSON.stringify(updatedChats)) {
        return updatedChats;
      }
      return prevChats;
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFirebaseService(FirebaseService.getInstance());
    }
  }, []);

  useEffect(() => {
    if (!firebaseService) return;

    console.log('🔵 Starting chat subscription');
    const unsubscribe = firebaseService.subscribeToChatUpdates(handleChatsUpdate);

    return () => {
      console.log('🔵 Cleaning up chat subscription');
      unsubscribe();
    };
  }, [firebaseService, handleChatsUpdate]);

  return { chats, isLoading };
}