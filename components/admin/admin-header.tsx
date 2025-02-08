"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/lib/types";

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
      </div>
      <div className="flex gap-4 text-[#aebac1]">
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
  );
}