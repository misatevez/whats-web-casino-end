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

  const { profile: adminData, updateProfile: setAdminData, isLoading: isLoadingProfile } = useAdminProfile();
  const { chats, isLoading: isLoadingChats } = useChatSubscription();

  // Preload images from all chats
  useEffect(() => {
    if (!chats.length || isInitializing) return;

    const preloadImages = async () => {
      const imageUrls = new Set<string>();

      // Collect all unique image URLs from chats
      chats.forEach(chat => {
        // Add avatar
        imageUrls.add(chat.avatar);

        // Add message images
        chat.messages.forEach(message => {
          if (message.preview?.type === 'image') {
            imageUrls.add(message.preview.url);
          }
        });
      });

      // Preload all images
      const preloadPromises = Array.from(imageUrls).map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(preloadPromises);
        console.log('✅ All chat images preloaded');
        setIsInitializing(false);
      } catch (error) {
        console.error('❌ Error preloading images:', error);
        setIsInitializing(false);
      }
    };

    preloadImages();
  }, [chats, isInitializing]);

  // Controlled chat selection
  const handleChatSelect = useCallback((chat: Chat) => {
    if (selectedChatRef.current === chat.id) return;
    selectedChatRef.current = chat.id;
    setSelectedChat(chat);
  }, []);

  // Update selected chat when chats update
  useEffect(() => {
    if (!selectedChatRef.current || !chats.length) return;

    const updatedSelectedChat = chats.find(chat => chat.id === selectedChatRef.current);
    if (updatedSelectedChat) {
      setSelectedChat(updatedSelectedChat);
    }
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