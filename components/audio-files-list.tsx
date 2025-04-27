"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { Badge } from "@/components/ui/badge"
import { FileAudio, Upload, Play, Trash2, Loader2 } from "lucide-react"
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
import { audioFilesAPI } from "@/lib/api"
import { supabase } from "@/lib/supabaseClient"

interface AudioFile {
  id: string
  title: string
  language: string
  dialect: string
  phraseSaid: string
  fileName: string
  fileUrl: string
  duration: string
  uploadDate: string
}

export function AudioFilesList() {
  const { toast } = useToast()
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newAudio, setNewAudio] = useState({
    title: "",
    language: "",
    dialect: "",
    phraseSaid: "",
    file: null as File | null,
  })

  const fetchAudioFiles = async () => {
    try {
      setIsLoading(true)
      const data = await audioFilesAPI.getAll()
      setAudioFiles(data)
    } catch (error) {
      console.error("Error fetching audio files:", error)
      toast({
        title: "Error",
        description: "Failed to load audio files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAudioFiles()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAudio({ ...newAudio, file: e.target.files[0] })
    }
  }

  const handleAddAudio = async () => {
    if (!newAudio.file) {
      toast({
        title: "Error",
        description: "Please select an audio file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Upload the file to Supabase Storage
      const file = newAudio.file
      const filePath = `audio/${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('audio')
        .upload(filePath, file)
      if (uploadError) {
        throw uploadError
      }
      const { data } = supabase
        .storage
        .from('audio')
        .getPublicUrl(filePath)
      if (!data.publicUrl) {
        throw new Error("Failed to get public URL")
      }

      // Create new audio file metadata as FormData
      const formData = new FormData();
      formData.append("id", Date.now().toString());
      formData.append("title", newAudio.title);
      formData.append("language", newAudio.language);
      formData.append("dialect", newAudio.dialect);
      formData.append("phraseSaid", newAudio.phraseSaid);
      formData.append("fileName", file.name);
      formData.append("fileUrl", data.publicUrl);
      formData.append("duration", "N/A");
      formData.append("uploadDate", new Date().toLocaleDateString());

      // Insert the new audio file record into the database.
      await audioFilesAPI.create(formData)

      // Create a new audio file record from the form data
      const newAudioFile: AudioFile = {
        id: Date.now().toString(),
        title: newAudio.title,
        language: newAudio.language,
        dialect: newAudio.dialect,
        phraseSaid: newAudio.phraseSaid,
        fileName: file.name,
        fileUrl: data.publicUrl,
        duration: "N/A",
        uploadDate: new Date().toLocaleDateString(),
      }

      // Update local state
      setAudioFiles([...audioFiles, newAudioFile])

      // Reset form
      setNewAudio({
        title: "",
        language: "",
        dialect: "",
        phraseSaid: "",
        file: null,
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Audio file uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading audio file:", error)
      toast({
        title: "Error",
        description: "Failed to upload audio file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAudio = async (id: string) => {
    try {
      await audioFilesAPI.delete(id)
      setAudioFiles(audioFiles.filter((audio) => audio.id !== id))

      toast({
        title: "Success",
        description: "Audio file deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting audio file:", error)
      toast({
        title: "Error",
        description: "Failed to delete audio file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const playAudio = (url: string) => {
    const audio = new Audio(url)
    audio.play()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audio Files</CardTitle>
          <CardDescription>Manage audio files for language learning.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 dark:from-blue-600 dark:to-cyan-400 dark:hover:from-blue-700 dark:hover:to-cyan-500">
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Audio File</DialogTitle>
              <DialogDescription>Add a new audio file with language information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAudio.title}
                  onChange={(e) => setNewAudio({ ...newAudio, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={newAudio.language}
                  onChange={(e) => setNewAudio({ ...newAudio, language: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialect">Dialect</Label>
                <Input
                  id="dialect"
                  value={newAudio.dialect}
                  onChange={(e) => setNewAudio({ ...newAudio, dialect: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phraseSaid">Phrase Said</Label>
                <Input
                  id="phraseSaid"
                  value={newAudio.phraseSaid}
                  onChange={(e) => setNewAudio({ ...newAudio, phraseSaid: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audioFile">Audio File</Label>
                <Input id="audioFile" type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAudio} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Audio"
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
                <TableHead>Title</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Phrase</TableHead>
                {/* <TableHead>Duration</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audioFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No audio files found. Upload your first audio file.
                  </TableCell>
                </TableRow>
              ) : (
                audioFiles.map((audio) => (
                  <TableRow key={audio.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileAudio className="mr-2 h-4 w-4 text-blue-600" />
                        {audio.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{audio.fileName}</div>
                    </TableCell>
                    <TableCell>
                      {audio.language}
                      <div className="text-xs text-muted-foreground">{audio.dialect}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {audio.phraseSaid}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      {audio.duration}
                      <div className="text-xs text-muted-foreground">Uploaded: {audio.uploadDate}</div>
                    </TableCell> */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => playAudio(audio.fileUrl)}
                        >
                          <Play className="h-4 w-4" />
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
                                This will permanently delete the audio file "{audio.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAudio(audio.id)}
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

