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

    // Status management
    showStatusUpload,
    setShowStatusUpload,
    showStatusViewer,
    setShowStatusViewer,
    handleStatusUpload,
    handleStatusDelete,

    // Contact management
    showContactInfo,
    setShowContactInfo,
    showAddNumber,
    setShowAddNumber,
    newPhoneNumber,
    setNewPhoneNumber,
    handleAddNewNumber,
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
        onStatusClick={() => setShowStatusUpload(true)}
        onViewStatus={() => setShowStatusViewer(true)}
        onAddNumberClick={() => setShowAddNumber(true)}
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
        showStatusUpload={showStatusUpload}
        setShowStatusUpload={setShowStatusUpload}
        showStatusViewer={showStatusViewer}
        setShowStatusViewer={setShowStatusViewer}
        showAddNumber={showAddNumber}
        setShowAddNumber={setShowAddNumber}
        adminData={adminData}
        setAdminData={setAdminData}
        selectedChat={selectedChat}
        newPhoneNumber={newPhoneNumber}
        setNewPhoneNumber={setNewPhoneNumber}
        handleAddNumber={handleAddNewNumber}
        handleStatusUpload={handleStatusUpload}
        handleStatusDelete={handleStatusDelete}
      />
    </div>
  );
}