import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
}

export function validateFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 100MB limit';
  }

  // Check file type
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type);

  if (!isImage && !isDocument) {
    return 'Invalid file type. Only images and documents are allowed';
  }

  return null;
}

export function uploadFile(
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      onProgress({ progress: 0, error: validationError });
      reject(new Error(validationError));
      return;
    }

    // Create storage reference
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `uploads/${fileName}`);

    // Start upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress({ progress });
      },
      (error) => {
        onProgress({ progress: 0, error: error.message });
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onProgress({ progress: 100, downloadURL });
          resolve(downloadURL);
        } catch (error: any) {
          onProgress({ progress: 0, error: error.message });
          reject(error);
        }
      }
    );
  });
}