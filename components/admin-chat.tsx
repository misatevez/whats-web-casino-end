"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminChatList } from "@/components/admin/admin-chat-list";
import { AdminChatView } from "@/components/admin/admin-chat-view";
import { AdminProfileDialog } from "@/components/admin/admin-profile-dialog";
import { AdminContactDialog } from "@/components/admin/admin-contact-dialog";
import { getAdminProfile, subscribeToChats } from "@/lib/data";
import { Chat, UserProfile, initialAdminProfile } from "@/lib/types";

export default function AdminChat() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [adminData, setAdminData] = useState<UserProfile>(initialAdminProfile);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load admin profile
    const loadAdminProfile = async () => {
      try {
        const profile = await getAdminProfile();
        setAdminData(profile);
      } catch (error) {
        console.error('Error loading admin profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToChats((updatedChats) => {
      setChats(updatedChats);
      
      // Update selected chat if it exists
      if (selectedChat) {
        const updatedSelectedChat = updatedChats.find(chat => chat.id === selectedChat.id);
        if (updatedSelectedChat) {
          setSelectedChat(updatedSelectedChat);
        }
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChat]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111b21]">
        <p className="text-[#e9edef]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#111b21]">
      {/* Left Sidebar */}
      <div className="w-[400px] border-r border-[#202c33] flex flex-col lg:block hidden">
        <AdminHeader
          profile={adminData}
          onProfileClick={() => setShowProfileSettings(true)}
          onLogout={handleLogout}
        />

        {/* Search and Tabs */}
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
              chats={filteredChats}
              selectedChatId={selectedChat?.id}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onChatSelect={setSelectedChat}
              onSaveContact={handleSaveContact}
            />
          </TabsContent>

          <TabsContent value="contacts" className="m-0">
            <AdminChatList
              chats={filteredChats}
              selectedChatId={selectedChat?.id}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onChatSelect={setSelectedChat}
              onSaveContact={handleSaveContact}
              showAbout
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <AdminChatView
          chat={selectedChat}
          onInfoClick={() => setShowContactInfo(true)}
        />
      ) : (
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
      )}

      {/* Dialogs */}
      <AdminProfileDialog
        open={showProfileSettings}
        onOpenChange={setShowProfileSettings}
        profile={adminData}
        onProfileUpdate={setAdminData}
      />

      <AdminContactDialog
        open={showContactInfo}
        onOpenChange={setShowContactInfo}
        chat={selectedChat}
      />
    </div>
  );
}