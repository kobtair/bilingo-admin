"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import Image from "next/image"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Image src="/logo.png" width={32} height={32} alt="BILINGO Logo" />
            <span className="font-bold text-xl text-blue-700 dark:text-blue-400">BILINGO</span>
          </Link>
        </div>
        <DashboardNav />
      </SheetContent>
    </Sheet>
  )
}

