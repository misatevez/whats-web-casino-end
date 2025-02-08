"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Chat, UserProfile } from "@/lib/types";
import { useAdminProfile } from "./use-admin-profile";
import { useChatSubscription } from "./use-chat-subscription";

export function useAdminChat() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const selectedChatRef = useRef<string | null>(null);
  const isPreloadingRef = useRef(false);
  const lastUpdateRef = useRef<string>('');

  const { profile: adminData, updateProfile: setAdminData, isLoading: isLoadingProfile } = useAdminProfile();
  const { chats, isLoading: isLoadingChats } = useChatSubscription();

  // Preload images from all chats
  useEffect(() => {
    if (!chats.length || isPreloadingRef.current) return;

    const preloadImages = async () => {
      try {
        isPreloadingRef.current = true;
        console.log('🔵 [useAdminChat] Starting initial image preload');
        
        const imageUrls = new Set<string>();
        const preloadPromises: Promise<void>[] = [];

        // Collect all unique image URLs from chats
        chats.forEach(chat => {
          // Add avatar if not already preloading
          if (!imageUrls.has(chat.avatar)) {
            imageUrls.add(chat.avatar);
            preloadPromises.push(
              new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                  console.log('✅ [useAdminChat] Avatar preloaded:', chat.id);
                  resolve();
                };
                img.onerror = () => {
                  console.warn('⚠️ [useAdminChat] Failed to preload avatar:', chat.id);
                  resolve();
                };
                img.src = chat.avatar;
              })
            );
          }

          // Add message images if not already preloading
          chat.messages.forEach(message => {
            const previewUrl = message.preview?.url;
            if (message.preview?.type === 'image' && previewUrl && !imageUrls.has(previewUrl)) {
              imageUrls.add(previewUrl);
              preloadPromises.push(
                new Promise((resolve) => {
                  const img = new Image();
                  img.onload = () => {
                    console.log('✅ [useAdminChat] Message image preloaded:', previewUrl);
                    resolve();
                  };
                  img.onerror = () => {
                    console.warn('⚠️ [useAdminChat] Failed to preload message image:', previewUrl);
                    resolve();
                  };
                  img.src = previewUrl;
                })
              );
            }
          });
        });

        console.log('🔵 [useAdminChat] Preloading images:', imageUrls.size);
        await Promise.allSettled(preloadPromises);
        console.log('✅ [useAdminChat] All images preloaded');
        
        setIsInitializing(false);
      } catch (error) {
        console.error('❌ [useAdminChat] Error during image preload:', error);
        setIsInitializing(false);
      } finally {
        isPreloadingRef.current = false;
      }
    };

    preloadImages();
  }, [chats]);

  // Controlled chat selection with debounce
  const handleChatSelect = useCallback((chat: Chat) => {
    console.log('🔵 [useAdminChat] Chat selection requested:', {
      currentId: selectedChatRef.current,
      newId: chat.id,
      isInitializing
    });

    if (isInitializing) {
      console.log('🟡 [useAdminChat] Still initializing, deferring selection');
      return;
    }

    if (selectedChatRef.current === chat.id) {
      console.log('🟡 [useAdminChat] Chat already selected, skipping');
      return;
    }

    console.log('✅ [useAdminChat] Updating selected chat:', chat.id);
    selectedChatRef.current = chat.id;
    setSelectedChat(chat);
  }, [isInitializing]);

  // Update selected chat when chats update, with change detection
  useEffect(() => {
    if (!selectedChatRef.current || !chats.length) return;

    const updatedSelectedChat = chats.find(chat => chat.id === selectedChatRef.current);
    if (!updatedSelectedChat) return;

    // Create a hash of relevant chat data to detect real changes
    const chatHash = JSON.stringify({
      id: updatedSelectedChat.id,
      lastMessage: updatedSelectedChat.lastMessage,
      messages: updatedSelectedChat.messages.map(m => m.id),
      online: updatedSelectedChat.online
    });

    if (chatHash === lastUpdateRef.current) {
      console.log('🟡 [useAdminChat] No relevant changes in selected chat, skipping update');
      return;
    }

    console.log('✅ [useAdminChat] Updating selected chat with new data:', updatedSelectedChat.id);
    lastUpdateRef.current = chatHash;
    setSelectedChat(updatedSelectedChat);
  }, [chats]);

  const handleLogout = () => {
    router.push("/admin");
  };

  const handleSaveContact = (chat: Chat) => {
    return false;
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // State
    searchTerm,
    setSearchTerm,
    showProfileSettings,
    setShowProfileSettings,
    selectedChat,
    setSelectedChat: handleChatSelect,
    adminData,
    setAdminData,
    isLoading: isLoadingProfile || isLoadingChats || isInitializing,
    filteredChats,

    // Contact management
    showContactInfo,
    setShowContactInfo,
    handleSaveContact,

    // Handlers
    handleLogout
  };
}