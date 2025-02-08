import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      resetReply();
    }
    onOpenChange(newOpen);
  };

  const handleReply = () => {
    if (onReply && reply.trim()) {
      handleReplySubmit((replyText) => {
        onReply(currentStatus.id, replyText, currentStatus.imageUrl);
        handleDialogChange(false);
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent 
        className="bg-[#111b21] text-[#e9edef] border-none max-w-2xl h-[90vh] p-0"
        onInteractOutside={(e) => {
          e.preventDefault();
          handleDialogChange(false);
        }}
        onEscapeKeyDown={() => handleDialogChange(false)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Visor de Estados</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="flex gap-1 p-4">
            {Array.from({ length: statuses.length }).map((_, index) => (
              <div
                key={index}
                className="flex-1 h-0.5 bg-[#ffffff40] overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index === currentIndex ? `${progress}%` : 
                           index < currentIndex ? "100%" : "0%"
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center px-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="text-white disabled:opacity-0 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center px-4">
              <button
                onClick={handleNext}
                disabled={currentIndex === statuses.length - 1}
                className="text-white disabled:opacity-0 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={currentStatus.imageUrl}
                alt={`Estado ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {currentStatus.caption && (
              <div className="absolute bottom-20 left-0 right-0 p-4 text-center">
                <p className="text-white text-lg bg-black/30 p-2 rounded-lg inline-block">
                  {currentStatus.caption}
                </p>
              </div>
            )}
          </div>

          {onReply && (
            <div className="p-4">
              <StatusReply
                showReply={showReply}
                reply={reply}
                onReplyChange={setReply}
                onSubmit={handleReply}
                onShowReply={() => setShowReply(true)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}