"use client";

import { Chat } from "@/lib/types";
import { MessageList } from "../admin-chat-view/message-list";
import { MessageSearch } from "../admin-chat-view/message-search";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageInput } from "@/components/chat/message-input";
import { ImageViewerDialog } from "@/components/chat/image-viewer-dialog";
import { useMessageSearch } from "@/hooks/use-message-search";
import { useChatView } from "@/hooks/use-chat-view";

interface AdminChatViewProps {
  chat: Chat;
  onInfoClick: () => void;
}

export function AdminChatView({ chat, onInfoClick }: AdminChatViewProps) {
  console.log('🔵 [AdminChatView] Rendering for chat:', {
    chatId: chat.id,
    name: chat.name,
    messageCount: chat.messages.length
  });

  const {
    showImageViewer,
    setShowImageViewer,
    selectedImage,
    setSelectedImage,
    handleSendMessage,
    handleImageClick
  } = useChatView(chat);

  const {
    showSearch,
    setShowSearch,
    messageSearchTerm,
    setMessageSearchTerm,
    selectedMessageIndex,
    filteredMessages,
    handleSearchClose,
    handleNext,
    handlePrevious
  } = useMessageSearch(chat.messages);

  return (
    <div className="flex-1 flex flex-col">
      {showSearch ? (
        <MessageSearch
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
          avatar={chat.avatar}
          name={chat.name}
          online={chat.online}
          onInfoClick={onInfoClick}
          onSearchClick={() => setShowSearch(true)}
        />
      )}

      <MessageList
        messages={filteredMessages}
        selectedMessageIndex={selectedMessageIndex}
        onImageClick={handleImageClick}
      />

      <MessageInput onSendMessage={handleSendMessage} />

      <ImageViewerDialog
        open={showImageViewer}
        onOpenChange={setShowImageViewer}
        imageUrl={selectedImage}
      />
    </div>
  );
}