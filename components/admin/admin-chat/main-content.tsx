"use client";

import { Chat } from "@/lib/types";
import { AdminChatView } from "../admin-chat-view";

interface AdminMainContentProps {
  selectedChat: Chat | null;
  onInfoClick: () => void;
}

export function AdminMainContent({ selectedChat, onInfoClick }: AdminMainContentProps) {
  if (!selectedChat) {
    return (
      <div className="flex-1 hidden lg:flex items-center justify-center bg-[#222e35]">
        <div className="text-center">
          <h2 className="text-[#e9edef] text-3xl font-light mb-4">WhatsApp Web</h2>
          <p className="text-[#8696a0]">
            Send and receive messages without keeping your phone online.
            <br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminChatView
      chat={selectedChat}
      onInfoClick={onInfoClick}
    />
  );
}