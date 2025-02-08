import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { uploadFile, UploadProgress } from '@/lib/upload';
import { MessagePreview } from '@/lib/types';

interface FileUploadProps {
  file: File;
  onComplete: (preview: MessagePreview) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function FileUpload({
  file,
  onComplete,
  onError,
  onCancel
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    try {
      const downloadURL = await uploadFile(file, ({ progress, error }) => {
        if (error) {
          onError(error);
          return;
        }
        setUploadProgress(progress);
      });

      const isImage = file.type.startsWith('image/');
      const preview: MessagePreview = {
        type: isImage ? 'image' : 'document',
        name: file.name,
        url: downloadURL,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };

      onComplete(preview);
    } catch (error: any) {
      onError(error.message);
    }
  };

  // Start upload when component mounts
  useState(() => {
    handleUpload();
  });

  return (
    <div className="flex items-center gap-2 bg-[#2a3942] px-3 py-2 rounded-lg">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#e9edef] truncate">{file.name}</span>
          <span className="text-[#8696a0]">{uploadProgress.toFixed(0)}%</span>
        </div>
        <Progress value={uploadProgress} className="h-1" />
      </div>
      <button
        onClick={onCancel}
        className="text-[#8696a0] hover:text-[#e9edef] text-sm"
      >
        Cancel
      </button>
    </div>
  );
}