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
import { FilePlus, Edit, Trash2, Loader2, MoveUp, MoveDown, Eye } from "lucide-react"
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
import { chaptersAPI, audioFilesAPI } from "@/lib/api"
import ReactMde from "react-mde"
import ReactMarkdown from "react-markdown"
import "react-mde/lib/styles/css/react-mde-all.css"

interface Chapter {
  _id: string
  id: string
  courseId: string
  title: string
  description: string
  content: string
  audioFile: string | null
  audio_id: string | null
  order: number
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

  const [newChapter, setNewChapter] = useState({
    title: "",
    description: "",
    content: "",
    audioId: "",
  })
  const [audioFiles, setAudioFiles] = useState<{ _id: string; url: string; title?: string }[]>([])
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")

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

  const fetchAudioFiles = async () => {
    try {
      const data = await audioFilesAPI.getAll()
      setAudioFiles(data)
    } catch (error) {
      console.error("Error fetching audio files:", error)
    }
  }

  useEffect(() => {
    fetchChapters()
    fetchAudioFiles()
  }, [courseId])

  const handleAddChapter = async () => {
    try {
      setIsUploading(true)

      // Create chapter data
      const chapterData = {
        ...newChapter,
        audio_id: newChapter.audioId || null,
        order: chapters.length + 1,
      }

      // Send to API
      const data = await chaptersAPI.create(courseId, chapterData)

      // Update local state
      setChapters([...chapters, data])

      // Reset form
      setNewChapter({
        title: "",
        description: "",
        content: "",
        audioId: "",
      })
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
      // Sort chapters by order
      const sortedChapters = [...chapters].sort((a, b) => a.order - b.order)
      const chapterIndex = sortedChapters.findIndex((chapter) => chapter._id === id)
      if (chapterIndex === -1) return

      // Check if we can move in the requested direction
      if (direction === "up" && chapterIndex === 0) return
      if (direction === "down" && chapterIndex === sortedChapters.length - 1) return

      // Create a copy of the sorted chapters array
      const newChapters = [...sortedChapters]

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
      const chapterIds = newChapters.map((chapter) => chapter._id)
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
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
              <DialogDescription>Create a new chapter with content and audio.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Chapter Name</Label>
                <Input
                  id="name"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
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
              <div className="prose grid gap-2">
                <Label htmlFor="content">Content</Label>
                <ReactMde
                  value={newChapter.content}
                  onChange={(value) => setNewChapter({ ...newChapter, content: value })}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(markdown) =>
                    Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audioUrl">Select Audio (Optional)</Label>
                <select
                  id="audioUrl"
                  value={newChapter.audioId}
                  onChange={(e) => setNewChapter({ ...newChapter, audioId: e.target.value })}
                  className="border rounded p-2"
                >
                  <option value="">None</option>
                  {audioFiles.map((audio) => (
                    <option key={audio._id} value={audio._id}>
                      {audio.title || audio.url}
                    </option>
                  ))}
                </select>
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
                      {chapter.title}
                      <div className="text-xs text-muted-foreground">{chapter.description}</div>
                    </TableCell>
                    <TableCell>
                      {chapter.audio_id ? (
                        <div className="flex items-center">
                          <span className="text-sm">Audio available</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No audio</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:text-blue-500">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="overflow-y-auto max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Chapter Details</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div><strong>Title:</strong> {chapter.title}</div>
                              <div className="mt-2"><strong>Description:</strong> {chapter.description}</div>
                              <div className="prose mt-2">
                                <strong>Content:</strong>
                                <ReactMarkdown>{chapter.content}</ReactMarkdown>
                              </div>
                              <div className="mt-2"><strong>Audio:</strong> {chapter.audio_id ? "Audio available" : "No audio"}</div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorderChapter(chapter._id, "up")}
                          disabled={chapter.order === 1}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorderChapter(chapter._id, "down")}
                          disabled={chapter.order === chapters.length}
                        >
                          <MoveDown className="h-4 w-4" />
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
                                This will permanently delete the chapter "{chapter.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteChapter(chapter._id)}
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

