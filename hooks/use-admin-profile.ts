import { useState, useEffect } from 'react';
import { getAdminProfile, updateAdminProfile, uploadAdminProfileImage } from '@/lib/data/admin';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export function useAdminProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadProfile = async () => {
    try {
      console.log('🔵 useAdminProfile: Starting profile load');
      const data = await getAdminProfile();
      console.log('🔵 useAdminProfile: Profile data received:', {
        name: data.name,
        about: data.about,
        statusesCount: data.statuses?.length,
        statuses: data.statuses
      });
      setProfile(data);
      console.log('✅ useAdminProfile: Profile loaded and state updated');
    } catch (error) {
      console.error('❌ useAdminProfile: Error loading profile:', error);
      toast.error('Failed to load admin profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) {
      console.error('❌ useAdminProfile: Cannot update profile: No profile loaded');
      return;
    }
    
    try {
      console.log('🔵 useAdminProfile: Starting profile update with:', updates);
      setIsSaving(true);
      
      // Update in Firebase
      await updateAdminProfile(updates);
      console.log('✅ useAdminProfile: Firebase update successful');
      
      // Update local state
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      
      toast.success('Profile updated successfully');
      console.log('✅ useAdminProfile: Profile update complete');
      return true;
    } catch (error) {
      console.error('❌ useAdminProfile: Error updating profile:', error);
      toast.error('Failed to update profile');
      
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
    loadProfile
  };
}