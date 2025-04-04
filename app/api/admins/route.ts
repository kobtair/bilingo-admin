import { NextResponse } from "next/server"
import { connectToDatabase, type Admin } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const admins = await db.collection("admins").find({}).toArray()

    return NextResponse.json(admins)
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Create new admin object
    const admin: Admin = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password: data.password, // In a real app, you would hash this password
      role: data.role,
      createdAt: new Date().toISOString().split("T")[0],
    }

    // Insert into database
    await db.collection("admins").insertOne(admin)

    // Remove password from response
    const { password, ...adminWithoutPassword } = admin

    return NextResponse.json(adminWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}

