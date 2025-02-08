import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/data/profile';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export function useUserProfile(phoneNumber: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [phoneNumber]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfile(phoneNumber);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    try {
      setIsSaving(true);
      await updateUserProfile(phoneNumber, updates);
      setProfile({ ...profile, ...updates });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfileImage = async (file: File) => {
    if (!profile) return;
    
    try {
      setIsSaving(true);
      const imageUrl = await uploadProfileImage(phoneNumber, file);
      setProfile({ ...profile, image: imageUrl });
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Failed to update profile image');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    isLoading,
    isSaving,
    updateProfile,
    updateProfileImage
  };
}