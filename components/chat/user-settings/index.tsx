"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/hooks/use-user-settings";
import { ProfileImage } from "./profile-image";
import { NameField } from "./name-field";
import { AboutField } from "./about-field";
import { PhoneInfo } from "./phone-info";

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
  const {
    profile,
    isLoading,
    isSaving,
    name,
    about,
    setName,
    setAbout,
    handleProfileImageChange,
    handleSave
  } = useUserSettings(phoneNumber, onOpenChange);

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
          <ProfileImage
            image={profile.image}
            onImageChange={handleProfileImageChange}
            disabled={isSaving}
          />

          <NameField
            name={name}
            onChange={setName}
            disabled={isSaving}
          />

          <AboutField
            about={about}
            onChange={setAbout}
            disabled={isSaving}
          />

          <PhoneInfo phoneNumber={phoneNumber} />

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