"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/ToastContext"
import { useAppContext } from "@/contexts/AppContext"
import { AdminSidebar } from "./AdminSidebar"
import { AdminChatView } from "./AdminChatView"
import { CategoryManagementDialog } from "./category-management-dialog"
import { ContactInfoDialog } from "./contact-info-dialog"
import { updateChat, updateAdminProfile } from "@/contexts/appActions"
import { onSnapshot, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { sendMessage, markMessagesAsRead, editContact } from "@/lib/firestore"
import type { Chat, Message, Category } from "@/types/interfaces"

export function AdminDashboardContent() {
  const { addToast } = useToast()
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const { chats, adminProfile, categories, selectedChatId, unknownContacts, activeTab, selectedCategories } = state

  // Estado para mensajes del chat seleccionado
  const [chatMessages, setChatMessages] = useState<Message[]>([])

  // Estado para modales
  const [selectedContact, setSelectedContact] = useState<{
    phoneNumber: string
    name?: string
    about?: string
    online?: boolean
  } | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false)

  // Referencia a la suscripción
  const unsubscribeRef = useRef<() => void>()

  const selectedChatData = chats.find((c) => c.id === selectedChatId)

  // Suscripción en tiempo real al chat seleccionado
  useEffect(() => {
    if (!selectedChatId) {
      setChatMessages([])
      if (unsubscribeRef.current) unsubscribeRef.current()
      return
    }
    if (unsubscribeRef.current) unsubscribeRef.current()

    const messagesRef = collection(db, `chats/${selectedChatId}/messages`)
    const q = query(messagesRef, orderBy("timestamp"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
      setChatMessages(updated)
    })

    unsubscribeRef.current = unsubscribe
    return () => unsubscribe()
  }, [selectedChatId])

  const handleEditContact = async (chatId: string, newName: string, categories: string[]) => {
    try {
      await editContact(chatId, newName, categories)
      
      // Actualizar el estado local
      dispatch(
        updateChat({
          id: chatId,
          name: newName,
          categories: categories,
          isAgendado: true,
        })
      )
      
      addToast({
        title: "Success",
        description: "Contact updated successfully",
      })
    } catch (error) {
      console.error("Error updating contact:", error)
      addToast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return

    const newMessage: Omit<Message, "id"> = {
      content,
      timestamp: new Date().toISOString(),
      isOutgoing: true,
      type: "text",
      status: "sending",
    }

    try {
      const messageId = await sendMessage(selectedChatId, newMessage)
      console.log("Message sent with ID:", messageId)

      dispatch(
        updateChat({
          id: selectedChatId,
          lastMessage: content,
          timestamp: new Date().toISOString(),
        })
      )
    } catch (error) {
      console.error("Error sending message:", error)
      addToast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-[#111b21]">
      <AdminSidebar
        adminProfile={adminProfile}
        categories={categories}
        chats={chats}
        activeTab={activeTab}
        selectedCategories={selectedCategories}
        selectedChatId={selectedChatId}
        onUpdateAdminProfile={(name, avatar, about) => dispatch(updateAdminProfile({ name, avatar, about }))}
        onAddContact={() => {/* Implementar lógica de agregar contacto */}}
        onOpenCategoryManagement={() => setIsCategoryManagementOpen(true)}
      />

      {selectedChatData ? (
        <AdminChatView
          selectedChat={selectedChatData}
          categories={categories}
          chatMessages={chatMessages}
          onEditContact={handleEditContact}
          onSendMessage={handleSendMessage}
          onOpenProfile={() => setIsProfileOpen(true)}
          onBlockStatusChange={() => {/* Implementar lógica de bloqueo */}}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#222e35]">
          <h1 className="text-[#e9edef] text-3xl font-light mb-4">WhatsApp Web</h1>
          <p className="text-[#8696a0] mb-2">
            Send and receive messages without keeping your phone online.
          </p>
          <p className="text-[#8696a0]">
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      )}

      <CategoryManagementDialog
        categories={categories}
        onAddCategory={() => {/* Implementar lógica de agregar categoría */}}
        onEditCategory={() => {/* Implementar lógica de editar categoría */}}
        onDeleteCategory={() => {/* Implementar lógica de eliminar categoría */}}
        isOpen={isCategoryManagementOpen}
        onClose={() => setIsCategoryManagementOpen(false)}
      />

      {selectedContact && (
        <ContactInfoDialog
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
          onAddContact={() => {/* Implementar lógica de agregar contacto */}}
        />
      )}
    </div>
  )
}