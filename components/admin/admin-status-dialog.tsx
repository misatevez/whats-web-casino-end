"use client";

import { useState, useEffect } from "react";
import { Camera, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { toast } from "sonner";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadAdminStatus, deleteAdminStatus } from "@/lib/data/admin";

interface Status {
  id: string;
  caption?: string;
  createdAt: string;
  fileName: string;
  imageUrl: string;
  timestamp: string;
}

interface AdminStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate?: () => void;
}

export function AdminStatusDialog({
  open,
  onOpenChange,
  onStatusUpdate
}: AdminStatusDialogProps) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStatuses = async () => {
    try {
      console.log('🔵 AdminStatusDialog: Loading statuses directly from Firebase');
      const statusesRef = collection(db, 'admin/profile/statuses');
      const statusesQuery = query(statusesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(statusesQuery);
      
      const loadedStatuses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Status[];

      console.log('✅ AdminStatusDialog: Statuses loaded:', loadedStatuses);
      setStatuses(loadedStatuses);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ AdminStatusDialog: Error loading statuses:', error);
      toast.error('Failed to load statuses');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      console.log('🔵 AdminStatusDialog: Dialog opened, loading statuses');
      loadStatuses();
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      console.log('🔵 AdminStatusDialog: File selected:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      console.log('🔵 AdminStatusDialog: Starting status upload');
      setIsUploading(true);
      const result = await uploadAdminStatus(selectedFile, caption);
      console.log('✅ AdminStatusDialog: Status uploaded:', result);
      
      // Add the new status to the local state
      setStatuses(prevStatuses => [result, ...prevStatuses]);
      
      setSelectedFile(null);
      setCaption("");
      if (onStatusUpdate) onStatusUpdate();
      toast.success('Status uploaded successfully');
    } catch (error) {
      console.error('❌ AdminStatusDialog: Upload error:', error);
      toast.error('Failed to upload status');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (statusId: string) => {
    try {
      console.log('🔵 AdminStatusDialog: Deleting status:', statusId);
      await deleteAdminStatus(statusId);
      
      // Remove the status from local state
      setStatuses(prevStatuses => prevStatuses.filter(status => status.id !== statusId));
      
      console.log('✅ AdminStatusDialog: Status deleted');
      if (onStatusUpdate) onStatusUpdate();
      toast.success('Status deleted successfully');
    } catch (error) {
      console.error('❌ AdminStatusDialog: Delete error:', error);
      toast.error('Failed to delete status');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none max-w-md">
        <DialogHeader>
          <DialogTitle>Status Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="relative">
              {selectedFile ? (
                <div className="relative h-[200px] bg-[#111b21] rounded-lg">
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    fill
                    className="object-contain rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-[200px] bg-[#111b21] rounded-lg cursor-pointer hover:bg-[#182229] transition-colors">
                  <Camera className="h-8 w-8 text-[#00a884] mb-2" />
                  <span className="text-[#8696a0]">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="bg-[#2a3942] border-none text-[#d1d7db]"
              disabled={isUploading || !selectedFile}
            />

            <Button
              onClick={handleUpload}
              className="w-full bg-[#00a884] hover:bg-[#02906f] text-white"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Upload Status'}
            </Button>
          </div>

          {/* Status List */}
          <div>
            <h3 className="text-[#8696a0] text-sm font-medium mb-2">
              Active Statuses {isLoading ? '(Loading...)' : `(${statuses.length})`}
            </h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center gap-3 p-2 bg-[#111b21] rounded-lg"
                  >
                    <div 
                      className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(status.imageUrl)}
                    >
                      <Image
                        src={status.imageUrl}
                        alt={status.caption || 'Status'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e9edef] truncate">
                        {status.caption || 'No caption'}
                      </p>
                      <p className="text-xs text-[#8696a0]">
                        {new Date(status.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(status.id)}
                      className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#202c33]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}