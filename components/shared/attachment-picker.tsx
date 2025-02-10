"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Paperclip, ImageIcon, Camera, File, Send } from "lucide-react"
import Image from "next/image"
import type { AttachmentPickerProps } from "@/types/interfaces"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export function AttachmentPicker({ show, onToggle, onFileSelect, disabled }: AttachmentPickerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => setPreviewUrl(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
      setShowPreview(true)
    }
  }

  const handleSend = async () => {
    if (selectedFile) {
      setIsLoading(true)
      try {
        const storageRef = ref(storage, `attachments/${Date.now()}_${selectedFile.name}`)
        await uploadBytes(storageRef, selectedFile)
        const downloadURL = await getDownloadURL(storageRef)
        onFileSelect(downloadURL, comment)
        setSelectedFile(null)
        setPreviewUrl(null)
        setShowPreview(false)
        setComment("")
      } catch (error) {
        console.error("Error uploading file:", error)
        // Log more details about the error
        if (error instanceof Error) {
          console.error("Error message:", error.message)
          console.error("Error stack:", error.stack)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <Popover open={show} onOpenChange={onToggle}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="icon" disabled={disabled}>
            <Paperclip className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-[#233138] border border-[#233138] p-1" align="start" sideOffset={5}>
          <div className="flex flex-col">
            <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
              <ImageIcon className="h-5 w-5 text-[#8696a0]" />
              <span className="text-[#d1d7db] text-sm">Photos & Videos</span>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            </label>
            <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
              <Camera className="h-5 w-5 text-[#8696a0]" />
              <span className="text-[#d1d7db] text-sm">Camera</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
              <File className="h-5 w-5 text-[#8696a0]" />
              <span className="text-[#d1d7db] text-sm">Document</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-md p-0">
          <DialogHeader className="bg-[#202c33] px-4 py-3">
            <DialogTitle>File Preview</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            {previewUrl ? (
              <div className="relative aspect-square w-full">
                <Image src={previewUrl || "/placeholder.svg"} alt="Preview" layout="fill" objectFit="contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-[#202c33] p-4 rounded-lg">
                <File className="h-12 w-12 text-[#8696a0] mb-2" />
                <span className="text-[#d1d7db] text-sm">No preview available</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                className="flex-grow bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0]"
              />
              <Button onClick={handleSend} className="bg-[#00a884] hover:bg-[#02906f]" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

