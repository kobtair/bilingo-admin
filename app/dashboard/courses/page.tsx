import { CoursesList } from "@/components/courses-list"
import { DashboardHeader } from "@/components/dashboard-header"

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Course Management" text="Create and manage language courses." />
      <CoursesList />
    </div>
  )
}

