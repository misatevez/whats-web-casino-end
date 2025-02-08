import { useState } from "react";
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

  const { profile: adminData, updateProfile: setAdminData, isLoading } = useAdminProfile();
  const { chats } = useChatSubscription();

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
    setSelectedChat,
    adminData,
    setAdminData,
    isLoading,
    filteredChats,

    // Contact management
    showContactInfo,
    setShowContactInfo,
    handleSaveContact,

    // Handlers
    handleLogout
  };
}