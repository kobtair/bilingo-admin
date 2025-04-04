"use client"

import { useState } from "react"
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
import { FileAudio, FilePlus, Edit, Trash2 } from "lucide-react"
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

type Chapter = {
  id: string
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
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "1",
      name: "Introduction to Spanish",
      description: "Basic greetings and introductions",
      content: "In this chapter, we'll learn how to introduce ourselves...",
      audioFile: "intro_spanish.mp3",
      order: 1,
      status: "Complete",
    },
    {
      id: "2",
      name: "Numbers and Counting",
      description: "Learn to count from 1 to 100",
      content: "Let's start with the basics of counting in Spanish...",
      audioFile: "spanish_numbers.mp3",
      order: 2,
      status: "Complete",
    },
    {
      id: "3",
      name: "Common Phrases",
      description: "Everyday expressions and phrases",
      content: "These common phrases will help you navigate daily situations...",
      audioFile: "common_phrases.mp3",
      order: 3,
      status: "In Progress",
    },
    {
      id: "4",
      name: "Food and Dining",
      description: "Vocabulary for restaurants and food",
      content: "Learn how to order food and discuss dining preferences...",
      audioFile: null,
      order: 4,
      status: "Pending",
    },
  ])

  const [newChapter, setNewChapter] = useState({
    name: "",
    description: "",
    content: "",
    audioFile: null,
  })

  const handleAddChapter = () => {
    const chapter: Chapter = {
      id: Math.random().toString(36).substring(7),
      name: newChapter.name,
      description: newChapter.description,
      content: newChapter.content,
      audioFile: null,
      order: chapters.length + 1,
      status: "Pending",
    }

    setChapters([...chapters, chapter])
    setNewChapter({
      name: "",
      description: "",
      content: "",
      audioFile: null,
    })
  }

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter((chapter) => chapter.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Chapters</CardTitle>
          <CardDescription>Manage chapters for this course.</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600">
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
                <Input id="audio" type="file" accept="audio/*" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddChapter}>Create Chapter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
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
            {chapters.map((chapter) => (
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
                      <span className="text-sm">{chapter.audioFile}</span>
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
                    <Button variant="ghost" size="icon">
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

