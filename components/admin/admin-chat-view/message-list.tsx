import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminChatMessage } from "./message";
import { Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  selectedMessageIndex: number | null;
  onImageClick: (url: string) => void;
}

export function MessageList({
  messages,
  selectedMessageIndex,
  onImageClick
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    if (selectedMessageIndex !== null) {
      const messageElements = scrollAreaRef.current?.querySelectorAll('.message-item');
      if (messageElements && messageElements[selectedMessageIndex]) {
        messageElements[selectedMessageIndex].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [selectedMessageIndex]);

  return (
    <ScrollArea 
      className="flex-1 bg-[#0b141a] p-2 sm:p-4 relative"
      ref={scrollAreaRef}
    >
      <div className="whatsapp-chat-bg" />
      <div className="space-y-2 sm:space-y-4 max-w-3xl mx-auto relative">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`message-item ${
              selectedMessageIndex === index ? 'bg-[#202c33] rounded-lg' : ''
            }`}
          >
            <AdminChatMessage
              message={message}
              onImageClick={onImageClick}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}