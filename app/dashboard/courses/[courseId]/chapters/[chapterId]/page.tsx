"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, FileAudio } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { chaptersAPI } from "@/lib/api"
import { uploadFile } from "@/lib/cloudflare"

export default function ChapterDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const courseId = params.courseId as string
  const chapterId = params.chapterId as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const [chapter, setChapter] = useState({
    id: "",
    courseId: "",
    name: "",
    description: "",
    content: "",
    audioFile: null as string | null,
    order: 0,
    status: "Pending" as "Complete" | "In Progress" | "Pending",
  })

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true)
        const data = await chaptersAPI.getById(chapterId)
        setChapter(data)
      } catch (error) {
        console.error("Error fetching chapter:", error)
        toast({
          title: "Error",
          description: "Failed to load chapter details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChapter()
  }, [chapterId, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Upload new audio file if provided
      let audioFileUrl = chapter.audioFile
      if (audioFile) {
        const filePath = `courses/${courseId}/chapters/${chapterId}/${Date.now()}_${audioFile.name}`
        audioFileUrl = await uploadFile(audioFile, filePath)
      }

      // Update chapter data
      const updatedChapter = {
        ...chapter,
        audioFile: audioFileUrl,
      }

      // Send to API
      await chaptersAPI.update(chapterId, updatedChapter)

      // Update local state
      setChapter(updatedChapter)
      setAudioFile(null)

      toast({
        title: "Success",
        description: "Chapter updated successfully",
      })
    } catch (error) {
      console.error("Error updating chapter:", error)
      toast({
        title: "Error",
        description: "Failed to update chapter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </Button>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 dark:from-blue-600 dark:to-cyan-400 dark:hover:from-blue-700 dark:hover:to-cyan-500"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Chapter</CardTitle>
          <CardDescription>Update chapter details and content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Chapter Name</Label>
              <Input
                id="name"
                value={chapter.name}
                onChange={(e) => setChapter({ ...chapter, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={chapter.status}
                onValueChange={(value) =>
                  setChapter({ ...chapter, status: value as "Complete" | "In Progress" | "Pending" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={chapter.description}
              onChange={(e) => setChapter({ ...chapter, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={12}
              value={chapter.content}
              onChange={(e) => setChapter({ ...chapter, content: e.target.value })}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Audio File</Label>
            {chapter.audioFile ? (
              <div className="flex items-center gap-4 p-4 border rounded-md">
                <FileAudio className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Current Audio File</p>
                  <p className="text-sm text-muted-foreground">{chapter.audioFile.split("/").pop()}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open(chapter.audioFile as string, "_blank")}>
                  Play
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No audio file uploaded yet.</p>
            )}

            <div className="mt-4">
              <Label htmlFor="newAudio">Upload New Audio File</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input id="newAudio" type="file" accept="audio/*" onChange={handleFileChange} />
                {audioFile && <p className="text-sm text-muted-foreground">New file selected: {audioFile.name}</p>}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/courses/${courseId}`}>Cancel</Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 dark:from-blue-600 dark:to-cyan-400 dark:hover:from-blue-700 dark:hover:to-cyan-500"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

