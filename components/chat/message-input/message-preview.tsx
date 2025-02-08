import { Button } from "@/components/ui/button";
import { File, ImageIcon, X } from "lucide-react";
import { MessagePreview } from "@/lib/types";

interface MessagePreviewDisplayProps {
  preview: MessagePreview;
  onRemove: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function MessagePreviewDisplay({
  preview,
  onRemove,
  isUploading,
  uploadProgress = 0
}: MessagePreviewDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-[#2a3942] px-2 sm:px-3 py-1 rounded-lg">
      {preview.type === 'image' ? (
        <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#8696a0]" />
      ) : (
        <File className="h-4 w-4 sm:h-5 sm:w-5 text-[#8696a0]" />
      )}
      <div className="flex flex-col">
        <span className="text-[#e9edef] text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[100px]">
          {preview.name}
        </span>
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
        onClick={onRemove}
        disabled={isUploading}
      >
        <X className="h-3 w-3 sm:h-4 sm:w-4 text-[#8696a0]" />
      </Button>
    </div>
  );
}