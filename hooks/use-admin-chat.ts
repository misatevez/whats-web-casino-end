import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chat, UserProfile, initialAdminProfile } from "@/lib/types";
import { useAdminProfile } from "./use-admin-profile";
import { useChatSubscription } from "./use-chat-subscription";
import { useStatusManagement } from "./use-status-management";
import { useContactManagement } from "./use-contact-management";

export function useAdminChat() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { profile: adminData, updateProfile: setAdminData, isLoading } = useAdminProfile();
  const { chats } = useChatSubscription();
  
  // Use initialAdminProfile as fallback when adminData is null
  const statusManagement = useStatusManagement(
    adminData || initialAdminProfile,
    setAdminData
  );
  const contactManagement = useContactManagement();

  const handleLogout = () => {
    router.push("/admin");
  };

  const handleAddNewNumber = () => {
    const newContact = contactManagement.handleAddNumber();
    if (newContact) {
      setSelectedChat(newContact);
    }
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

    // Status management
    ...statusManagement,

    // Contact management
    ...contactManagement,

    // Handlers
    handleLogout,
    handleAddNewNumber
  };
}