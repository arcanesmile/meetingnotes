"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import IMAGE from "next/image"
import {
  FileText,
  Settings,
  Users,
  Home,
  X,
  LogOut,
} from "lucide-react"

const links = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: Home,
  },
  {
    href: "/dashboard/notes",
    label: "Notes",
    icon: FileText,
  },
  {
    href: "/dashboard/teams",
    label: "Teams",
    icon: Users,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function DashboardSidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname()
  const sidebarRef =
    useRef<HTMLElement>(null)

  // Close when route changes
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scrolling when mobile sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow =
        "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden",
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          `
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          bg-card
          transition-transform
          duration-300
          ease-in-out

          lg:static
          lg:z-auto
          lg:translate-x-0
          lg:flex-shrink-0
        `,
          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b p-4 sm:p-5 lg:p-6">
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-2"
          >
            <IMAGE
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
            />
            <span className="hidden text-lg font-bold sm:block">
              MeetNotes
            </span>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              rounded-md
              p-2
              transition-colors
              hover:bg-accent
              lg:hidden
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="space-y-1">
            {links.map((link, index) => {
              const Icon = link.icon

              const isActive =
                link.href === "/dashboard"
                  ? pathname === link.href
                  : pathname === link.href ||
                    pathname.startsWith(
                      link.href + "/"
                    )

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    transition-all
                    duration-200
                  `,
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span className="truncate">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sign Out */}
        <div className="border-t p-3 sm:p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-3
              text-sm
              text-muted-foreground
              transition-all
              duration-200
              hover:bg-destructive/10
              hover:text-destructive
            "
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="truncate">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}