"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/lib/types";
import { AdminStatusDialog } from "./admin-status-dialog";

interface AdminHeaderProps {
  profile: UserProfile;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  profile,
  onProfileClick,
  onLogout
}: AdminHeaderProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  return (
    <>
      <div className="h-16 bg-[#202c33] flex items-center justify-between px-4">
        <div className="relative">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={onProfileClick}>
            <Image
              src={profile.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Avatar>
        </div>
        <div className="flex gap-4 text-[#aebac1]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStatusDialog(true)}
            className="text-[#aebac1] hover:text-[#e9edef]"
            title="Status"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-[#ea4335]"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AdminStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />
    </>
  );
}