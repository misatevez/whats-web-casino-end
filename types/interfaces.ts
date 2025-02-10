import type { User } from "firebase/auth"
import type React from "react"

export interface Message {
  id: string
  content: string
  timestamp: string
  isOutgoing: boolean
  type: "text" | "image" | "document"
  filename?: string
  status: "sent" | "delivered" | "read"
  receipts: {
    sent: string
    delivered?: string
    read?: string
  }
}

export interface Chat {
  id: string
  name: string
  phoneNumber: string
  lastMessage: string
  timestamp: string
  online?: boolean
  avatar?: string
  photoURL?: string
  messages?: Message[]
  categories?: string[]
  about?: string
  unreadCount: number
  isAgendado: boolean
  lastReadMessageId?: string
}

export interface UnknownContact {
  phoneNumber: string
  lastMessage: string
  timestamp: string
}

export interface AdminProfile {
  name: string
  avatar: string
  about: string
  categories: Category[]
  online: boolean
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface UserProfile {
  name: string
  avatar: string
  phoneNumber: string
}

export interface EmojiPickerProps {
  showPicker: boolean
  onToggle: () => void
  onEmojiSelect: (emojiData: any) => void
  disabled?: boolean
}

export interface AttachmentPickerProps {
  show: boolean
  onToggle: (show: boolean) => void
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void
}

export interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export interface ChatHeaderProps {
  name: string
  avatar: string
  online: boolean
  userProfile: UserProfile
  isUserChat: boolean
  adminProfile: AdminProfile
  statuses: any[]
}

export interface ThumbnailPreviewProps {
  content: string
  type: "text" | "image" | "document"
  filename?: string
}

export interface UserProfileDialogProps {
  profile: UserProfile
  onUpdate: (name: string, avatar: string) => void
  children: React.ReactNode
}

export interface ChatListProps {
  onSelectChat: (chatId: string) => void
}

export interface ChatViewProps {
  chatId: string
}

export interface StatusUpdateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export interface ContactInfoDialogProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    phoneNumber: string
    name?: string
    about?: string
    online?: boolean
  }
  onAddContact: (phoneNumber: string, name: string) => void
}

export interface ProfilePictureDialogProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  name: string
}

export interface EditContactDialogProps {
  contact: Chat
  onEditContact: (id: string, newName: string, categories: string[]) => void
  categories?: Category[]
}

export interface AddContactDialogProps {
  onAddContact: (phoneNumber: string, name: string) => void
  unknownContacts: UnknownContact[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export interface AdminProfileDialogProps {
  profile: AdminProfile
  onUpdate: (name: string, avatar: string, about: string) => void
  children: React.ReactNode
}

export interface CategoryManagerProps {
  categories: Category[]
  onAddCategory: (category: Category) => void
  onDeleteCategory: (categoryId: string) => void
}

export interface CategoryManagementDialogProps {
  categories: Category[]
  onAddCategory: (category: Category) => void
  onEditCategory: (category: Category) => void
  onDeleteCategory: (categoryId: string) => void
  isOpen: boolean
  onClose: () => void
}

export interface AuthContextType {
  user: User | null
  loading: boolean
}

export interface UseMessagesMessage {
  id: string
  text: string
  userId: string
  timestamp: number
}

export interface AdminStatus {
  id: string
  imageUrl: string
  caption: string
}

