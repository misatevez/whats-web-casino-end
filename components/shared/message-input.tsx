// components/shared/message-input.tsx

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"
import { AttachmentPicker } from "./attachment-picker"
import { uploadFile } from "@/lib/firestore"

interface MessageInputProps {
  chatId: string
  onSendMessage: (content: string) => void
}

export function MessageInput({ chatId, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleSendMessage = async () => {
    if (message.trim()) {
      console.log("[MessageInput] Sending message:", message.trim())
      onSendMessage(message.trim())
      setMessage("")
    } else if (file) {
      try {
        setUploadProgress(0)
        console.log("[MessageInput] Uploading file:", file.name)
        const fileUrl = await uploadFile(file, (progress) => setUploadProgress(progress))
        console.log("[MessageInput] File uploaded, sending URL:", fileUrl)
        onSendMessage(fileUrl)
        setFile(null)
        setUploadProgress(0)
      } catch (error) {
        console.error("[MessageInput] Error uploading file:", error)
      }
    }
  }

  const onEmojiSelect = (emojiData: any) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleFileSelect = async (fileUrl: string, comment?: string) => {
    try {
      await onSendMessage(fileUrl)
      if (comment) {
        await onSendMessage(comment)
      }
    } catch (error) {
      console.error("Error in handleFileSelect:", error)
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      // Optionally, you can show an error message to the user here
    }
  }

  return (
    <div className="h-[62px] bg-[#202c33] flex items-center px-4 gap-4 relative z-10">
      <AttachmentPicker
        show={showAttachmentPicker}
        onToggle={() => setShowAttachmentPicker(!showAttachmentPicker)}
        onFileSelect={handleFileSelect}
        disabled={!showAttachmentPicker}
      />
      <EmojiPicker
        showPicker={showEmojiPicker}
        onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
        onEmojiSelect={onEmojiSelect}
      />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-[#00a884]" style={{ width: `${uploadProgress}%` }} />
      )}
      <Input
        className="flex-1 bg-[#2a3942] text-[#d1d7db] placeholder:text-[#8696a0] border-none focus-visible:ring-0"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button
        variant="ghost"
        size="icon"
        className="text-[#8696a0] hover:bg-[rgba(134,150,160,0.1)]"
        onClick={handleSendMessage}
        disabled={!message.trim() && !file}
      >
        <Send className="h-6 w-6" />
      </Button>
    </div>
  )
}

