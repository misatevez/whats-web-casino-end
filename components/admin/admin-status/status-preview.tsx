import { Camera, Plus } from "lucide-react";
import Image from "next/image";
import { Status } from "@/lib/types";

interface StatusPreviewProps {
  statuses: Status[];
  viewOnly: boolean;
  onStatusUpload?: (file: File, caption?: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewerOpen: () => void;
}

export function StatusPreview({
  statuses,
  viewOnly,
  onStatusUpload,
  onFileChange,
  onViewerOpen
}: StatusPreviewProps) {
  return (
    <div className="relative h-[300px] bg-[#111b21] rounded-lg flex items-center justify-center">
      {statuses.length > 0 ? (
        <div className="w-full h-full">
          <Image
            src={statuses[0].imageUrl}
            alt="Latest Status"
            fill
            className="object-cover rounded-lg cursor-pointer"
            onClick={onViewerOpen}
          />
          {!viewOnly && onStatusUpload && (
            <label className="absolute bottom-4 right-4 cursor-pointer">
              <div className="bg-[#00a884] hover:bg-[#02906f] text-white p-3 rounded-full">
                <Camera className="h-6 w-6" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-[#8696a0] mb-4">No status updates</p>
          {!viewOnly && onStatusUpload && (
            <label className="cursor-pointer">
              <div className="bg-[#00a884] hover:bg-[#02906f] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Status
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}