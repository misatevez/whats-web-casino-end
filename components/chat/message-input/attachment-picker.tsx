import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Paperclip, Image as ImageIcon, Camera, File } from "lucide-react";

interface AttachmentPickerProps {
  show: boolean;
  onToggle: (show: boolean) => void;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function AttachmentPicker({
  show,
  onToggle,
  onFileSelect,
  disabled
}: AttachmentPickerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Popover open={show} onOpenChange={onToggle}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          disabled={disabled}
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
            <span className="text-[#d1d7db] text-sm">Photos & Videos</span>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
          </label>
          <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
            <Camera className="h-5 w-5 text-[#8696a0]" />
            <span className="text-[#d1d7db] text-sm">Camera</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
          <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#182229] cursor-pointer rounded transition-colors">
            <File className="h-5 w-5 text-[#8696a0]" />
            <span className="text-[#d1d7db] text-sm">Document</span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}