/**
 * Utility functions for interacting with Cloudflare R2 Storage
 */

/**
 * Upload a file to Cloudflare R2 Storage
 * @param file The file to upload
 * @param path The path in storage to upload to
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    // Create form data for the file upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("path", path)

    // Send the file to our backend API which will handle the Cloudflare upload
    const response = await fetch("http://localhost:5000/api/storage/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to upload file")
    }

    const data = await response.json()
    return data.url // Return the public URL of the uploaded file
  } catch (error) {
    console.error("Error uploading file to Cloudflare:", error)
    throw error
  }
}

/**
 * Delete a file from Cloudflare R2 Storage
 * @param path The path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:5000/api/storage/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete file")
    }
  } catch (error) {
    console.error("Error deleting file from Cloudflare:", error)
    throw error
  }
}

/**
 * Get the download URL for a file in Cloudflare R2 Storage
 * @param path The path of the file
 * @returns The download URL
 */
export async function getFileUrl(path: string): Promise<string> {
  try {
    const response = await fetch(`http://localhost:5000/api/storage/url?path=${encodeURIComponent(path)}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get file URL")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error getting file URL from Cloudflare:", error)
    throw error
  }
}

