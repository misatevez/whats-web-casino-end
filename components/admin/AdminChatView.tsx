"use client"

import { useState } from "react"
import { Search, X, UserX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditContactDialog } from "@/components/admin/edit-contact-dialog"
import { BlockUnblockDialog } from "@/components/admin/BlockUnblockDialog"
import { MessageList } from "@/components/shared/message-list"
import { MessageInput } from "@/components/shared/message-input"
import type { Chat, Message, Category } from "@/types/interfaces"
import { ChatList } from "@/components/admin/ChatList"


const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7"

interface AdminChatViewProps {
  selectedChat: Chat
  categories: Category[]
  chatMessages: Message[] // <-- Vienen ya suscritos
  onEditContact: (id: string, newName: string, newCategories: string[]) => void
  onSendMessage: (content: string) => void
  onOpenProfile: () => void
  onBlockStatusChange: (contactId: string, isBlocked: boolean) => void
}

export function AdminChatView({
  selectedChat,
  categories,
  chatMessages,
  onEditContact,
  onSendMessage,
  onOpenProfile,
  onBlockStatusChange,
}: AdminChatViewProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [chatSearchQuery, setChatSearchQuery] = useState("")
  const [isBlockUnblockDialogOpen, setIsBlockUnblockDialogOpen] = useState(false)

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 relative z-10">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 cursor-pointer" onClick={onOpenProfile}>
            <AvatarImage src={selectedChat.photoURL || selectedChat.avatar || DEFAULT_AVATAR} />
            <AvatarFallback>{selectedChat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2
              className="text-[#e9edef] text-base font-medium cursor-pointer hover:underline"
              onClick={onOpenProfile}
            >
              {selectedChat.name || selectedChat.phoneNumber}
            </h2>
            {selectedChat.online && <p className="text-xs text-[#8696a0]">online</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Logica de buscador */}
          {isSearchOpen ? (
            <div className="flex items-center bg-[#2a3942] rounded-md">
              <Input
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder="Search messages"
                className="bg-transparent border-none text-[#d1d7db] placeholder:text-[#8696a0] focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aebac1]"
                onClick={() => {
                  setIsSearchOpen(false)
                  setChatSearchQuery("")
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aebac1]"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aebac1]"
                onClick={() => setIsBlockUnblockDialogOpen(true)}
              >
                <UserX className="h-5 w-5" />
              </Button>
            </>
          )}
          <EditContactDialog contact={selectedChat} onEditContact={onEditContact} categories={categories} />
        </div>
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <div
          className="fixed inset-0 z-0 flex pointer-events-none"
          style={{
            opacity: 0.06,
          }}
        >
          <div
            className="w-1/2 bg-repeat"
            style={{
              backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png')",
              backgroundSize: "contain",
              backgroundAttachment: "fixed",
            }}
          />
          <div
            className="w-1/2 bg-repeat"
            style={{
              backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png')",
              backgroundSize: "contain",
              backgroundAttachment: "fixed",
            }}
          />
        </div>
        <div className="relative z-10">
          <MessageList
            messages={chatMessages}
            currentUserId="admin"
            chatSearchQuery={chatSearchQuery}
            chatId={selectedChat.id || ""}
            lastReadMessageId={selectedChat.lastReadMessageId}
             invertOutgoing={false} // <-- Lógica normal: isOutgoing = true => derecha, verde
          />
        </div>
      </div>
      {chatSearchQuery && (
        <div className="absolute top-[70px] right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setChatSearchQuery("")}
            className="bg-[#2a3942] text-[#d1d7db] hover:bg-[#3a4a53]"
          >
            Clear Search
          </Button>
        </div>
      )}
      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} chatId={selectedChat.id} />

      {/* Block/Unblock Dialog */}
      <BlockUnblockDialog
        isOpen={isBlockUnblockDialogOpen}
        onClose={() => setIsBlockUnblockDialogOpen(false)}
        contact={{
          id: selectedChat.id,
          name: selectedChat.name,
          isBlocked: selectedChat.isBlocked || false,
        }}
        onBlockStatusChange={onBlockStatusChange}
      />
    </div>
  )
}

