import { doc, getDoc, updateDoc, setDoc, collection, query, orderBy, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { UserProfile, Status } from '../types';

// Get admin profile
export async function getAdminProfile(): Promise<UserProfile> {
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
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(profileRef, defaultProfile);
      return { ...defaultProfile, statuses: [] };
    }

    const data = profileDoc.data();
    
    // Get statuses
    const statusesRef = collection(db, 'admin/profile/statuses');
    const statusesQuery = query(statusesRef, orderBy('timestamp', 'desc'));
    const statusesSnapshot = await getDocs(statusesQuery);
    
    const statuses: Status[] = statusesSnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      imageUrl: doc.data().imageUrl,
      timestamp: doc.data().timestamp,
      caption: doc.data().caption
    }));

    console.log('✅ Profile retrieved successfully:', { ...data, statuses });
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
    console.log('🔵 Starting admin profile update in Firebase with:', updates);
    const profileRef = doc(db, 'admin/profile');
    const profileDoc = await getDoc(profileRef);
    
    const updateData: Record<string, any> = {
      ...updates,
      updatedAt: new Date()
    };

    if (!profileDoc.exists()) {
      console.log('🔵 Creating new profile with updates');
      await setDoc(profileRef, {
        name: updates.name || "WhatsApp Support",
        image: updates.image || "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
        about: updates.about || "Official WhatsApp Support",
        createdAt: new Date(),
        ...updateData
      });
    } else {
      console.log('🔵 Updating existing profile');
      await updateDoc(profileRef, updateData);
    }
    
    console.log('✅ Admin profile updated successfully in Firebase');
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
    
    console.log('✅ Profile image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading admin profile image:', error);
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
      fileName, // Guardamos el nombre del archivo para poder eliminarlo después
      createdAt: new Date()
    };
    
    console.log('🔵 Creating status document with data:', statusData);
    const docRef = await addDoc(statusesRef, statusData);
    
    console.log('✅ Status uploaded successfully:', { id: docRef.id, ...statusData });
    return {
      id: parseInt(docRef.id),
      imageUrl,
      timestamp: statusData.timestamp,
      caption
    };
  } catch (error) {
    console.error('❌ Error uploading admin status:', error);
    throw error;
  }
}

// Delete admin status
export async function deleteAdminStatus(statusId: number): Promise<void> {
  try {
    console.log('🔵 Starting admin status deletion for ID:', statusId);
    
    // Obtener el documento del estado para obtener el nombre del archivo
    const statusRef = doc(db, 'admin/profile/statuses', statusId.toString());
    console.log('🔵 Getting status document');
    const statusDoc = await getDoc(statusRef);
    
    if (statusDoc.exists()) {
      const { fileName, imageUrl } = statusDoc.data();
      console.log('🔵 Status document found:', { fileName, imageUrl });
      
      // Eliminar la imagen del storage si existe fileName
      if (fileName) {
        console.log('🔵 Deleting image from storage:', fileName);
        const storageRef = ref(storage, fileName);
        try {
          await deleteObject(storageRef);
          console.log('✅ Image deleted from storage successfully');
        } catch (storageError) {
          console.error('❌ Error deleting image from storage:', storageError);
          // Continuamos con la eliminación del documento aunque falle la eliminación de la imagen
        }
      }
      
      // Eliminar el documento del estado
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