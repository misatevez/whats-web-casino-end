"use client";

import { Camera, Edit } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
}

export function UserSettingsDialog({
  open,
  onOpenChange,
  phoneNumber,
}: UserSettingsDialogProps) {
  const { profile, isLoading, isSaving, updateProfile, updateProfileImage } = useUserProfile(phoneNumber);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAbout(profile.about);
    }
  }, [profile]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateProfileImage(file);
    }
  };

  const handleSave = async () => {
    await updateProfile({
      name: name.trim(),
      about: about.trim()
    });
    onOpenChange(false);
  };

  if (isLoading || !profile) {
    return null;
  }

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
                  disabled={isSaving}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8696a0]">Your Name</label>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-[#2a3942] border-none text-[#d1d7db]"
                disabled={isSaving}
              />
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4 text-[#00a884]" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8696a0]">About</label>
            <div className="flex gap-2">
              <Input
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Hey there! I am using WhatsApp"
                className="bg-[#2a3942] border-none text-[#d1d7db]"
                disabled={isSaving}
              />
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4 text-[#00a884]" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#111b21] p-4 rounded-lg">
            <div className="text-[#8696a0]">
              <span className="block text-sm">Phone Number</span>
              <span className="text-base">{phoneNumber}</span>
            </div>
          </div>

          <p className="text-sm text-[#8696a0]">
            This is not your username or pin. This name will be visible to your WhatsApp contacts.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-[#00a884] hover:bg-[#02906f] text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}