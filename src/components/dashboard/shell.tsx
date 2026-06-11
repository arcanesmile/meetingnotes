"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"

interface ShellProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  children: React.ReactNode
}

export function DashboardShell({
  user,
  children,
}: ShellProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  // Close sidebar with Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeSidebar()
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      )
    }
  }, [closeSidebar])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          user={user}
          onMenuClick={toggleSidebar}
        />

        {/* Page Content */}
        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            sm:p-5
            lg:p-6
          "
        >
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}