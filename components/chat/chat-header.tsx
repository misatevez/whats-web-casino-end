"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical } from "lucide-react";
import Image from "next/image";
import { Status } from "@/lib/types";

interface ChatHeaderProps {
  avatar: string;
  name: string;
  online: boolean;
  onInfoClick: () => void;
  onSearchClick: () => void;
  onAvatarClick?: () => void;
  statuses?: Status[];
}

export function ChatHeader({ 
  avatar, 
  name, 
  online, 
  onInfoClick, 
  onSearchClick,
  onAvatarClick,
  statuses 
}: ChatHeaderProps) {
  return (
    <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 header-container">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar 
            className={`h-10 w-10 cursor-pointer ${statuses?.length ? 'ring-2 ring-[#00a884] ring-offset-2 ring-offset-[#202c33]' : ''}`} 
            onClick={onAvatarClick}
          >
            <Image
              src={avatar}
              alt={name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Avatar>
        </div>
        <div className="cursor-pointer" onClick={onInfoClick}>
          <div className="text-[#e9edef] font-medium">
            {name}
          </div>
          <div className="text-sm text-[#8696a0]">
            {online ? "online" : "offline"}
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-[#aebac1]">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSearchClick}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onInfoClick}>
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}