import { AdminsList } from "@/components/admins-list"
import { DashboardHeader } from "@/components/dashboard-header"

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Admin Management" text="Create new admins and manage existing ones." />
      <AdminsList />
    </div>
  )
}

