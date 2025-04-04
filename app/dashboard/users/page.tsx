import { UsersList } from "@/components/users-list"
import { DashboardHeader } from "@/components/dashboard-header"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="User Management" text="View and manage app users." />
      <UsersList />
    </div>
  )
}

