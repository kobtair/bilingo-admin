import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ id: params.id })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Check if user exists
    const user = await db.collection("users").findOne({ id: params.id })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user
    const updatedUser = {
      ...data,
      lastActive: new Date().toISOString().split("T")[0],
    }

    await db.collection("users").updateOne({ id: params.id }, { $set: updatedUser })

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Check if user exists
    const user = await db.collection("users").findOne({ id: params.id })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user
    await db.collection("users").deleteOne({ id: params.id })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

