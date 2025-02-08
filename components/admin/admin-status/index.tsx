"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Status } from "@/lib/types";
import { StatusViewerDialog } from "@/components/chat/status-viewer-dialog";
import { StatusUpload } from "./status-upload";
import { StatusList } from "./status-list";
import { StatusPreview } from "./status-preview";

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
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

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
      resetUploadState();
    }
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setCaption("");
    setShowCaptionInput(false);
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
              <StatusUpload
                selectedFile={selectedFile}
                caption={caption}
                onCaptionChange={setCaption}
                onCancel={resetUploadState}
                onUpload={handleUpload}
              />
            ) : (
              <div className="space-y-4">
                <StatusPreview
                  statuses={statuses}
                  viewOnly={viewOnly}
                  onStatusUpload={onStatusUpload}
                  onFileChange={handleFileChange}
                  onViewerOpen={() => setShowViewer(true)}
                />

                {statuses.length > 0 && (
                  <StatusList
                    statuses={statuses}
                    viewOnly={viewOnly}
                    onDelete={onStatusDelete}
                    onViewerOpen={() => setShowViewer(true)}
                  />
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