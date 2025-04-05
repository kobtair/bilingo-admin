"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { FileAudio, FilePlus, Edit, Trash2, Loader2, MoveUp, MoveDown } from "lucide-react"
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
import { chaptersAPI } from "@/lib/api"
import { uploadFile } from "@/lib/cloudflare"

interface Chapter {
  id: string
  courseId: string
  name: string
  description: string
  content: string
  audioFile: string | null
  order: number
  status: "Complete" | "In Progress" | "Pending"
}

interface ChaptersListProps {
  courseId: string
}

export function ChaptersList({ courseId }: ChaptersListProps) {
  const { toast } = useToast()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const [newChapter, setNewChapter] = useState({
    name: "",
    description: "",
    content: "",
  })

  const fetchChapters = async () => {
    try {
      setIsLoading(true)
      const data = await chaptersAPI.getAllByCourse(courseId)
      setChapters(data)
    } catch (error) {
      console.error("Error fetching chapters:", error)
      toast({
        title: "Error",
        description: "Failed to load chapters. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChapters()
  }, [courseId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  const handleAddChapter = async () => {
    try {
      setIsUploading(true)

      // Upload audio file if provided
      let audioFileUrl = null
      if (audioFile) {
        const filePath = `courses/${courseId}/chapters/${Date.now()}_${audioFile.name}`
        audioFileUrl = await uploadFile(audioFile, filePath)
      }

      // Create chapter data
      const chapterData = {
        ...newChapter,
        audioFile: audioFileUrl,
      }

      // Send to API
      const data = await chaptersAPI.create(courseId, chapterData)

      // Update local state
      setChapters([...chapters, data])

      // Reset form
      setNewChapter({
        name: "",
        description: "",
        content: "",
      })
      setAudioFile(null)
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Chapter created successfully",
      })
    } catch (error) {
      console.error("Error creating chapter:", error)
      toast({
        title: "Error",
        description: "Failed to create chapter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteChapter = async (id: string) => {
    try {
      await chaptersAPI.delete(id)
      setChapters(chapters.filter((chapter) => chapter.id !== id))

      toast({
        title: "Success",
        description: "Chapter deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting chapter:", error)
      toast({
        title: "Error",
        description: "Failed to delete chapter. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReorderChapter = async (id: string, direction: "up" | "down") => {
    try {
      // Find the chapter to move
      const chapterIndex = chapters.findIndex((chapter) => chapter.id === id)
      if (chapterIndex === -1) return

      // Check if we can move in the requested direction
      if (direction === "up" && chapterIndex === 0) return
      if (direction === "down" && chapterIndex === chapters.length - 1) return

      // Create a copy of the chapters array
      const newChapters = [...chapters]

      // Swap the chapters
      const targetIndex = direction === "up" ? chapterIndex - 1 : chapterIndex + 1
      const temp = newChapters[targetIndex]
      newChapters[targetIndex] = newChapters[chapterIndex]
      newChapters[chapterIndex] = temp

      // Update the order property
      newChapters.forEach((chapter, index) => {
        chapter.order = index + 1
      })

      // Update the UI immediately
      setChapters(newChapters)

      // Send the new order to the API
      const chapterIds = newChapters.map((chapter) => chapter.id)
      await chaptersAPI.reorder(courseId, chapterIds)

      toast({
        title: "Success",
        description: "Chapter order updated",
      })
    } catch (error) {
      console.error("Error reordering chapters:", error)
      toast({
        title: "Error",
        description: "Failed to reorder chapters. Please try again.",
        variant: "destructive",
      })
      // Revert to original order by refetching
      fetchChapters()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Chapters</CardTitle>
          <CardDescription>Manage chapters for this course.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 dark:from-blue-600 dark:to-cyan-400 dark:hover:from-blue-700 dark:hover:to-cyan-500">
              <FilePlus className="mr-2 h-4 w-4" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
              <DialogDescription>Create a new chapter with content and audio.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Chapter Name</Label>
                <Input
                  id="name"
                  value={newChapter.name}
                  onChange={(e) => setNewChapter({ ...newChapter, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newChapter.description}
                  onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={8}
                  value={newChapter.content}
                  onChange={(e) => setNewChapter({ ...newChapter, content: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audio">Audio File (Optional)</Label>
                <Input id="audio" type="file" accept="audio/*" onChange={handleFileChange} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddChapter} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Create Chapter"
                )}
              </Button>
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
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No chapters found. Create your first chapter.
                  </TableCell>
                </TableRow>
              ) : (
                chapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell>{chapter.order}</TableCell>
                    <TableCell className="font-medium">
                      {chapter.name}
                      <div className="text-xs text-muted-foreground">{chapter.description}</div>
                    </TableCell>
                    <TableCell>
                      {chapter.audioFile ? (
                        <div className="flex items-center">
                          <FileAudio className="mr-2 h-4 w-4 text-blue-600" />
                          <span className="text-sm">Audio available</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No audio</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          chapter.status === "Complete"
                            ? "bg-green-600"
                            : chapter.status === "In Progress"
                              ? "bg-amber-500"
                              : "bg-gray-500"
                        }
                      >
                        {chapter.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorderChapter(chapter.id, "up")}
                          disabled={chapter.order === 1}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorderChapter(chapter.id, "down")}
                          disabled={chapter.order === chapters.length}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/dashboard/courses/${courseId}/chapters/${chapter.id}`}>
                            <Edit className="h-4 w-4" />
                          </a>
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
                                This will permanently delete the chapter "{chapter.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteChapter(chapter.id)}
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
    </Card>
  )
}

