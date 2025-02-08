"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminProfile } from "@/hooks/use-admin-profile";
import { useMessageSearch } from "@/hooks/use-message-search";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { MessageSearchHeader } from "@/components/chat/message-search-header";
import { UserSettingsDialog } from "@/components/chat/user-settings-dialog";
import { ImageViewerDialog } from "@/components/chat/image-viewer-dialog";
import { StatusViewerDialog } from "@/components/chat/status-viewer-dialog";
import { UserFirebaseService } from "@/lib/services/user-firebase-service";
import { MessagePreview } from "@/lib/types";
import { getStoredPhoneNumber, clearStoredData } from "@/lib/storage/local-storage";

export default function ChatPage() {
  const router = useRouter();
  const { profile: adminProfile, isLoading: isLoadingAdmin } = useAdminProfile();
  const [chat, setChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseService, setFirebaseService] = useState<UserFirebaseService | null>(null);
  
  useEffect(() => {
    // Check if user has a phone number stored
    const phoneNumber = getStoredPhoneNumber();
    if (!phoneNumber) {
      router.push("/");
      return;
    }

    setFirebaseService(UserFirebaseService.getInstance());
  }, [router]);

  useEffect(() => {
    if (!firebaseService) return;

    const phoneNumber = getStoredPhoneNumber();
    if (!phoneNumber) return;

    console.log('🔵 Starting chat subscription for user:', phoneNumber);
    const unsubscribe = firebaseService.subscribeToChatUpdates(phoneNumber, (updatedChat) => {
      if (!updatedChat) {
        console.log('❌ No chat found for user, redirecting to home');
        clearStoredData();
        router.push("/");
        return;
      }
      console.log('✅ Chat updated:', updatedChat.id);
      setChat(updatedChat);
      setIsLoading(false);
    });

    return () => {
      console.log('🔵 Cleaning up chat subscription');
      unsubscribe();
    };
  }, [firebaseService, router]);

  const {
    showSearch,
    messageSearchTerm,
    selectedMessageIndex,
    filteredMessages,
    setShowSearch,
    setMessageSearchTerm,
    handleSearchClose,
    handleNext,
    handlePrevious
  } = useMessageSearch(chat?.messages || []);

  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (chat && firebaseService) {
      const setOnlineStatus = async () => {
        try {
          await firebaseService.updateOnlineStatus(chat.id, true);
        } catch (error) {
          console.error('Error updating online status:', error);
        }
      };

      setOnlineStatus();
      
      const handleBeforeUnload = () => {
        firebaseService.updateOnlineStatus(chat.id, false).catch(console.error);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        firebaseService.updateOnlineStatus(chat.id, false).catch(console.error);
      };
    }
  }, [chat?.id, firebaseService]);

  // Fix for Safari viewport height
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  if (isLoading || isLoadingAdmin || !chat || !adminProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111b21]">
        <div className="text-[#e9edef]">Loading...</div>
      </div>
    );
  }

  const handleSendMessage = async (content: string, preview: MessagePreview | null) => {
    if ((!content.trim() && !preview) || !firebaseService) return;
    try {
      await firebaseService.sendMessage(chat.id, content, preview, false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStatusReply = (statusId: string, reply: string, imageUrl: string) => {
    handleSendMessage(reply, {
      type: 'image',
      name: 'Status Reply',
      url: imageUrl
    });
  };

  return (
    <div className="flex flex-col h-screen chat-container bg-[#111b21] overflow-hidden">
      {showSearch ? (
        <MessageSearchHeader
          searchTerm={messageSearchTerm}
          onSearchChange={setMessageSearchTerm}
          onClose={handleSearchClose}
          filteredMessages={filteredMessages}
          selectedIndex={selectedMessageIndex}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ) : (
        <ChatHeader
          avatar={adminProfile.image}
          name={adminProfile.name}
          online={true}
          onInfoClick={() => setShowProfileSettings(true)}
          onSearchClick={() => setShowSearch(true)}
          onAvatarClick={() => setShowStatusViewer(true)}
          statuses={adminProfile.statuses}
        />
      )}

      <MessageList
        messages={filteredMessages}
        selectedMessageIndex={selectedMessageIndex}
        onImageClick={(url) => {
          setSelectedImage(url);
          setShowImageViewer(true);
        }}
      />

      <MessageInput onSendMessage={handleSendMessage} />

      <UserSettingsDialog
        open={showProfileSettings}
        onOpenChange={setShowProfileSettings}
        phoneNumber={chat.phoneNumber}
      />

      <ImageViewerDialog
        open={showImageViewer}
        onOpenChange={setShowImageViewer}
        imageUrl={selectedImage}
      />

      <StatusViewerDialog
        open={showStatusViewer}
        onOpenChange={setShowStatusViewer}
        statuses={adminProfile.statuses || []}
        onReply={handleStatusReply}
      />
    </div>
  );
}