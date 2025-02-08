import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { Status } from "@/lib/types";
import { useStatusViewer } from "@/hooks/use-status-viewer";
import { useStatusReply } from "@/hooks/use-status-reply";
import { StatusProgress } from "./status/status-progress";
import { StatusNavigation } from "./status/status-navigation";
import { StatusReply } from "./status/status-reply";

interface StatusViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statuses: Status[];
  onReply?: (statusId: string, reply: string, imageUrl: string) => void;
}

export function StatusViewerDialog({
  open,
  onOpenChange,
  statuses = [],
  onReply
}: StatusViewerDialogProps) {
  const {
    currentIndex,
    progress,
    handleNext,
    handlePrevious,
    reset
  } = useStatusViewer(statuses);

  const {
    showReply,
    reply,
    setShowReply,
    setReply,
    handleReplySubmit,
    resetReply
  } = useStatusReply();

  if (!statuses.length) return null;

  const currentStatus = statuses[currentIndex];
  if (!currentStatus) return null;

  const handleClose = () => {
    reset();
    resetReply();
    onOpenChange(false);
  };

  const handleReply = () => {
    if (onReply) {
      handleReplySubmit((replyText) => {
        onReply(currentStatus.id, replyText, currentStatus.imageUrl);
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#111b21] text-[#e9edef] border-none max-w-2xl h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Status Viewer</DialogTitle>
        </DialogHeader>
        <div className="relative h-full flex flex-col">
          <StatusProgress
            count={statuses.length}
            currentIndex={currentIndex}
            progress={progress}
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={handleClose}
          >
            <X className="h-6 w-6 text-white" />
          </Button>

          <StatusNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < statuses.length - 1}
          />

          <div className="flex-1 relative">
            <Image
              src={currentStatus.imageUrl}
              alt={`Status ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
            {currentStatus.caption && (
              <div className="absolute bottom-20 left-0 right-0 p-4 text-center">
                <p className="text-white text-lg">{currentStatus.caption}</p>
              </div>
            )}
          </div>

          {onReply && (
            <StatusReply
              showReply={showReply}
              reply={reply}
              onReplyChange={setReply}
              onSubmit={handleReply}
              onShowReply={() => setShowReply(true)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}