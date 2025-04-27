import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const course = await db.collection("courses").findOne({ id: params.id })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Check if course exists
    const course = await db.collection("courses").findOne({ id: params.id })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Delete course
    await db.collection("courses").deleteOne({ id: params.id })

    // Also delete all chapters associated with this course
    await db.collection("chapters").deleteMany({ courseId: params.id })

    return NextResponse.json({ message: "Course and its chapters deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Check if course exists
    const course = await db.collection("courses").findOne({ id: params.id })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Update course
    const updatedCourse = {
      ...course,
      ...body, // Merge existing course data with the new data
    }
    await db.collection("courses").updateOne({ id: params.id }, { $set: updatedCourse })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

