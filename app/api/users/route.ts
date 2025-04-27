import { NextResponse } from "next/server"
import { connectToDatabase, type User } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection("users").find({}).toArray()

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Create new user object
    const user: User = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      profileImage: data.profileImage || null,
      language: data.language,
      level: data.level || "Beginner",
      progress: data.progress || 0,
      lastActive: new Date().toISOString().split("T")[0],
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
    }

    // Insert into database
    await db.collection("users").insertOne(user)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

