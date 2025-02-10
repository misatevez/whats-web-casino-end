"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, X } from "lucide-react"
import { UserProfileDialog } from "../chat/user-profile-dialog"
import { ProfileDialog } from "./ProfileDialog"
import { StatusDialog } from "./StatusDialog"
import type { Message } from "@/types/types"

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7"

export interface ChatHeaderProps {
  name: string
  avatar?: string
  online?: boolean
  userProfile?: any
  isAdmin?: boolean
  isUserChat?: boolean
  onOpenProfile?: () => void
  onOpenStatusPreview?: () => void
  adminProfile?: any
  statuses?: any[]
  messages: Message[]
  onSearch: (query: string) => void
  searchQuery: string
  handleSendMessage: (content: string) => Promise<void>
}

export function ChatHeader({
  name,
  avatar,
  online,
  userProfile,
  isAdmin = false,
  isUserChat = false,
  onOpenProfile,
  onOpenStatusPreview,
  adminProfile,
  statuses,
  messages = [],
  onSearch = () => {},
  searchQuery = "",
  handleSendMessage,
}: ChatHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isStatusPreviewOpen, setIsStatusPreviewOpen] = useState(false)

  const handleSearch = (query: string) => {
    if (typeof onSearch === "function") {
      onSearch(query)
    }
  }

  const handleOpenProfile = () => {
    if (onOpenProfile) {
      onOpenProfile()
    } else {
      setIsProfileOpen(true)
    }
  }

  const handleOpenStatusPreview = () => {
    if (onOpenStatusPreview) {
      onOpenStatusPreview()
    } else {
      setIsStatusPreviewOpen(true)
    }
  }

  const handleStatusResponse = (response: string) => {
    console.log("Status response:", response)
    setIsStatusPreviewOpen(false)
    handleSendMessage(response) //Added this line to pass the response to handleSendMessage
  }

  return (
    <header className="h-16 bg-[#202c33] flex items-center justify-between px-4 border-b border-[rgba(134,150,160,0.15)] relative z-10">
      <div className="flex items-center">
        <Avatar
          className="h-10 w-10 cursor-pointer relative"
          onClick={isUserChat ? handleOpenStatusPreview : handleOpenProfile}
        >
          {isUserChat && <div className="absolute inset-0 rounded-full border-2 border-[#00a884]" />}
          <AvatarImage
            src={
              isAdmin
                ? adminProfile?.photoURL || adminProfile?.avatar || DEFAULT_AVATAR
                : adminProfile?.photoURL || avatar || adminProfile?.avatar || DEFAULT_AVATAR
            }
            alt={isAdmin ? adminProfile?.name : name}
          />
          <AvatarFallback>{(isAdmin ? adminProfile?.name : name).slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h2
            className="text-[#e9edef] text-base font-medium cursor-pointer hover:underline"
            onClick={handleOpenProfile}
          >
            {isAdmin ? adminProfile?.name : name}
          </h2>
          <p className="text-xs text-[#8696a0]">
            {isAdmin ? (adminProfile?.online ? "En línea" : "Desconectado") : online ? "En línea" : "Desconectado"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isSearchOpen ? (
          <div className="flex items-center bg-[#2a3942] rounded-md">
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search messages"
              className="bg-transparent border-none text-[#d1d7db] placeholder:text-[#8696a0] focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-[#aebac1]"
              onClick={() => {
                setIsSearchOpen(false)
                handleSearch("")
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <Button variant="ghost" size="icon" className="text-[#aebac1]" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <a href="https://api.whatsapp.com/send/?phone=5493584877949" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-[#aebac1]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
                </svg>
              </Button>
            </a>
          </>
        )}
        <UserProfileDialog
          profile={userProfile}
          onUpdate={(newName, newAvatar) => {
            console.log("User profile updated:", newName, newAvatar)
          }}
        >
          <Button variant="ghost" size="icon" className="text-[#aebac1]">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </UserProfileDialog>
      </div>
      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        name={isAdmin ? adminProfile?.name : name}
        avatar={isAdmin ? adminProfile?.avatar : avatar || DEFAULT_AVATAR}
        online={isAdmin ? adminProfile?.online : online || false}
        phoneNumber={userProfile?.phoneNumber || ""}
        about={userProfile?.about}
      />
      {isUserChat && (
        <StatusDialog
          isOpen={isStatusPreviewOpen}
          onClose={() => setIsStatusPreviewOpen(false)}
          statuses={statuses || []}
          onStatusResponse={handleStatusResponse}
          handleSendMessage={handleSendMessage}
        />
      )}
    </header>
  )
}

