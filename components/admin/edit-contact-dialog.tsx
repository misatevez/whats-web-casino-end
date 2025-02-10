"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreVertical, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { editContact } from "@/lib/firestore"
import { useToast } from "@/contexts/ToastContext"

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7"

interface Chat {
  id: string
  name: string
  phoneNumber: string
  photoURL?: string
  avatar?: string
  categories?: string[]
}

interface Category {
  id: string
  name: string
  color: string
}

export interface EditContactDialogProps {
  contact: Chat
  onEditContact: (id: string, newName: string, categories: string[]) => void
  categories?: Category[]
  onClose?: () => void
}

export function EditContactDialog({ contact, onEditContact, categories = [], onClose }: EditContactDialogProps) {
  const [newName, setNewName] = useState(contact.name)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(contact.categories || [])
  const [open, setOpen] = useState(false)
  const { addToast } = useToast()

  console.log("EditContactDialog rendered with props:", { contact, categories, selectedCategories })

  const handleEdit = async () => {
    if (!newName.trim()) {
      addToast({
        title: "Error",
        description: "Contact name cannot be empty",
        variant: "destructive",
      })
      return
    }

    console.log("handleEdit called with:", { chatId: contact.id, newName, selectedCategories })
    try {
      // Llamar a editContact con las categorías
      await editContact(contact.id, newName, selectedCategories)
      console.log("editContact successful")
      
      // Notificar al padre sobre los cambios
      onEditContact(contact.id, newName, selectedCategories)
      console.log("onEditContact called")
      
      addToast({
        title: "Success",
        description: "Contact updated successfully",
      })
      
      setOpen(false)
    } catch (error) {
      console.error("Error editing contact:", error)
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      addToast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      })
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-[#aebac1]">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-md p-0">
        <DialogHeader className="bg-[#202c33] px-4 py-3 flex-row items-center justify-between">
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#aebac1] hover:text-[#e9edef]"
              onClick={() => {
                if (typeof onClose === "function") {
                  onClose()
                }
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="p-4 space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={contact.photoURL || contact.avatar || DEFAULT_AVATAR} />
              <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-[#8696a0] uppercase">Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#2a3942] border-0 text-[#d1d7db] placeholder:text-[#8696a0] focus-visible:ring-0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#8696a0] uppercase">Phone Number</label>
              <Input
                value={contact.phoneNumber}
                readOnly
                className="bg-[#2a3942] border-0 text-[#d1d7db] focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#e9edef]">Categories</h3>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    className="data-[state=checked]:bg-[#00a884] data-[state=checked]:border-[#00a884]"
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleEdit} className="w-full bg-[#00a884] hover:bg-[#02906f] text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}