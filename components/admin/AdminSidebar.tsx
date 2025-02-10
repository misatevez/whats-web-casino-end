import { useState } from "react"
import { MessageSquare, Users, LogOut, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddContactDialog } from "@/components/admin/add-contact-dialog"
import { StatusUpdateDialog } from "@/components/admin/status-update-dialog"
import { AdminProfileDialog } from "@/components/admin/admin-profile-dialog"
import { useRouter } from "next/navigation"
import type { Chat, Category, AdminProfile } from "@/types/interfaces"
import { useAppContext } from "@/contexts/AppContext"
import { setActiveTab, setSelectedCategories } from "@/contexts/appActions"
import { SearchBar } from "./SearchBar"
import { CategoryFilters } from "./CategoryFilters"
import { ChatList } from "./ChatList"

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7"

interface AdminSidebarProps {
  adminProfile: AdminProfile
  categories: Category[]
  chats: Chat[]
  activeTab: string
  selectedCategories: string[]
  selectedChatId: string | null
  onUpdateAdminProfile: (name: string, avatar: string, about: string) => void
  onAddContact: (phoneNumber: string, name: string) => void
  onOpenCategoryManagement: () => void
}

export function AdminSidebar({
  adminProfile,
  categories,
  chats,
  activeTab,
  selectedCategories,
  selectedChatId,
  onUpdateAdminProfile,
  onAddContact,
  onOpenCategoryManagement
}: AdminSidebarProps) {
  const router = useRouter()
  const { dispatch } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false)

  // Mejorada la lógica de filtrado
  const filteredChats = chats.filter((chat) => {
    // 1. Filtro por búsqueda
    const matchesSearch = searchQuery ? (
      (chat.name && chat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.phoneNumber && chat.phoneNumber.includes(searchQuery)) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : true

    // 2. Filtro por pestaña (contactos/chats)
    const matchesTab = activeTab === "contacts" ? Boolean(chat.isAgendado) : true

    // 3. Filtro por categorías seleccionadas
    const matchesCategories = selectedCategories.length === 0 || (
      chat.categories && 
      chat.categories.some(catId => selectedCategories.includes(catId))
    )

    return matchesSearch && matchesTab && matchesCategories
  })

  // Ordenar chats: primero los no leídos, luego por timestamp
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.unreadCount !== b.unreadCount) {
      return b.unreadCount - a.unreadCount
    }
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return timeB - timeA
  })

  return (
    <div className="w-[400px] flex flex-col border-r border-[#202c33]">
      {/* Header */}
      <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 relative z-10">
        <AdminProfileDialog
          profile={adminProfile || { name: "", avatar: DEFAULT_AVATAR, about: "" }}
          onUpdate={onUpdateAdminProfile}
        >
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={adminProfile?.avatar || DEFAULT_AVATAR} />
            <AvatarFallback>{adminProfile?.name ? adminProfile.name.slice(0, 2).toUpperCase() : "AD"}</AvatarFallback>
          </Avatar>
        </AdminProfileDialog>
        <div className="flex items-center gap-3">
          <StatusUpdateDialog />
          <AddContactDialog
            onAddContact={onAddContact}
            chats={chats}
            isOpen={isAddContactDialogOpen}
            setIsOpen={setIsAddContactDialogOpen}
          />
          <Button variant="ghost" size="icon" className="text-[#aebac1]" onClick={onOpenCategoryManagement}>
            <MessageSquare className="h-5 w-5 mx-auto" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#aebac1]"
            onClick={() => router.push("/login")}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#202c33] relative z-10 bg-[#111b21]">
        <button
          className={cn(
            "flex-1 py-4 text-sm font-medium relative",
            activeTab === "chats" ? "text-[#00a884]" : "text-[#8696a0]",
          )}
          onClick={() => dispatch(setActiveTab("chats"))}
        >
          <MessageSquare className="h-5 w-5 mx-auto" />
          <span className="mt-1 block">Chats</span>
          {activeTab === "chats" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a884]" />}
        </button>
        <button
          className={cn(
            "flex-1 py-4 text-sm font-medium relative",
            activeTab === "contacts" ? "text-[#00a884]" : "text-[#8696a0]",
          )}
          onClick={() => dispatch(setActiveTab("contacts"))}
        >
          <Users className="h-5 w-5 mx-auto" />
          <span className="mt-1 block">Contacts</span>
          {activeTab === "contacts" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a884]" />}
        </button>
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryFilters 
        categories={categories} 
        selectedCategories={selectedCategories} 
        onCategoryClick={(categoryId) => {
          if (selectedCategories.includes(categoryId)) {
            dispatch(setSelectedCategories(selectedCategories.filter(id => id !== categoryId)))
          } else {
            dispatch(setSelectedCategories([...selectedCategories, categoryId]))
          }
        }}
      />
      <ChatList chats={sortedChats} selectedChatId={selectedChatId} />
    </div>
  )
}