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
  const latestStatus = statuses[0];

  if (!latestStatus) {
    return (
      <div className="relative h-[300px] bg-[#111b21] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8696a0] mb-4">No status updates</p>
          {!viewOnly && onStatusUpload && (
            <label className="cursor-pointer">
              <div className="bg-[#00a884] hover:bg-[#02906f] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
      </div>
    );
  }

  return (
    <div className="relative h-[300px] bg-[#111b21] rounded-lg">
      {/* Status Preview */}
      <div 
        className="w-full h-full cursor-pointer"
        onClick={onViewerOpen}
      >
        <Image
          src={latestStatus.imageUrl}
          alt="Latest Status"
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Upload Button */}
      {!viewOnly && onStatusUpload && (
        <label className="absolute bottom-4 right-4 cursor-pointer z-10">
          <div className="bg-[#00a884] hover:bg-[#02906f] text-white p-3 rounded-full transition-colors shadow-lg">
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

      {/* Status Caption */}
      {latestStatus.caption && (
        <div className="absolute bottom-4 left-4 right-16 z-10">
          <p className="text-white text-sm line-clamp-2 bg-black/50 p-2 rounded">
            {latestStatus.caption}
          </p>
        </div>
      )}
    </div>
  );
}