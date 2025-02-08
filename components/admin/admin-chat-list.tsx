"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Chat } from "@/lib/types";
import { ChatList } from "@/components/chat/chat-list";
import { FirebaseService } from "@/lib/services/firebase-service";

interface AdminChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onChatSelect: (chat: Chat) => void;
  onSaveContact: (chat: Chat) => void;
  showAbout?: boolean;
}

export function AdminChatList({
  chats,
  selectedChatId,
  searchTerm,
  onSearchChange,
  onChatSelect,
  onSaveContact,
  showAbout
}: AdminChatListProps) {
  console.log('🔵 [AdminChatList] Rendering with:', {
    totalChats: chats.length,
    selectedChatId,
    searchTerm
  });

  const handleChatSelect = async (chat: Chat) => {
    console.log('🔵 [AdminChatList] Chat selected:', {
      chatId: chat.id,
      previouslySelected: selectedChatId === chat.id
    });

    // First call onChatSelect to update UI immediately
    onChatSelect(chat);

    // Then mark as read if needed
    if (chat.unread > 0) {
      try {
        const firebaseService = FirebaseService.getInstance();
        await firebaseService.markChatAsRead(chat.id);
      } catch (error) {
        console.error('❌ [AdminChatList] Error marking chat as read:', error);
      }
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#aebac1]" />
          <Input
            placeholder="Search or start new chat"
            className="pl-10 bg-[#202c33] border-none text-[#aebac1] placeholder:text-[#aebac1]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onSaveContact={onSaveContact}
          showAbout={showAbout}
        />
      </ScrollArea>
    </>
  );
}