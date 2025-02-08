"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
}

export function ImageViewerDialog({
  open,
  onOpenChange,
  imageUrl,
}: ImageViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none max-w-[95vw] sm:max-w-[90vw] h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Image Viewer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 bg-[#202c33]">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5 text-[#aebac1]" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center bg-[#111b21] p-4">
            {imageUrl && (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt="Full size"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}