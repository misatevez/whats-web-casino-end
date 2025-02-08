"use client";

import { AdminSidebar } from "./sidebar";
import { AdminMainContent } from "./main-content";
import { AdminDialogs } from "./dialogs";
import { AdminChatLoader } from "./loader";
import { useAdminChat } from "@/hooks/use-admin-chat";

export default function AdminChat() {
  const {
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
  } = useAdminChat();

  if (isLoading || !adminData) {
    return <AdminChatLoader />;
  }

  return (
    <div className="flex h-screen bg-[#111b21]">
      <AdminSidebar
        profile={adminData}
        chats={filteredChats}
        selectedChatId={selectedChat?.id}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onChatSelect={setSelectedChat}
        onSaveContact={handleSaveContact}
        onProfileClick={() => setShowProfileSettings(true)}
        onLogout={handleLogout}
      />

      <AdminMainContent
        selectedChat={selectedChat}
        onInfoClick={() => setShowContactInfo(true)}
      />

      <AdminDialogs
        showProfileSettings={showProfileSettings}
        setShowProfileSettings={setShowProfileSettings}
        showContactInfo={showContactInfo}
        setShowContactInfo={setShowContactInfo}
        adminData={adminData}
        setAdminData={setAdminData}
        selectedChat={selectedChat}
      />
    </div>
  );
}