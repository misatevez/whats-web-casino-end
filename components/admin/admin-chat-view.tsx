"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat/chat-header";
import { AdminChatMessage } from "./admin-chat-message";
import { MessageInput } from "@/components/chat/message-input";
import { ImageViewerDialog } from "@/components/chat/image-viewer-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chat, Message, MessagePreview } from "@/lib/types";
import { sendMessage } from "@/lib/data";

interface AdminChatViewProps {
  chat: Chat;
  onInfoClick: () => void;
}

export function AdminChatView({ chat, onInfoClick }: AdminChatViewProps) {
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToMessage = (index: number) => {
    const messageElements = scrollAreaRef.current?.querySelectorAll('.message-item');
    if (messageElements && messageElements[index]) {
      messageElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages.length]);

  useEffect(() => {
    if (selectedMessageIndex !== null) {
      scrollToMessage(selectedMessageIndex);
    }
  }, [selectedMessageIndex]);

  const handleSendMessage = async (content: string, preview: MessagePreview | null) => {
    if ((!content.trim() && !preview)) return;

    try {
      console.log('🔵 Admin sending message:', { content, preview });
      await sendMessage(chat.id, content, preview, true);
      console.log('✅ Message sent successfully');
      scrollToBottom();
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    console.log('🔵 Opening image viewer:', imageUrl);
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  const filteredMessages = messageSearchTerm
    ? chat.messages.filter(message =>
        message.content?.toLowerCase().includes(messageSearchTerm.toLowerCase())
      )
    : chat.messages;

  const handleSearchClose = () => {
    setShowMessageSearch(false);
    setMessageSearchTerm("");
    setSelectedMessageIndex(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      {showMessageSearch ? (
        <div className="h-16 bg-[#202c33] flex items-center px-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSearchClose}
          >
            <ArrowLeft className="h-5 w-5 text-[#aebac1]" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#aebac1]" />
            <Input
              value={messageSearchTerm}
              onChange={(e) => {
                setMessageSearchTerm(e.target.value);
                setSelectedMessageIndex(null);
              }}
              placeholder="Search messages"
              className="pl-10 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0]"
              autoFocus
            />
          </div>
          {messageSearchTerm && filteredMessages.length > 0 && (
            <div className="text-[#8696a0] text-sm">
              {selectedMessageIndex !== null ? selectedMessageIndex + 1 : 0} of {filteredMessages.length}
            </div>
          )}
          {messageSearchTerm && filteredMessages.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newIndex = selectedMessageIndex !== null
                    ? Math.max(selectedMessageIndex - 1, 0)
                    : filteredMessages.length - 1;
                  setSelectedMessageIndex(newIndex);
                }}
                disabled={selectedMessageIndex === 0}
              >
                <ArrowLeft className="h-5 w-5 text-[#aebac1]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newIndex = selectedMessageIndex !== null
                    ? Math.min(selectedMessageIndex + 1, filteredMessages.length - 1)
                    : 0;
                  setSelectedMessageIndex(newIndex);
                }}
                disabled={selectedMessageIndex === filteredMessages.length - 1}
              >
                <ArrowLeft className="h-5 w-5 text-[#aebac1] rotate-180" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ChatHeader
          avatar={chat.avatar}
          name={chat.name}
          online={chat.online}
          onInfoClick={onInfoClick}
          onSearchClick={() => setShowMessageSearch(true)}
        />
      )}

      <ScrollArea 
        className="flex-1 bg-[#0b141a] p-2 sm:p-4 relative"
        ref={scrollAreaRef}
      >
        <div className="whatsapp-chat-bg" />
        <div className="space-y-2 sm:space-y-4 max-w-3xl mx-auto relative">
          {(messageSearchTerm ? filteredMessages : chat.messages).map((message, index) => (
            <div
              key={message.id}
              className={`message-item ${
                selectedMessageIndex === index ? 'bg-[#202c33] rounded-lg' : ''
              }`}
            >
              <AdminChatMessage
                message={message}
                onImageClick={handleImageClick}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput onSendMessage={handleSendMessage} />

      <ImageViewerDialog
        open={showImageViewer}
        onOpenChange={setShowImageViewer}
        imageUrl={selectedImage}
      />
    </div>
  );
}