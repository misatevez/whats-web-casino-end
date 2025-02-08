import { useState } from 'react';
import { Status, UserProfile } from '@/lib/types';
import { uploadAdminStatus, deleteAdminStatus } from '@/lib/data/admin';
import { toast } from 'sonner';

export function useStatusManagement(adminData: UserProfile, setAdminData: (data: UserProfile) => void) {
  const [showStatusUpload, setShowStatusUpload] = useState(false);
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleStatusUpload = async (file: File, caption?: string) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only images are allowed');
      return;
    }

    try {
      setIsUploading(true);
      const newStatus = await uploadAdminStatus(file, caption);
      
      const updatedStatuses = [newStatus, ...(adminData.statuses || [])];
      setAdminData({
        ...adminData,
        statuses: updatedStatuses
      });
      
      setShowStatusUpload(false);
      toast.success('Status uploaded successfully');
    } catch (error) {
      console.error('Error uploading status:', error);
      toast.error('Failed to upload status');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusDelete = async (statusId: string) => {
    try {
      await deleteAdminStatus(statusId);
      
      const updatedStatuses = adminData.statuses?.filter(status => status.id !== statusId) || [];
      setAdminData({
        ...adminData,
        statuses: updatedStatuses
      });
      
      toast.success('Status deleted successfully');
    } catch (error) {
      console.error('Error deleting status:', error);
      toast.error('Failed to delete status');
    }
  };

  return {
    showStatusUpload,
    setShowStatusUpload,
    showStatusViewer,
    setShowStatusViewer,
    isUploading,
    handleStatusUpload,
    handleStatusDelete
  };
}