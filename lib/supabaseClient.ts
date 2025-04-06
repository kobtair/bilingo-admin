import { createClient } from '@supabase/supabase-js'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicApiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!projectUrl || !publicApiKey) {
  throw new Error('Supabase URL and API key must be provided')
}

// Create Supabase client
export const supabase = createClient(projectUrl, publicApiKey)

// Upload file using standard upload
async function uploadFile(file: File) {
  const { data, error } = await supabase.storage.from('audios').upload('file_path', file)
  if (error) {
    console.error('Error uploading file:', error)
  } else {
    console.log('File uploaded successfully:', data)
  }
}