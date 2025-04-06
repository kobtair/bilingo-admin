import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase()
        const data = await request.json()
    
        const admin = await db.collection("admins").findOne({ email: data.email })
    
        if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 })
        }
    
        const isPasswordValid = await bcrypt.compare(data.password, admin.password)
    
        if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 })
        }
    
        const { password, ...adminWithoutPassword } = admin
    
        return NextResponse.json(adminWithoutPassword)
    } catch (error) {
        console.error("Error logging in admin:", error)
        return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
    }
    }