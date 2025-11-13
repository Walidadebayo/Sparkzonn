"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ChangePasswordModal } from "@/components/change-password-modal"

export function AdminLayoutClient({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <ChangePasswordModal />
    </SessionProvider>
  )
}