"use client";

import { Check, Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Message } from "@/lib/types";
import { toast } from "sonner";

interface AdminChatMessageProps {
  message: Message;
  onImageClick?: (url: string) => void;
}

export function AdminChatMessage({ message, onImageClick }: AdminChatMessageProps) {
  const isUserMessage = message.sent;
  
  const handleDownload = async (url: string, filename: string) => {
    try {
      console.log('🔵 Starting download:', { url, filename });
      const toastId = toast.loading('Starting download...');
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to document, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss(toastId);
      toast.success('Download started');
      console.log('✅ Download initiated successfully');
    } catch (error) {
      console.error('❌ Error downloading file:', error);
      console.log('❌ Message preview:', message.preview);
      toast.error('Failed to download. Opening in new tab...');
      
      // Fallback: Open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div
      className={`flex ${
        isUserMessage ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[60%] rounded-lg p-3 ${
          isUserMessage ? "bg-[#202c33]" : "bg-[#005c4b]"
        }`}
      >
        {message.preview ? (
          message.preview.type === 'image' ? (
            <div className="space-y-2">
              <div
                className="cursor-pointer"
                onClick={() => onImageClick?.(message.preview!.url)}
              >
                <Image
                  src={message.preview.url}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              {message.content && (
                <p className="text-[#e9edef] mt-2">{message.content}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-[#2a3942] p-3 rounded-lg">
              <File className="h-8 w-8 text-[#8696a0]" />
              <div className="flex-1 min-w-0">
                <p className="text-[#e9edef] truncate">{message.preview.name}</p>
                <p className="text-[#8696a0] text-sm">{message.preview.size}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#00a884] hover:text-[#02906f] hover:bg-[#202c33] transition-colors"
                onClick={() => {
                  console.log('🔵 Download button clicked', {
                    url: message.preview?.url,
                    name: message.preview?.name
                  });
                  if (message.preview?.url && message.preview?.name) {
                    handleDownload(message.preview.url, message.preview.name);
                  } else {
                    console.error('❌ Missing URL or filename:', message.preview);
                    toast.error('Download information is missing');
                  }
                }}
                title="Download file"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          )
        ) : (
          <p className="text-[#e9edef]">{message.content}</p>
        )}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-[#8696a0]">{message.time}</span>
          {!isUserMessage && message.status && (
            <Check
              className={`h-4 w-4 ${
                message.status === "read" ? "text-[#53bdeb]" : "text-[#8696a0]"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}