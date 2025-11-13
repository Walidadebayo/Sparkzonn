import type React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminLayoutClient } from "@/components/admin-layout-client"

export const metadata = {
  title: "Admin - Sparkzonn",
  description: "Admin panel for managing Sparkzonn blog",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>
}
