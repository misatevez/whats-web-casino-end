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
import { MessagePreview, Chat } from "@/lib/types";
import { getStoredPhoneNumber, clearStoredData } from "@/lib/storage/local-storage";
import { CacheManager } from "@/lib/storage/cache-manager";

export default function ChatPage() {
  const router = useRouter();
  const { profile: adminProfile, isLoading: isLoadingAdmin } = useAdminProfile();
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseService, setFirebaseService] = useState<UserFirebaseService | null>(null);
  const [cacheManager, setCacheManager] = useState<CacheManager | null>(null);
  
  useEffect(() => {
    // Check if user has a phone number stored
    const phoneNumber = getStoredPhoneNumber();
    if (!phoneNumber) {
      router.push("/");
      return;
    }

    setFirebaseService(UserFirebaseService.getInstance());
    setCacheManager(CacheManager.getInstance(phoneNumber));
  }, [router]);

  useEffect(() => {
    if (!firebaseService) return;

    const phoneNumber = getStoredPhoneNumber();
    if (!phoneNumber) return;

    console.log('🔵 Iniciando suscripción del chat para usuario:', phoneNumber);
    const unsubscribe = firebaseService.subscribeToChatUpdates(phoneNumber, (updatedChat) => {
      if (!updatedChat) {
        console.log('❌ No se encontró el chat del usuario, redirigiendo al inicio');
        clearStoredData();
        router.push("/");
        return;
      }
      console.log('✅ Chat actualizado:', updatedChat.id);
      setChat(updatedChat);
      setIsLoading(false);
    });

    return () => {
      console.log('🔵 Limpiando suscripción del chat');
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
          console.error('Error actualizando estado en línea:', error);
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
     <div className="min-h-screen bg-[#111b21] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const handleSendMessage = async (content: string, preview: MessagePreview | null) => {
    if (!chat || (!content.trim() && !preview)) return;

    try {
      console.log('🔵 Enviando mensaje:', { content, preview });
      await firebaseService?.sendMessage(chat.id, content, preview);
      console.log('✅ Mensaje enviado exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      throw error;
    }
  };

  const handleStatusReply = (statusId: string, reply: string, imageUrl: string) => {
    handleSendMessage(reply, {
      type: 'image',
      name: 'Respuesta a Estado',
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