"use client";

import { Camera, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Status } from "@/lib/types";
import { StatusViewerDialog } from "@/components/chat/status-viewer-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface AdminStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statuses: Status[];
  onStatusUpload?: (file: File, caption?: string) => void;
  onStatusDelete?: (statusId: number) => void;
  viewOnly?: boolean;
}

export function AdminStatusDialog({
  open,
  onOpenChange,
  statuses,
  onStatusUpload,
  onStatusDelete,
  viewOnly = false
}: AdminStatusDialogProps) {
  const [showViewer, setShowViewer] = useState(false);
  const [caption, setCaption] = useState("");
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && onStatusUpload) {
      setSelectedFile(file);
      setShowCaptionInput(true);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onStatusUpload) {
      onStatusUpload(selectedFile, caption);
      setSelectedFile(null);
      setCaption("");
      setShowCaptionInput(false);
    }
  };

  const handleDelete = async (statusId: number) => {
    if (!onStatusDelete) return;
    
    try {
      setIsDeleting(true);
      await onStatusDelete(statusId);
      toast.success('Status deleted successfully');
    } catch (error) {
      toast.error('Failed to delete status');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#222e35] text-[#e9edef] border-none max-w-md">
          <DialogHeader>
            <DialogTitle>Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showCaptionInput ? (
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
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="bg-[#2a3942] border-none text-[#d1d7db]"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedFile(null);
                      setCaption("");
                      setShowCaptionInput(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-[#00a884] hover:bg-[#02906f] text-white"
                  >
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative h-[300px] bg-[#111b21] rounded-lg flex items-center justify-center">
                  {statuses.length > 0 ? (
                    <div className="w-full h-full">
                      <Image
                        src={statuses[0].imageUrl}
                        alt="Latest Status"
                        fill
                        className="object-cover rounded-lg cursor-pointer"
                        onClick={() => setShowViewer(true)}
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
                            onChange={handleFileChange}
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
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {statuses.length > 0 && (
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
                            onClick={() => setShowViewer(true)}
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
                          {!viewOnly && onStatusDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(status.id)}
                              className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#202c33]"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <StatusViewerDialog
        open={showViewer}
        onOpenChange={setShowViewer}
        statuses={statuses}
      />
    </>
  );
}