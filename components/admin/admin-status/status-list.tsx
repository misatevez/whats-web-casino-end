import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Status } from "@/lib/types";

interface StatusListProps {
  statuses: Status[];
  viewOnly: boolean;
  onDelete?: (statusId: number) => void;
  onViewerOpen: () => void;
}

export function StatusList({
  statuses,
  viewOnly,
  onDelete,
  onViewerOpen
}: StatusListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-[#8696a0] text-sm">Recent Updates</h3>
      <div className="space-y-2">
        {statuses.map((status) => (
          <div 
            key={status.id} 
            className="flex items-center gap-3 p-2 hover:bg-[#202c33] rounded-lg"
          >
            <div 
              className="relative flex-1 cursor-pointer"
              onClick={onViewerOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#00a884]">
                  <Image
                    src={status.imageUrl}
                    alt={`Status ${status.id}`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[#e9edef]">My Status</p>
                  <p className="text-sm text-[#8696a0]">{status.timestamp}</p>
                  {status.caption && (
                    <p className="text-sm text-[#8696a0] truncate">{status.caption}</p>
                  )}
                </div>
              </div>
            </div>
            {!viewOnly && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(status.id)}
                className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#202c33]"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}