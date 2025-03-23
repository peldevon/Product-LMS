"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getUserData } from "@/app/lib/store-user"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = getUserData()
    
    if (!userData) {
      router.push("/auth/login")
      return
    }
    
    setUser(userData)
    setLoading(false)
  }, [router])

  // Return a loading state initially (this will be shown during SSR)
  if (typeof window === "undefined" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole={user?.role || "user"} />
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  )
}

