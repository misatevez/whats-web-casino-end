"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users } from "lucide-react";
import { AdminHeader } from "./admin-header";
import { AdminChatList } from "./admin-chat-list";
import { Chat, UserProfile } from "@/lib/types";

interface AdminSidebarProps {
  profile: UserProfile;
  chats: Chat[];
  selectedChatId?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onChatSelect: (chat: Chat) => void;
  onSaveContact: (chat: Chat) => void;
  onProfileClick: () => void;
  onStatusClick: () => void;
  onViewStatus: () => void;
  onAddNumberClick: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  profile,
  chats,
  selectedChatId,
  searchTerm,
  onSearchChange,
  onChatSelect,
  onSaveContact,
  onProfileClick,
  onStatusClick,
  onViewStatus,
  onAddNumberClick,
  onLogout
}: AdminSidebarProps) {
  return (
    <div className="w-[400px] border-r border-[#202c33] flex flex-col lg:block hidden">
      <AdminHeader
        profile={profile}
        onProfileClick={onProfileClick}
        onStatusClick={onStatusClick}
        onViewStatus={onViewStatus}
        onAddNumberClick={onAddNumberClick}
        onLogout={onLogout}
      />

      <Tabs defaultValue="chats" className="w-full">
        <TabsList className="w-full bg-[#202c33] rounded-none">
          <TabsTrigger 
            value="chats" 
            className="flex-1 text-[#aebac1] data-[state=active]:text-[#00a884] data-[state=active]:bg-[#2a3942]"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chats
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="flex-1 text-[#aebac1] data-[state=active]:text-[#00a884] data-[state=active]:bg-[#2a3942]"
          >
            <Users className="h-5 w-5 mr-2" />
            Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="m-0">
          <AdminChatList
            chats={chats}
            selectedChatId={selectedChatId}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onChatSelect={onChatSelect}
            onSaveContact={onSaveContact}
          />
        </TabsContent>

        <TabsContent value="contacts" className="m-0">
          <AdminChatList
            chats={chats}
            selectedChatId={selectedChatId}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onChatSelect={onChatSelect}
            onSaveContact={onSaveContact}
            showAbout
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}