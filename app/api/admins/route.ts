import { NextResponse } from "next/server"
import { connectToDatabase, type Admin } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt" 

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
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const admin: Admin = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password: hashedPassword, 
      role: data.role,
      createdAt: new Date().toISOString().split("T")[0],
    }

    await db.collection("admins").insertOne(admin)

    const { password, ...adminWithoutPassword } = admin

    return NextResponse.json(adminWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}

