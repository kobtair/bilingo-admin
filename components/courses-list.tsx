"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { BookPlus, ChevronRight, Edit, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { coursesAPI } from "@/lib/api"

interface Course {
  id: string
  title: string
  description: string
  language: string
  dialect: string
  chaptersCount: number
  status: "Published" | "Draft" | "Archived"
  chapters: any[]
}

export function CoursesList() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    language: "",
    dialect: "",
  })

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const data = await coursesAPI.getAll()
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleAddCourse = async () => {
    try {
      const data = await coursesAPI.create(newCourse)
      setCourses([...courses, data])
      setNewCourse({
        title: "",
        description: "",
        language: "",
        dialect: "",
      })
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Course created successfully",
      })
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditCourse = async () => {
    if (!selectedCourse) return
    try {
      const updatedCourse = await coursesAPI.update(selectedCourse.id, selectedCourse)
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course
        )
      )
      setIsEditDialogOpen(false)
      setSelectedCourse(null)

      toast({
        title: "Success",
        description: "Course updated successfully",
      })
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      await coursesAPI.delete(id)
      setCourses(courses.filter((course) => course.id !== id))

      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Manage language courses and their content.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 dark:from-blue-600 dark:to-cyan-400 dark:hover:from-blue-700 dark:hover:to-cyan-500">
              <BookPlus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Create a new language course with chapters.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={newCourse.language}
                  onChange={(e) => setNewCourse({ ...newCourse, language: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialect">Dialect</Label>
                <Input
                  id="dialect"
                  value={newCourse.dialect}
                  onChange={(e) => setNewCourse({ ...newCourse, dialect: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCourse}>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Chapters</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No courses found. Create your first course.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/courses/${course.id}`} className="hover:text-blue-700 flex items-center">
                        {course.title}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                      <div className="text-xs text-muted-foreground">{course.description}</div>
                    </TableCell>
                    <TableCell>
                      {course.language}
                      <div className="text-xs text-muted-foreground">{course.dialect}</div>
                    </TableCell>
                    <TableCell>{course.chapters.length}</TableCell>
                    {/* <TableCell>
                      <Badge
                        className={
                          course.status === "Published"
                            ? "bg-green-600"
                            : course.status === "Draft"
                              ? "bg-amber-500"
                              : "bg-gray-500"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell> */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setSelectedCourse(course)
                          setIsEditDialogOpen(true)
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the course "{course.title}" and all its chapters.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course.id)}
                                className="bg-red-500 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update the details of the course.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={selectedCourse?.title || ""}
                onChange={(e) =>
                  setSelectedCourse((prev) => prev && { ...prev, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={selectedCourse?.description || ""}
                onChange={(e) =>
                  setSelectedCourse((prev) => prev && { ...prev, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-language">Language</Label>
              <Input
                id="edit-language"
                value={selectedCourse?.language || ""}
                onChange={(e) =>
                  setSelectedCourse((prev) => prev && { ...prev, language: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dialect">Dialect</Label>
              <Input
                id="edit-dialect"
                value={selectedCourse?.dialect || ""}
                onChange={(e) =>
                  setSelectedCourse((prev) => prev && { ...prev, dialect: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditCourse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

