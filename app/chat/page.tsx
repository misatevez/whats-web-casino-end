"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { onSnapshot, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

import { ChatHeader } from "@/components/shared/chat-header"
import { MessageList } from "@/components/shared/message-list"
import { MessageInput } from "@/components/shared/message-input"
import { useAppContext } from "@/contexts/AppContext"
import { updateChat } from "@/contexts/appActions"
import { fetchChat, fetchAdminProfile, fetchAdminStatuses, addMessageToChat, sendInitialMessage } from "@/lib/firestore"
import type { Chat, UnknownContact, Message, UserProfile, AdminProfile, AdminStatus } from "@/types/interfaces"

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cargatusfichas2.firebasestorage.app/o/admin%2Favatar.png?..."

/**
 * Ejemplo de un "ChatContent" principal en /chat/page
 */
function ChatContent() {
  const searchParams = useSearchParams()
  const phoneNumber = searchParams.get("phone") || "" // <-- Tu número de teléfono
  const { state, dispatch } = useAppContext()

  const [chat, setChat] = useState<Chat | UnknownContact | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [statuses, setStatuses] = useState<AdminStatus[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Usuario",
    avatar: DEFAULT_AVATAR,
    phoneNumber: phoneNumber,
  })
  // 1) Cargar chat + suscripción real-time
  const loadChatData = useCallback(async () => {
    if (!phoneNumber) return

    let chatData = await fetchChat(phoneNumber)
    if (!chatData) {
      // Creamos un nuevo chat si no existe
      chatData = {
        id: phoneNumber,
        name: phoneNumber,
        phoneNumber,
        lastMessage: "",
        timestamp: new Date().toLocaleTimeString(),
        messages: [],
        unreadCount: 0,
        isAgendado: false,
      }
      dispatch(updateChat(chatData))
    }
    setChat(chatData)

    // Suscripción a los mensajes
    const messagesRef = collection(db, `chats/${phoneNumber}/messages`)
    const q = query(messagesRef, orderBy("timestamp"))
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
      if (updatedMessages.length === 0) {
        console.log("[ChatContent] No messages found, sending initial message")
        await sendInitialMessage(chatData!.id, dispatch)
        return
      }
      setChat((prev) => {
        if (!prev) return null
        return {
          ...prev,
          messages: updatedMessages,
          lastMessage: updatedMessages[updatedMessages.length - 1].content,
          timestamp: new Date(updatedMessages[updatedMessages.length - 1].timestamp).toLocaleTimeString(),
        }
      })
    })

    return unsubscribe
  }, [phoneNumber, dispatch])

  // 2) Carga adminProfile
  const loadAdminData = useCallback(async () => {
    const adminProfileData = await fetchAdminProfile()
    if (adminProfileData) setAdminProfile(adminProfileData)

    const adminStatusesData = await fetchAdminStatuses()
    setStatuses(adminStatusesData)
  }, [])

  // useEffect principal
  useEffect(() => {
    let unsubscribe: undefined | (() => void)
    loadChatData().then((unsub) => {
      if (typeof unsub === "function") unsubscribe = unsub
    })
    loadAdminData()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [loadChatData, loadAdminData])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!chat) {
        console.error("[handleSendMessage] Chat is null or undefined")
        return
      }

      console.log("[handleSendMessage] Starting to send message:", content)

      const isImage = content.startsWith("http") || content.startsWith("data:image")

      const newMessage: Omit<Message, "id"> = {
        content,
        timestamp: new Date().toISOString(),
        isOutgoing: false,
        type: isImage ? "image" : "text",
        status: "sending",
      }

      try {
        console.log("[handleSendMessage] Attempting to add message to chat:", chat.id)
        const messageId = await addMessageToChat(chat.id, newMessage)
        console.log("[handleSendMessage] Firestore doc created, ID:", messageId)

        console.log("[handleSendMessage] Updating chat document")
         const chatDocRef = doc(db, "chats", chat.id);
  await updateDoc(chatDocRef, {
    lastMessageUser: isImage ? "Image" : content,
    lastMessageUserTimestamp:  new Date().toISOString(),
  });
        console.log("[handleSendMessage] Chat document updated successfully")
      } catch (error: any) {
        console.error("Error sending message:", error)
        console.error("Error message:", error?.message)
        console.error("Error stack:", error?.stack)
        console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
        throw error // Re-throw the error so it can be caught in StatusDialog
      }
    },
    [chat],
  )

  if (!chat) {
    return (
      <div className="min-h-screen bg-[#111b21] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // 4) Render final
  return (
    <div className="flex flex-col h-screen bg-[#111b21]">
      <ChatHeader
        name={adminProfile?.name || "Admin"}
        avatar={adminProfile?.avatar || DEFAULT_AVATAR}
        online="En linea"
        userProfile={userProfile}
        isUserChat
        adminProfile={adminProfile || { name: "Admin", avatar: DEFAULT_AVATAR, online: true }}
        statuses={statuses}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        messages={chat.messages || []}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <MessageList
          messages={chat.messages || []}
          currentUserId="user"
          chatId={chat.id}
          invertOutgoing={true}
          chatSearchQuery={searchQuery}
        />
      </div>

      <MessageInput onSendMessage={handleSendMessage} chatId={chat.id} />
    </div>
  )
}

/**
 * Export default page
 */
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111b21] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}

