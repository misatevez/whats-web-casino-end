"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface StatusDialogProps {
  isOpen: boolean
  onClose: () => void
  statuses: Array<{ imageUrl: string; caption: string }>
  onStatusResponse: (response: string, imageUrl: string) => void
  handleSendMessage: (content: string) => Promise<void>
}

export function StatusDialog({ isOpen, onClose, statuses, onStatusResponse, handleSendMessage }: StatusDialogProps) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)
  const [statusResponse, setStatusResponse] = useState("")

  const handleNextStatus = () => {
    setCurrentStatusIndex((prevIndex) => (prevIndex + 1) % statuses.length)
  }

  const handlePreviousStatus = () => {
    setCurrentStatusIndex((prevIndex) => (prevIndex - 1 + statuses.length) % statuses.length)
  }

  const handleStatusResponse = async () => {
    if (statusResponse.trim()) {
      try {
        if (typeof handleSendMessage !== "function") {
          throw new Error("handleSendMessage is not a function")
        }
        // Send the text response
        await handleSendMessage(statusResponse)
        // Send the image
        await handleSendMessage(statuses[currentStatusIndex].imageUrl)
        // Call the original onStatusResponse (if needed for other UI updates)
        onStatusResponse(statusResponse, statuses[currentStatusIndex].imageUrl)
        // Reset the input and close the dialog
        setStatusResponse("")
        onClose()
      } catch (error) {
        console.error("Error sending status response:", error)
        if (error instanceof Error) {
          console.error("Error message:", error.message)
          console.error("Error stack:", error.stack)
        } else {
          console.error("Unknown error:", error)
        }
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-md p-0">
        <DialogHeader className="bg-[#202c33] px-4 py-3">
          <DialogTitle>Status</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="relative aspect-square w-full mb-4">
            <Image
              src={statuses[currentStatusIndex]?.imageUrl || "/placeholder.svg"}
              alt={statuses[currentStatusIndex]?.caption}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p className="text-center">{statuses[currentStatusIndex]?.caption}</p>
        </div>
        <DialogFooter className="bg-[#202c33] px-4 py-3">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" onClick={handlePreviousStatus} disabled={currentStatusIndex === 0}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Input
              value={statusResponse}
              onChange={(e) => setStatusResponse(e.target.value)}
              placeholder="Reply to status..."
              className="flex-1 mx-2 bg-[#2a3942] text-[#d1d7db] placeholder:text-[#8696a0] border-none focus-visible:ring-0"
            />
            <Button variant="ghost" onClick={handleNextStatus} disabled={currentStatusIndex === statuses.length - 1}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full bg-[#00a884] text-white"
            onClick={handleStatusResponse}
            disabled={!statusResponse.trim()}
          >
            Send Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

