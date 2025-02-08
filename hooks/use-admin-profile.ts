import { useState, useEffect } from 'react';
import { getAdminProfile, updateAdminProfile, uploadAdminProfileImage } from '@/lib/data/admin';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export function useAdminProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('🔵 Loading admin profile');
      setIsLoading(true);
      const data = await getAdminProfile();
      console.log('✅ Admin profile loaded:', data);
      setProfile(data);
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      toast.error('Failed to load admin profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) {
      console.error('❌ Cannot update profile: No profile loaded');
      return;
    }
    
    try {
      console.log('🔵 Starting profile update with:', updates);
      setIsSaving(true);
      
      // Update in Firebase
      await updateAdminProfile(updates);
      console.log('✅ Firebase update successful');
      
      // Update local state
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      
      toast.success('Profile updated successfully');
      console.log('✅ Profile update complete');
      return true;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast.error('Failed to update profile');
      
      // Reload profile to ensure UI shows correct data
      await loadProfile();
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfileImage = async (file: File) => {
    if (!profile) {
      console.error('❌ Cannot update profile image: No profile loaded');
      return;
    }
    
    try {
      console.log('🔵 Starting profile image update');
      setIsSaving(true);
      
      // Upload image and get URL
      const imageUrl = await uploadAdminProfileImage(file);
      console.log('✅ Image uploaded successfully:', imageUrl);
      
      // Update profile with new image URL
      await updateAdminProfile({ image: imageUrl });
      
      // Update local state
      setProfile({ ...profile, image: imageUrl });
      
      toast.success('Profile image updated successfully');
      console.log('✅ Profile image update complete');
      return true;
    } catch (error) {
      console.error('❌ Error updating profile image:', error);
      toast.error('Failed to update profile image');
      
      // Reload profile to ensure UI shows correct data
      await loadProfile();
      return false;
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