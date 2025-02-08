import { useState, FormEvent } from "react";
import { MessagePreview } from "@/lib/types";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload";
import { EmojiPicker } from "./emoji-picker";
import { AttachmentPicker } from "./attachment-picker";
import { MessagePreviewDisplay } from "./message-preview";
import { MessageField } from "./message-field";
import { SendButton } from "./send-button";

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

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setShowAttachments(false);

      const tempPreview: MessagePreview = {
        type: file.type.startsWith('image/') ? 'image' : 'document',
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      setMessagePreview(tempPreview);

      const downloadURL = await uploadFile(file, ({ progress, error }) => {
        if (error) {
          toast.error(error);
          setIsUploading(false);
          setMessagePreview(null);
          return;
        }
        setUploadProgress(progress);
      });

      setMessagePreview({
        ...tempPreview,
        url: downloadURL
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      setMessagePreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#202c33] p-2">
      <div className="flex flex-col gap-2 max-w-3xl mx-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <EmojiPicker
            showPicker={showEmojiPicker}
            onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
            onEmojiSelect={handleEmojiSelect}
            disabled={isUploading}
          />

          <AttachmentPicker
            show={showAttachments}
            onToggle={setShowAttachments}
            onFileSelect={handleFileSelect}
            disabled={isUploading}
          />

          {messagePreview && (
            <MessagePreviewDisplay
              preview={messagePreview}
              onRemove={() => setMessagePreview(null)}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}

          <MessageField
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={handleSubmit}
            disabled={isUploading}
          />

          <SendButton 
            disabled={isUploading || (!newMessage.trim() && !messagePreview)} 
          />
        </div>
      </div>
    </form>
  );
}