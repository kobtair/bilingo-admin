import { AudioFilesList } from "@/components/audio-files-list"
import { DashboardHeader } from "@/components/dashboard-header"

export default function AudioFilesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Audio Library" text="Manage audio files for language learning." />
      <AudioFilesList />
    </div>
  )
}

