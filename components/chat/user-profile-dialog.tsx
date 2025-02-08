"use client";

import { Camera } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { UserProfile } from "@/lib/types";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function UserProfileDialog({
  open,
  onOpenChange,
  profile,
  onProfileUpdate,
}: UserProfileDialogProps) {
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onProfileUpdate({ ...profile, image: url });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <Image
                  src={profile.image}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-[#00a884] p-2 rounded-full cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8696a0]">Your Name</label>
            <Input
              value={profile.name}
              onChange={(e) => onProfileUpdate({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="bg-[#2a3942] border-none text-[#d1d7db]"
            />
          </div>

          <p className="text-sm text-[#8696a0]">
            This is not your username or pin. This name will be visible to your WhatsApp contacts.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#00a884] hover:bg-[#02906f] text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}