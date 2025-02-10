import { db, storage } from "../firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { AdminProfile } from "@/types/interfaces"

export async function fetchAdminProfile(): Promise<AdminProfile | null> {
  console.log("fetchAdminProfile called")
  const adminRef = doc(db, "adminProfile", "main")
  const adminDoc = await getDoc(adminRef)
  try {
    if (adminDoc.exists()) {
      console.log("fetchAdminProfile successful:", adminDoc.data())
      return adminDoc.data() as AdminProfile
    }
    console.log("fetchAdminProfile: Admin profile not found")
    return null
  } catch (error) {
    console.error("Error in fetchAdminProfile:", error)
    throw error
  }
}

export async function updateAdminProfile(profile: Partial<AdminProfile>): Promise<void> {
  console.log("updateAdminProfile called with:", profile)
  const adminRef = doc(db, "adminProfile", "main")
  try {
    const adminDoc = await getDoc(adminRef)
    if (adminDoc.exists()) {
      await updateDoc(adminRef, { ...profile, updatedAt: serverTimestamp() })
    } else {
      await setDoc(adminRef, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    }
    console.log("updateAdminProfile successful")
  } catch (error) {
    console.error("Error in updateAdminProfile:", error)
    throw error
  }
}

export async function uploadProfilePicture(file: File, onProgress?: (progress: number) => void): Promise<string> {
  console.log("uploadProfilePicture called")
  const storageRef = ref(storage, `adminProfile/${Date.now()}_${file.name}`)
  try {
    const uploadTask = uploadBytes(storageRef, file)

    if (onProgress) {
      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress(progress)
      })
    }

    await uploadTask
    const downloadURL = await getDownloadURL(storageRef)
    console.log("uploadProfilePicture successful, URL:", downloadURL)
    return downloadURL
  } catch (error) {
    console.error("Error in uploadProfilePicture:", error)
    throw error
  }
}

