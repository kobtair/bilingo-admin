import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const admin = await db.collection("admins").findOne({ id: params.id })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...adminWithoutPassword } = admin

    return NextResponse.json(adminWithoutPassword)
  } catch (error) {
    console.error("Error fetching admin:", error)
    return NextResponse.json({ error: "Failed to fetch admin" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Check if admin exists
    const admin = await db.collection("admins").findOne({ id: params.id })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Don't allow deletion of Super Admins
    if (admin.role === "Super Admin") {
      return NextResponse.json({ error: "Cannot delete Super Admin" }, { status: 403 })
    }

    // Delete admin
    await db.collection("admins").deleteOne({ id: params.id })

    return NextResponse.json({ message: "Admin deleted successfully" })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 })
  }
}

