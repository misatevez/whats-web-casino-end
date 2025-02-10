"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/contexts/ToastContext"
import { blockContact, unblockContact } from "@/lib/firestore"

interface BlockUnblockDialogProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    id: string
    name: string
    isBlocked: boolean
  }
  onBlockStatusChange: (contactId: string, isBlocked: boolean) => void
}

export function BlockUnblockDialog({ isOpen, onClose, contact, onBlockStatusChange }: BlockUnblockDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const handleBlockUnblock = async () => {
    setIsLoading(true)
    try {
      if (contact.isBlocked) {
        await unblockContact(contact.id)
        addToast({
          title: "Contact Unblocked",
          description: `${contact.name} has been unblocked successfully.`,
        })
      } else {
        await blockContact(contact.id)
        addToast({
          title: "Contact Blocked",
          description: `${contact.name} has been blocked successfully.`,
        })
      }
      onBlockStatusChange(contact.id, !contact.isBlocked)
      onClose()
    } catch (error) {
      console.error("Error blocking/unblocking contact:", error)
      addToast({
        title: "Error",
        description: "An error occurred while blocking/unblocking the contact.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-md p-0">
        <DialogHeader className="bg-[#202c33] px-4 py-3">
          <DialogTitle>{contact.isBlocked ? "Unblock Contact" : "Block Contact"}</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <p>
            {contact.isBlocked
              ? `Are you sure you want to unblock ${contact.name}?`
              : `Are you sure you want to block ${contact.name}?`}
          </p>
          <p className="text-sm text-[#8696a0]">
            {contact.isBlocked
              ? "They will be able to send you messages again."
              : "They will no longer be able to send you messages."}
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleBlockUnblock} disabled={isLoading}>
              {contact.isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

