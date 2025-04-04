import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Dashboard" text="Welcome to the BILINGO admin panel." />
      <DashboardStats />
    </div>
  )
}

