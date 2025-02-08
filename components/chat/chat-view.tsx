"use client";

import { Chat } from "@/lib/types";
import { MessageList } from "./message-list";
import { MessageSearchHeader } from "./message-search-header";
import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { ImageViewerDialog } from "./image-viewer-dialog";
import { useMessageSearch } from "@/hooks/use-message-search";
import { useUserChatView } from "@/hooks/use-chat-view";

interface ChatViewProps {
  chat: Chat;
  onInfoClick: () => void;
}

export function ChatView({ chat, onInfoClick }: ChatViewProps) {
  console.log('🔵 [ChatView] Rendering for chat:', {
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
  } = useUserChatView(chat);

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