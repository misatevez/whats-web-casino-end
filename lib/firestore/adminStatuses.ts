import { db, storage } from "../firebase"
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import type { AdminStatus } from "@/types/interfaces"

export async function fetchAdminStatuses(): Promise<AdminStatus[]> {
  console.log("fetchAdminStatuses called")
  const statusesRef = collection(db, "adminStatuses")
  try {
    const querySnapshot = await getDocs(statusesRef)
    const statuses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AdminStatus[]
    console.log("fetchAdminStatuses successful:", statuses)
    return statuses
  } catch (error) {
    console.error("Error in fetchAdminStatuses:", error)
    throw error
  }
}

export async function addAdminStatus(status: Omit<AdminStatus, "id">): Promise<string> {
  console.log("addAdminStatus called with:", status)
  const statusesRef = collection(db, "adminStatuses")
  try {
    const docRef = await addDoc(statusesRef, {
      ...status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log("addAdminStatus successful, new ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error in addAdminStatus:", error)
    throw error
  }
}

export async function updateAdminStatus(statusId: string, updates: Partial<AdminStatus>): Promise<void> {
  console.log("updateAdminStatus called with:", { statusId, updates })
  const statusRef = doc(db, "adminStatuses", statusId)
  try {
    await updateDoc(statusRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    console.log("updateAdminStatus successful")
  } catch (error) {
    console.error("Error in updateAdminStatus:", error)
    throw error
  }
}

export async function deleteAdminStatus(statusId: string): Promise<void> {
  console.log("deleteAdminStatus called with:", statusId)
  const statusRef = doc(db, "adminStatuses", statusId)
  try {
    await deleteDoc(statusRef)
    console.log("deleteAdminStatus successful")
  } catch (error) {
    console.error("Error in deleteAdminStatus:", error)
    throw error
  }
}

export async function uploadStatusImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
  console.log("uploadStatusImage called")
  const storageRef = ref(storage, `adminStatuses/${Date.now()}_${file.name}`)
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
    console.log("uploadStatusImage successful, URL:", downloadURL)
    return downloadURL
  } catch (error) {
    console.error("Error in uploadStatusImage:", error)
    throw error
  }
}

export async function deleteStatusImage(imageUrl: string): Promise<void> {
  console.log("deleteStatusImage called with:", imageUrl)
  const imageRef = ref(storage, imageUrl)
  try {
    await deleteObject(imageRef)
    console.log("deleteStatusImage successful")
  } catch (error) {
    console.error("Error in deleteStatusImage:", error)
    throw error
  }
}

