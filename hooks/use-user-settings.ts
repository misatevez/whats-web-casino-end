import { useState, useEffect } from 'react';
import { useUserProfile } from './use-user-profile';

export function useUserSettings(phoneNumber: string, onClose: (open: boolean) => void) {
  const { profile, isLoading, isSaving, updateProfile, updateProfileImage } = useUserProfile(phoneNumber);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAbout(profile.about);
    }
  }, [profile]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateProfileImage(file);
    }
  };

  const handleSave = async () => {
    await updateProfile({
      name: name.trim(),
      about: about.trim()
    });
    onClose(false);
  };

  return {
    profile,
    isLoading,
    isSaving,
    name,
    about,
    setName,
    setAbout,
    handleProfileImageChange,
    handleSave
  };
}