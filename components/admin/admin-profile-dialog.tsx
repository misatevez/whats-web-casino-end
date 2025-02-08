"use client";

import { Camera, Edit } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { UserProfile } from "@/lib/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AdminProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function AdminProfileDialog({
  open,
  onOpenChange,
  profile,
  onProfileUpdate,
}: AdminProfileDialogProps) {
  const [name, setName] = useState(profile.name);
  const [about, setAbout] = useState(profile.about);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setAbout(profile.about);
  }, [profile]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        await onProfileUpdate({ ...profile, image: URL.createObjectURL(file) });
      } catch (error) {
        toast.error('Failed to update profile image');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSave = async () => {
    const updates: Partial<UserProfile> = {};
    if (name !== profile.name) {
      updates.name = name;
    }
    if (about !== profile.about) {
      updates.about = about;
    }

    if (Object.keys(updates).length > 0) {
      try {
        setIsSaving(true);
        await onProfileUpdate({ ...profile, ...updates });
        onOpenChange(false);
      } catch (error) {
        toast.error('Failed to save profile');
      } finally {
        setIsSaving(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
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
                className="bg-[#2a3942] border-none text-[#d1d7db]"
                disabled={isSaving}
              />
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4 text-[#00a884]" />
              </Button>
            </div>
          </div>
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