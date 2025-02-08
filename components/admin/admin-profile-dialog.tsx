"use client";

import { useState, useEffect } from "react";
import { Camera, Edit } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

interface AdminProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function AdminProfileDialog({
  open,
  onOpenChange,
  profile: externalProfile,
  onProfileUpdate: externalUpdate
}: AdminProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAbout(profile.about);
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      console.log('🔵 Getting admin profile from Firebase');
      const profileRef = doc(db, 'admin/profile');
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        console.log('🔵 No profile found, creating default profile');
        const defaultProfile = {
          name: "WhatsApp Support",
          image: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
          about: "Official WhatsApp Support",
          statuses: []
        };
        
        await setDoc(profileRef, {
          ...defaultProfile,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setProfile(defaultProfile);
      } else {
        const data = profileDoc.data();
        setProfile({
          name: data.name || "WhatsApp Support",
          image: data.image || "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
          about: data.about || "Official WhatsApp Support",
          statuses: []
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      toast.error('Failed to load profile');
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsSaving(true);
      console.log('🔵 Starting admin profile image upload');
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `admin/profile_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update profile with new image URL
      const profileRef = doc(db, 'admin/profile');
      await updateDoc(profileRef, {
        image: downloadURL,
        updatedAt: new Date()
      });
      
      setProfile({ ...profile, image: downloadURL });
      externalUpdate({ ...profile, image: downloadURL });
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile image:', error);
      toast.error('Failed to update profile image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setIsSaving(true);
      const updates = {
        name: name.trim(),
        about: about.trim(),
        updatedAt: new Date()
      };

      const profileRef = doc(db, 'admin/profile');
      await updateDoc(profileRef, updates);
      
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      externalUpdate(updatedProfile);
      
      toast.success('Profile updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <Image
                  src={profile.image}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-[#00a884] p-2 rounded-full cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  disabled={isSaving}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8696a0]">Your Name</label>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#2a3942] border-none text-[#d1d7db]"
                disabled={isSaving}
              />
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4 text-[#00a884]" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8696a0]">About</label>
            <div className="flex gap-2">
              <Input
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="bg-[#2a3942] border-none text-[#d1d7db]"
                disabled={isSaving}
              />
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4 text-[#00a884]" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-[#00a884] hover:bg-[#02906f] text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}