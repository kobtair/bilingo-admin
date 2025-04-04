"use client";

import { useParams } from "next/navigation";
import { ChaptersList } from "@/components/chapters-list";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string;
  language: string;
  dialect: string;
};

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course details");
      }
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    if (!courseId) {
      console.error("Course ID is missing");
      return;
    }
    fetchCourseDetails(courseId);
  }, [courseId]);

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
      {course && (
        <DashboardHeader
          heading={course.title}
          text={`${course.language} (${course.dialect}) - ${course.description}`}
        />
      )}
      <ChaptersList courseId={courseId} />
    </div>
  );
}
