import { NextResponse } from "next/server"
import { connectToDatabase, type AudioFile } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const audioFiles = await db.collection("audioFiles").find({}).toArray()

    return NextResponse.json(audioFiles)
  } catch (error) {
    console.error("Error fetching audio files:", error)
    return NextResponse.json({ error: "Failed to fetch audio files" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const language = formData.get("language") as string
    const dialect = formData.get("dialect") as string
    const phraseSaid = formData.get("phraseSaid") as string
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // In a real implementation, you would upload the file to Firebase Storage here
    // and get the download URL
    const fileUrl = "https://example.com/audio.mp3" // Placeholder

    const { db } = await connectToDatabase()

    // Create new audio file object
    const audioFile: AudioFile = {
      id: uuidv4(),
      title,
      language,
      dialect,
      phraseSaid,
      fileName: file.name,
      fileUrl,
      duration: "0.0s", // This would be calculated from the actual file
      uploadDate: new Date().toISOString().split("T")[0],
    }

    // Insert into database
    await db.collection("audioFiles").insertOne(audioFile)

    return NextResponse.json(audioFile, { status: 201 })
  } catch (error) {
    console.error("Error uploading audio file:", error)
    return NextResponse.json({ error: "Failed to upload audio file" }, { status: 500 })
  }
}

