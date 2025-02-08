import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface StatusUploadProps {
  selectedFile: File | null;
  caption: string;
  onCaptionChange: (caption: string) => void;
  onCancel: () => void;
  onUpload: () => void;
}

export function StatusUpload({
  selectedFile,
  caption,
  onCaptionChange,
  onCancel,
  onUpload
}: StatusUploadProps) {
  return (
    <div className="space-y-4">
      {selectedFile && (
        <div className="relative h-[300px] bg-[#111b21] rounded-lg">
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt="Status Preview"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      )}
      <Input
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder="Add a caption..."
        className="bg-[#2a3942] border-none text-[#d1d7db]"
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={onUpload}
          className="bg-[#00a884] hover:bg-[#02906f] text-white"
        >
          Share
        </Button>
      </div>
    </div>
  );
}