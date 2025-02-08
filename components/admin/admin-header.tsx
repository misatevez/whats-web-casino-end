"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Image as ImageIcon, UserPlus } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/lib/types";
import { AdminStatusDialog } from "./admin-status-dialog";

interface AdminHeaderProps {
  profile: UserProfile;
  onProfileClick: () => void;
  onStatusClick: () => void;  // Added this prop
  onViewStatus: () => void;
  onAddNumberClick: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  profile,
  onProfileClick,
  onStatusClick,
  onViewStatus,
  onAddNumberClick,
  onLogout
}: AdminHeaderProps) {
  const [showStatusUpload, setShowStatusUpload] = useState(false);

  return (
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
        {profile.statuses && profile.statuses.length > 0 && (
          <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 border-[#202c33] bg-[#00a884] flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-[#00a884]" />
          </div>
        )}
      </div>
      <div className="flex gap-4 text-[#aebac1]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onStatusClick}
          className="text-[#00a884]"
          title="Add Status"
        >
          <Plus className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onViewStatus}
          className="text-[#00a884]"
          title="View Status"
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onAddNumberClick}
          className="text-[#00a884]"
          title="Add Contact"
        >
          <UserPlus className="h-5 w-5" />
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

      <AdminStatusDialog
        open={showStatusUpload}
        onOpenChange={setShowStatusUpload}
        statuses={profile.statuses || []}
        viewOnly={false}
      />
    </div>
  );
}