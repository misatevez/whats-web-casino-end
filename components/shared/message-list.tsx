// components/shared/message-list.tsx

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Check, CheckCheck } from "lucide-react"
import { ThumbnailPreview } from "./thumbnail-preview"
import { formatTimestamp } from "@/lib/utils"
import type { Timestamp } from "firebase/firestore"

// Definición del tipo de mensaje
type ChatMessage = {
  id: string
  content: string
  timestamp?:
    | Timestamp
    | Date
    | string
    | number
    | { seconds: number; nanoseconds: number }
    | null
  isOutgoing: boolean
  type: "text" | "image" | "document"
  status: string
  filename?: string
}

// Props del componente MessageList
type MessageListProps = {
  messages: ChatMessage[]
  currentUserId: string
  chatSearchQuery?: string
  chatId: string
  lastReadMessageId?: string
  /**
   * Si se quiere “invertir” la lógica de isOutgoing. 
   * true => si el mensaje tiene isOutgoing = false, lo dibuja a la derecha (verde), y viceversa.
   * false => lógica tradicional: isOutgoing = true => derecha, isOutgoing = false => izquierda.
   */
  invertOutgoing?: boolean
}

export const MessageList: React.FC<MessageListProps> = React.memo(({
  messages,
  currentUserId,
  chatSearchQuery,
  chatId,
  lastReadMessageId,
  invertOutgoing = false, // por defecto, no invertimos
}) => {
  console.log("[MessageList] Rendering with messages:", messages.length)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<{ content: string; filename: string } | null>(null)

  // Autoscroll al final cuando llegan mensajes nuevos
  useEffect(() => {
    console.log("[MessageList] Messages updated:", messages)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handlers para preview de imagen/documento
  const handleImageClick = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl)
  }, [])
  const handleDocumentClick = useCallback((content: string, filename: string) => {
    setPreviewDocument({ content, filename })
  }, [])

  // Filtro de mensajes según el query de búsqueda
  const filteredMessages = chatSearchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(chatSearchQuery.toLowerCase())
      )
    : messages

  // Renderizado del ícono de estado (checks)
  const renderMessageStatus = useCallback((status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-4 w-4 text-[#8696a0]" />
      case "delivered":
        return <CheckCheck className="h-4 w-4 text-[#8696a0]" />
      case "read":
        return <CheckCheck className="h-4 w-4 text-[#53bdeb]" />
      default:
        return null
    }
  }, [])

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((message) => {
          // 1) Decidir si la burbuja va a la derecha (verde) o izquierda (gris)
          //    según invertOutgoing y message.isOutgoing.
          const isRightSide = invertOutgoing
            ? !message.isOutgoing
            : message.isOutgoing

          // 2) Clases de alineación y color de burbuja
          const alignmentClass = isRightSide ? "justify-end" : "justify-start"
          // Verde WhatsApp para la derecha, gris para la izquierda
          const bubbleColorClass = isRightSide ? "bg-[#005c4b]" : "bg-[#202c33]"

          return (
            <div key={message.id} className={`flex ${alignmentClass} mb-4`}>
              <div
                className={`max-w-[65%] rounded-lg px-3 py-2 ${bubbleColorClass} ${
                  chatSearchQuery ? "bg-[#0b3d36]" : ""
                }`}
              >
                {message.type === "text" ? (
                  <p className="text-sm text-primary">{message.content}</p>
                ) : (
                  <ThumbnailPreview
                    content={message.content}
                    type={message.type}
                    filename={message.filename}
                    onImageClick={handleImageClick}
                    onDocumentClick={handleDocumentClick}
                  />
                )}

                <div className="flex items-center justify-end mt-1 space-x-1">
                  {/* Hora */}
                  <span className="text-[#8696a0] text-xs">
                    {message.timestamp
                      ? formatTimestamp(message.timestamp)
                      : "Sin hora"}
                  </span>

                  {/* Solo mostramos checks si es nuestra burbuja “local” */}
                  {isRightSide && renderMessageStatus(message.status)}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Dialog para preview de imagen */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-3xl p-0">
          <DialogHeader className="bg-[#202c33] px-4 py-3 flex-row items-center justify-between">
            <DialogTitle>Image Preview</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewImage(null)}
              className="text-[#aebac1] hover:text-[#e9edef]"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="p-4">
            <img src={previewImage || ""} alt="Preview" className="w-full h-auto" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para preview de documento */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-2xl p-0">
          <DialogHeader className="bg-[#202c33] px-4 py-3 flex-row items-center justify-between">
            <DialogTitle>{previewDocument?.filename}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewDocument(null)}
              className="text-[#aebac1] hover:text-[#e9edef]"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="p-4">
            <pre className="whitespace-pre-wrap bg-[#2a3942] p-4 rounded-lg">
              {previewDocument?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
})

MessageList.displayName = "MessageList"

