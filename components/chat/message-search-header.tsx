"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Message } from "@/lib/types";

interface MessageSearchHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClose: () => void;
  filteredMessages: Message[];
  selectedIndex: number | null;
  onNext: () => void;
  onPrevious: () => void;
}

export function MessageSearchHeader({
  searchTerm,
  onSearchChange,
  onClose,
  filteredMessages,
  selectedIndex,
  onNext,
  onPrevious
}: MessageSearchHeaderProps) {
  return (
    <div className="h-16 bg-[#202c33] flex items-center px-4 gap-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClose}
      >
        <ArrowLeft className="h-5 w-5 text-[#aebac1]" />
      </Button>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#aebac1]" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar mensajes"
          className="pl-10 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0]"
          autoFocus
        />
      </div>
      {searchTerm && filteredMessages.length > 0 && (
        <div className="text-[#8696a0] text-sm">
          {selectedIndex !== null ? selectedIndex + 1 : 0} de {filteredMessages.length}
        </div>
      )}
      {searchTerm && filteredMessages.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={selectedIndex === 0}
          >
            <ArrowLeft className="h-5 w-5 text-[#aebac1]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={selectedIndex === filteredMessages.length - 1}
          >
            <ArrowLeft className="h-5 w-5 text-[#aebac1] rotate-180" />
          </Button>
        </div>
      )}
    </div>
  );
}