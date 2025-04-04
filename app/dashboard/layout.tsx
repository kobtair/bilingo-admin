import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <MobileNav />
        <div className="hidden md:flex md:flex-1 md:items-center">
          <nav className="flex items-center gap-2 text-lg font-medium">
            <div className="hidden md:flex md:items-center md:gap-2">
              <Image src="/logo.png" width={32} height={32} alt="BILINGO Logo" />
              <div className="font-bold text-xl text-blue-700 dark:text-blue-400">BILINGO</div>
            </div>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r bg-muted/40 md:flex dark:bg-muted/20">
          <DashboardNav />
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

