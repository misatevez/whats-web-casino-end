"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Paperclip, ArrowRight, Image as ImageIcon, Camera, File, X, Loader2 } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { MessagePreview } from "@/lib/types";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload";

interface MessageInputProps {
  onSendMessage: (content: string, preview: MessagePreview | null) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [messagePreview, setMessagePreview] = useState<MessagePreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !messagePreview) || isUploading) return;
    onSendMessage(newMessage, messagePreview);
    setNewMessage("");
    setMessagePreview(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setShowAttachments(false);

      const tempPreview: MessagePreview = {
        type: file.type.startsWith('image/') ? 'image' : 'document',
        name: file.name,
        url: '', 
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };

      setMessagePreview({
        ...tempPreview,
        url: URL.createObjectURL(file)
      });

      const downloadURL = await uploadFile(file, ({ progress, error }) => {
        if (error) {
          toast.error(error);
          setIsUploading(false);
          setMessagePreview(null);
          return;
        }
        setUploadProgress(progress);
      });

      const finalPreview = {
        ...tempPreview,
        url: downloadURL
      };
      
      setMessagePreview(finalPreview);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Error al subir el archivo');
      setMessagePreview(null);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#202c33] p-2 input-container">
      <div className="flex items-center gap-1 sm:gap-2 max-w-3xl mx-auto">
        <div className="relative">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isUploading}
          >
            <Smile className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 z-50 mb-2">
              <EmojiPicker 
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>

        <Popover open={showAttachments} onOpenChange={setShowAttachments}>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              disabled={isUploading}
            >
              <Paperclip className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-48 bg-[#233138] border border-[#233138] p-1" 
            align="start"
            sideOffset={5}
          >
            <div className="flex flex-col">
              <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
                <ImageIcon className="h-5 w-5 text-[#8696a0]" />
                <span className="text-[#d1d7db] text-sm">Fotos y Videos</span>
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
              </label>
              <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
                <Camera className="h-5 w-5 text-[#8696a0]" />
                <span className="text-[#d1d7db] text-sm">Cámara</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
              </label>
              <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
                <File className="h-5 w-5 text-[#8696a0]" />
                <span className="text-[#d1d7db] text-sm">Documento</span>
                <input type="file" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
          </PopoverContent>
        </Popover>

        {messagePreview && (
          <div className="flex items-center gap-2 bg-[#2a3942] px-2 sm:px-3 py-1 rounded-lg">
            {messagePreview.type === 'image' ? (
              <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#8696a0]" />
            ) : (
              <File className="h-4 w-4 sm:h-5 sm:w-5 text-[#8696a0]" />
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[#e9edef] text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[100px]">
                  {messagePreview.name}
                </span>
                {isUploading && (
                  <Loader2 className="h-4 w-4 text-[#00a884] animate-spin" />
                )}
              </div>
              {isUploading && (
                <div className="w-full bg-[#202c33] rounded-full h-1">
                  <div
                    className="bg-[#00a884] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 sm:h-6 sm:w-6"
              onClick={() => setMessagePreview(null)}
              disabled={isUploading}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 text-[#8696a0]" />
            </Button>
          </div>
        )}

        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Escribe un mensaje"
          className="flex-1 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0] text-sm sm:text-base h-9 sm:h-10"
          disabled={isUploading}
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon"
          disabled={isUploading || (!newMessage.trim() && !messagePreview)}
        >
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
        </Button>
      </div>
    </form>
  );
}