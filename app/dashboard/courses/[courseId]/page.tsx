"use client"

import { useParams } from "next/navigation"
import { ChaptersList } from "@/components/chapters-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.courseId as string

  // In a real app, you would fetch the course details based on the courseId
  const course = {
    id: courseId,
    title: "Spanish for Beginners",
    description: "Learn basic Spanish phrases and vocabulary",
    language: "Spanish",
    dialect: "Latin American",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
      </div>
      <DashboardHeader heading={course.title} text={`${course.language} (${course.dialect}) - ${course.description}`} />
      <ChaptersList courseId={courseId} />
    </div>
  )
}

