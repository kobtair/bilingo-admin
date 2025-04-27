import { NextResponse } from "next/server"
import { connectToDatabase, type Chapter } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const chapters = await db.collection("chapters").find({ courseId: params.id }).sort({ order: 1 }).toArray()

    return NextResponse.json(chapters)
  } catch (error) {
    console.error("Error fetching chapters:", error)
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Check if course exists
    const course = await db.collection("courses").findOne({ id: params.id })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get the count of existing chapters for this course
    const chaptersCount = await db.collection("chapters").countDocuments({ courseId: params.id })

    // Create new chapter object
    const chapter: Chapter = {
      id: uuidv4(),
      courseId: params.id,
      name: data.name,
      description: data.description,
      content: data.content,
      audioFile: data.audioFile || null,
      order: chaptersCount + 1,
      status: "Pending",
    }

    // Insert into database
    await db.collection("chapters").insertOne(chapter)

    // Update the chapters count in the course
    await db.collection("courses").updateOne({ id: params.id }, { $set: { chaptersCount: chaptersCount + 1 } })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error("Error creating chapter:", error)
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 })
  }
}

