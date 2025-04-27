"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ChaptersList } from "@/components/chapters-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader } from "lucide-react"
import Link from "next/link"
import { coursesAPI } from "@/lib/api"

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    if (courseId) {
      coursesAPI.getById(courseId)
        .then(data => setCourse(data))
        .catch(err => console.error(err))
    }
  }, [courseId])

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
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

