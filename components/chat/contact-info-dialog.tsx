"use client";

import { UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Chat } from "@/lib/types";

interface ContactInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: Chat;
  onSaveContact: () => void;
}

export function ContactInfoDialog({
  open,
  onOpenChange,
  chat,
  onSaveContact,
}: ContactInfoDialogProps) {
  const isUnsavedContact = !isNaN(Number(chat.name));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-4 p-4 bg-[#111b21] rounded-lg">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={128}
                height={128}
                className="rounded-full"
              />
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold">{chat.name}</h2>
              <p className="text-sm sm:text-base text-[#8696a0]">{chat.phoneNumber}</p>
              {isUnsavedContact && (
                <Button
                  variant="ghost"
                  className="mt-2 text-[#00a884] hover:text-[#00a884] hover:bg-[#202c33]"
                  onClick={onSaveContact}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add to Contacts
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 bg-[#111b21] rounded-lg">
            <h3 className="text-xs sm:text-sm text-[#8696a0] mb-1">About</h3>
            <p className="text-sm sm:text-base text-[#e9edef]">{chat.about || "Hey there! I am using WhatsApp"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}