import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// Initialize Firebase app
let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Get storage instance
const storage = app ? getStorage(app) : null

/**
 * Upload a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage to upload to
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized")
  }

  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}

/**
 * Delete a file from Firebase Storage
 * @param path The path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized")
  }

  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

/**
 * Get the download URL for a file in Firebase Storage
 * @param path The path of the file
 * @returns The download URL
 */
export async function getFileUrl(path: string): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized")
  }

  const storageRef = ref(storage, path)
  return await getDownloadURL(storageRef)
}

