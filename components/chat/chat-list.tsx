"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import { Chat } from "@/lib/types";

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chat: Chat) => void;
  onSaveContact: (chat: Chat) => void;
  showAbout?: boolean;
}

export function ChatList({ 
  chats, 
  selectedChatId, 
  onChatSelect,
  onSaveContact,
  showAbout 
}: ChatListProps) {
  console.log('🔵 [ChatList] Rendering with:', {
    totalChats: chats.length,
    selectedChatId
  });

  const handleChatClick = (chat: Chat) => {
    console.log('🔵 [ChatList] Chat clicked:', {
      chatId: chat.id,
      wasSelected: selectedChatId === chat.id
    });
    onChatSelect(chat);
  };

  return (
    <div className="space-y-1">
      {chats.map((chat) => {
        const isSelected = selectedChatId === chat.id;
        console.log('🔵 [ChatList] Rendering chat item:', {
          chatId: chat.id,
          isSelected,
          name: chat.name
        });

        return (
          <div
            key={chat.id}
            className={`flex items-center gap-3 p-3 hover:bg-[#202c33] cursor-pointer ${
              isSelected ? "bg-[#2a3942]" : ""
            }`}
            onClick={() => handleChatClick(chat)}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                  onLoad={() => console.log('✅ [ChatList] Avatar loaded:', chat.id)}
                  onError={() => console.error('❌ [ChatList] Avatar load error:', chat.id)}
                />
              </Avatar>
              {chat.online && (
                <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-[#00a884] rounded-full border-2 border-[#111b21]" />
              )}
              {chat.statuses && chat.statuses.length > 0 && (
                <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full border-2 border-[#111b21] bg-[#00a884] flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-[#00a884]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[#e9edef] font-medium truncate">
                    {chat.name}
                  </span>
                  {chat.online && (
                    <span className="text-[#00a884] text-xs">online</span>
                  )}
                </div>
                <span className="text-xs text-[#8696a0]">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#8696a0] truncate">
                  {showAbout ? (chat.about || "Hey there! I am using WhatsApp") : chat.lastMessage}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}