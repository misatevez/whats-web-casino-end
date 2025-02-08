import { doc, getDoc, updateDoc, setDoc, collection, query, orderBy, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { UserProfile, Status } from '../types';

// Get admin profile
export async function getAdminProfile(): Promise<UserProfile> {
  try {
    console.log('🔵 Getting admin profile from Firebase');
    const profileRef = doc(db, 'admin/profile');
    console.log('Lo que obtenemos: ', profileRef);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      console.log('🔵 No profile found, creating default profile');
      const defaultProfile = {
        name: "WhatsApp Support",
        image: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
        about: "Official WhatsApp Support",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(profileRef, defaultProfile);
      return { ...defaultProfile, statuses: [] };
    }

    const data = profileDoc.data();
    
    // Get statuses with document IDs
    console.log('🔵 Getting statuses from admin/profile/statuses');
    const statusesRef = collection(db, 'admin/profile/statuses');
    const statusesQuery = query(statusesRef, orderBy('createdAt', 'desc'));
    const statusesSnapshot = await getDocs(statusesQuery);
    
    console.log('🔵 Raw statuses data:', statusesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    const statuses: Status[] = statusesSnapshot.docs.map(doc => ({
      id: doc.id,
      imageUrl: doc.data().imageUrl,
      timestamp: doc.data().timestamp,
      caption: doc.data().caption,
      createdAt: doc.data().createdAt,
      fileName: doc.data().fileName
    }));

    console.log('✅ Profile retrieved successfully with statuses:', { ...data, statuses });
    return {
      name: data.name || "WhatsApp Support",
      image: data.image || "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
      about: data.about || "Official WhatsApp Support",
      statuses
    };
  } catch (error) {
    console.error('❌ Error getting admin profile:', error);
    throw error;
  }
}

// Update admin profile
export async function updateAdminProfile(updates: Partial<UserProfile>): Promise<void> {
  try {
    console.log('🔵 Updating admin profile:', updates);
    const profileRef = doc(db, 'admin/profile');
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: new Date()
    });
    console.log('✅ Admin profile updated successfully');
  } catch (error) {
    console.error('❌ Error updating admin profile:', error);
    throw error;
  }
}

// Upload admin profile image
export async function uploadAdminProfileImage(file: File): Promise<string> {
  try {
    console.log('🔵 Starting admin profile image upload');
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `admin/profile_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update profile with new image URL
    await updateAdminProfile({ image: downloadURL });
    
    console.log('✅ Profile image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading profile image:', error);
    throw error;
  }
}

// Upload admin status
export async function uploadAdminStatus(file: File, caption?: string): Promise<Status> {
  try {
    console.log('🔵 Starting admin status upload');
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `admin/status_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    console.log('🔵 Uploading file to storage:', fileName);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    console.log('✅ File uploaded successfully, URL:', imageUrl);
    
    const statusesRef = collection(db, 'admin/profile/statuses');
    const statusData = {
      imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      caption,
      fileName,
      createdAt: new Date().toISOString()
    };
    
    console.log('🔵 Creating status document with data:', statusData);
    const docRef = await addDoc(statusesRef, statusData);
    
    console.log('✅ Status uploaded successfully:', { id: docRef.id, ...statusData });
    return {
      id: docRef.id,
      ...statusData
    };
  } catch (error) {
    console.error('❌ Error uploading admin status:', error);
    throw error;
  }
}

// Delete admin status
export async function deleteAdminStatus(statusId: string): Promise<void> {
  try {
    console.log('🔵 Starting admin status deletion for ID:', statusId);
    
    // Get the status document to get the file name
    const statusRef = doc(db, 'admin/profile/statuses', statusId);
    console.log('🔵 Getting status document');
    const statusDoc = await getDoc(statusRef);
    
    if (statusDoc.exists()) {
      const { fileName, imageUrl } = statusDoc.data();
      console.log('🔵 Status document found:', { fileName, imageUrl });
      
      // Delete the image from storage if fileName exists
      if (fileName) {
        console.log('🔵 Deleting image from storage:', fileName);
        const storageRef = ref(storage, fileName);
        try {
          await deleteObject(storageRef);
          console.log('✅ Image deleted from storage successfully');
        } catch (storageError) {
          console.error('❌ Error deleting image from storage:', storageError);
          // Continue with document deletion even if image deletion fails
        }
      }
      
      // Delete the status document
      console.log('🔵 Deleting status document');
      await deleteDoc(statusRef);
      console.log('✅ Status document deleted successfully');
    } else {
      console.log('❌ Status document not found');
      throw new Error('Status not found');
    }
  } catch (error) {
    console.error('❌ Error deleting admin status:', error);
    throw error;
  }
}