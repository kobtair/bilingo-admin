import { SettingsForm } from "@/components/settings-form"
import { DashboardHeader } from "@/components/dashboard-header"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Settings" text="Manage your application settings and database connections." />
      <SettingsForm />
    </div>
  )
}

