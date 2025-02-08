import { useState, useEffect } from 'react';
import { FirebaseService } from '@/lib/services/firebase-service';
import { Chat } from '@/lib/types';

export function useChatSubscription() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseService, setFirebaseService] = useState<FirebaseService | null>(null);

  useEffect(() => {
    // Inicializar FirebaseService solo en el cliente
    if (typeof window !== 'undefined') {
      setFirebaseService(FirebaseService.createInstance());
    }
  }, []);

  useEffect(() => {
    if (!firebaseService) return;

    console.log('🔵 Iniciando suscripción a chats');
    const unsubscribe = firebaseService.subscribeToChatUpdates((updatedChats) => {
      console.log('✅ Chats actualizados:', updatedChats);
      setChats(updatedChats);
      setIsLoading(false);
    });

    return () => {
      console.log('🔵 Limpiando suscripción a chats');
      unsubscribe();
    };
  }, [firebaseService]);

  return { chats, isLoading };
}