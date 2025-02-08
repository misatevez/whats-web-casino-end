"use client";

import { useState } from "react";
import { UserPlus, Edit } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Chat } from "@/lib/types";
import { updateContactName } from "@/lib/data/chat";
import { toast } from "sonner";

interface AdminContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: Chat | null;
}

export function AdminContactDialog({
  open,
  onOpenChange,
  chat
}: AdminContactDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!chat || !newName.trim()) return;
    
    try {
      setIsSaving(true);
      await updateContactName(chat.id, newName.trim());
      toast.success('Contact name updated successfully');
      setIsEditing(false);
      setNewName("");
    } catch (error) {
      console.error('Error saving contact name:', error);
      toast.error('Failed to update contact name');
    } finally {
      setIsSaving(false);
    }
  };

  if (!chat) return null;

  const isUnsavedContact = !isNaN(Number(chat.name));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-4 p-4 bg-[#111b21] rounded-lg">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              </Avatar>
              {chat.online && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#00a884] rounded-full border-4 border-[#111b21]" />
              )}
            </div>
            <div className="text-center">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter contact name"
                    className="bg-[#2a3942] border-none text-[#d1d7db]"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    disabled={!newName.trim() || isSaving}
                    className="text-[#00a884] hover:text-[#00a884] hover:bg-[#202c33]"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-semibold">{chat.name}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNewName(chat.name);
                        setIsEditing(true);
                      }}
                      className="text-[#00a884] hover:text-[#00a884] hover:bg-[#202c33]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  {chat.online && (
                    <span className="text-[#00a884] text-sm">online</span>
                  )}
                </div>
              )}
              <p className="text-sm sm:text-base text-[#8696a0] mt-1">{chat.phoneNumber}</p>
              {isUnsavedContact && !isEditing && (
                <Button
                  variant="ghost"
                  className="mt-2 text-[#00a884] hover:text-[#00a884] hover:bg-[#202c33]"
                  onClick={() => {
                    setNewName("");
                    setIsEditing(true);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add to Contacts
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 bg-[#111b21] rounded-lg">
            <h3 className="text-xs sm:text-sm text-[#8696a0] mb-1">About</h3>
            <p className="text-sm sm:text-base text-[#e9edef]">
              {chat.about || "Hey there! I am using WhatsApp"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}