"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { redirect } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({
    email: "",
    name: "",
    role: "ADMIN",
  })

  useEffect(() => {
    if (session?.user && (session.user as any).role !== 'SUPER_ADMIN') {
      redirect('/admin')
    }
    fetchUsers()
  }, [session])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setFormData(user)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.name) {
      alert("Please fill in all required fields")
      return
    }


    try {
      const method = editingId && editingId !== "new" ? "PUT" : "POST"
      const endpoint = editingId && editingId !== "new" ? `/api/users/${editingId}` : "/api/users"

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save user")
      await fetchUsers()
      handleCancel()
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Failed to save user")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete user")
      await fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      email: "",
      name: "",
      role: "ADMIN",
    })
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">Manage admin users</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId("new")} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Admin
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Add New Admin" : "Edit User"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  placeholder="Full name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={formData.role || "ADMIN"} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              

              {editingId === "new" && (
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <p className="text-xs text-muted-foreground mt-1">Default password: sparkzonnadmin</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit">Save User</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      {!editingId && (
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>{users.length} users found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Role</th>
                    <th className="text-left p-3 font-semibold">Created</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3 text-muted-foreground">{user.role}</td>
                      <td className="p-3 text-muted-foreground text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {user.id !== (session?.user as any)?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && <div className="text-center py-8 text-muted-foreground">No users found</div>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}