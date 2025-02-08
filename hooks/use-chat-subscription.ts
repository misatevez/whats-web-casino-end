import { useState, useEffect, useRef, useCallback } from 'react';
import { FirebaseService } from '@/lib/services/firebase-service';
import { Chat } from '@/lib/types';

export function useChatSubscription() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastUpdateRef = useRef<string>('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChatsUpdate = useCallback((updatedChats: Chat[]) => {
    const updateHash = JSON.stringify(updatedChats.map(c => ({
      id: c.id,
      lastMessage: c.lastMessage,
    })));

    if (updateHash === lastUpdateRef.current) {
      console.log('🟡 [useChatSubscription] No changes detected, skipping update');
      return;
    }

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      console.log('🔵 [useChatSubscription] Processing update');
      lastUpdateRef.current = updateHash;
      setChats(updatedChats);
      setIsLoading(false);
    }, 600); 

  }, []);

  useEffect(() => {
    const firebaseService = FirebaseService.getInstance();
    console.log('🔵 [useChatSubscription] Setting up subscription');
    const unsubscribe = firebaseService.subscribeToChatUpdates(handleChatsUpdate);

    return () => {
      console.log('🔵 [useChatSubscription] Cleaning up subscription');
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      unsubscribe();
    };
  }, [handleChatsUpdate]);

  return { chats, isLoading };
}
