import { NextResponse } from "next/server"
import { connectToDatabase, type Course } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const courses = await db.collection("courses").find({}).toArray()

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Create new course object
    const course: Course = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      language: data.language,
      dialect: data.dialect,
      chaptersCount: 0,
      status: "Draft",
    }

    // Insert into database
    await db.collection("courses").insertOne(course)

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}

