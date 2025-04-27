import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // If no connection, create a new one
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  const db = client.db(process.env.MONGODB_DB || "bilingo")

  // Cache the connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}

// Define MongoDB collections and their types
export interface Admin {
  id?: string
  name: string
  email: string
  password?: string
  role: "Super Admin" | "Admin" | "Junior Admin"
  createdAt: string
}

export interface User {
  id?: string
  name: string
  email: string
  profileImage?: string
  language: string
  level: "Beginner" | "Intermediate" | "Advanced"
  progress: number
  lastActive: string
  joinDate: string
  status: "Active" | "Inactive" | "Suspended"
}

export interface Course {
  id?: string
  title: string
  description: string
  language: string
  dialect: string
  chaptersCount: number
  status: "Published" | "Draft" | "Archived"
}

export interface Chapter {
  id?: string
  courseId: string
  name: string
  description: string
  content: string
  audioFile: string | null
  order: number
  status: "Complete" | "In Progress" | "Pending"
}

export interface AudioFile {
  id?: string
  title: string
  language: string
  dialect: string
  phraseSaid: string
  fileName: string
  fileUrl: string
  duration: string
  uploadDate: string
}

