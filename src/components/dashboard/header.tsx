"use client"

import { Button } from "@/components/ui/button"
import { User as UserIcon, Menu } from "lucide-react"

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onMenuClick: () => void
}

export function DashboardHeader({
  user,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-3 sm:px-4 lg:px-6">
      {/* Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1 lg:flex-none" />

      {/* User Section */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:h-9 sm:w-9">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
          )}

          <span className="hidden sm:block truncate text-sm text-muted-foreground max-w-[140px] md:max-w-[180px] lg:max-w-[240px]">
            {user.name || user.email}
          </span>
        </div>

      </div>
    </header>
  )
}