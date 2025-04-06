"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, BookOpen, Headphones, Settings, UserCircle } from "lucide-react"
import Image from "next/image"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: <UserCircle className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard/users",
    },
    {
      href: "/dashboard/admins",
      label: "Admins",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard/admins",
    },
    {
      href: "/dashboard/courses",
      label: "Courses",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      active: pathname.includes("/dashboard/courses"),
    },
    {
      href: "/dashboard/audio",
      label: "Audio Files",
      icon: <Headphones className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard/audio",
    },
    // {
    //   href: "/dashboard/settings",
    //   label: "Settings",
    //   icon: <Settings className="mr-2 h-4 w-4" />,
    //   active: pathname === "/dashboard/settings",
    // },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* <div className="flex items-center gap-2 px-4 py-4">
        <Image src="/logo.png" width={40} height={40} alt="BILINGO Logo" />
        <span className="font-bold text-xl text-blue-700 dark:text-blue-400">BILINGO</span>
      </div> */}
      <nav className="grid items-start px-2 py-4">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              route.active
                ? "bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                : "",
            )}
            asChild
          >
            <Link href={route.href}>
              {route.icon}
              {route.label}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}

