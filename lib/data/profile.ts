import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { UserProfile } from '../types';

// Get user profile
export async function getUserProfile(phoneNumber: string): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', phoneNumber);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create default profile if it doesn't exist
      const defaultProfile = {
        name: phoneNumber,
        image: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
        about: "Hey there! I am using WhatsApp",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    }

    const data = userDoc.data();
    return {
      name: data.name || phoneNumber,
      image: data.image || "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
      about: data.about || "Hey there! I am using WhatsApp"
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(phoneNumber: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', phoneNumber);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create profile if it doesn't exist
      await setDoc(userRef, {
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, {
        ...profile,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Upload profile image
export async function uploadProfileImage(phoneNumber: string, file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profiles/${phoneNumber}_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update profile with new image URL
    const userRef = doc(db, 'users', phoneNumber);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create profile if it doesn't exist
      await setDoc(userRef, {
        image: downloadURL,
        name: phoneNumber,
        about: "Hey there! I am using WhatsApp",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, {
        image: downloadURL,
        updatedAt: new Date()
      });
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
}