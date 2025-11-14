"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

interface Ad {
  id: string
  title: string
  image: string
  link: string
  position: string
  active: boolean
  createdAt: string
}

export default function AdsPage() {
  const [mounted, setMounted] = useState(false)
  const [ads, setAds] = useState<Ad[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    position: "SIDEBAR",
    active: true,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/ads?admin=true")
      if (!response.ok) throw new Error("Failed to fetch ads")
      const data = await response.json()
      setAds(data)
    } catch (error) {
      console.error("Error fetching ads:", error)
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingId(ad.id)
    setFormData({
      title: ad.title,
      image: ad.image,
      link: ad.link,
      position: ad.position,
      active: ad.active,
    })
    setImagePreview(ad.image)
    setSelectedFile(null)
    setImagePreview(ad.image)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.link) {
      alert("Please fill in all required fields")
      return
    }

    if (!selectedFile && !imagePreview && editingId === "new") {
      alert("Please select an image")
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('link', formData.link)
    formDataToSend.append('position', formData.position)
    formDataToSend.append('active', formData.active.toString())

    if (selectedFile) {
      formDataToSend.append('image', selectedFile)
    }

    try {
      const method = editingId && editingId !== "new" ? "PUT" : "POST"
      const endpoint = editingId && editingId !== "new" ? `/api/ads/${editingId}` : "/api/ads"

      const response = await fetch(endpoint, {
        method,
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Failed to save ad")
      fetchAds()
      handleCancel()
    } catch (error) {
      console.error("Error saving ad:", error)
      alert("Failed to save ad")
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const ad = ads.find((a) => a.id === id)
      if (!ad) return

      const response = await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ad, active: !ad.active }),
      })

      if (!response.ok) throw new Error("Failed to update ad")
      fetchAds()
    } catch (error) {
      console.error("Error updating ad:", error)
      alert("Failed to update ad")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return

    try {
      const response = await fetch(`/api/ads/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete ad")
      fetchAds()
    } catch (error) {
      console.error("Error deleting ad:", error)
      alert("Failed to delete ad")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: "",
      image: "",
      link: "",
      position: "SIDEBAR",
      active: true,
    })
    setSelectedFile(null)
    setImagePreview(null)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ads Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage advertisements</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId("new")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Ad
          </Button>
        )}
      </div>

      {/* Form */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Create Ad" : "Edit Ad"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Ad Title *</label>
                <Input
                  placeholder="Ad title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ad Image *</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Link URL *</label>
                <Input
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="header">Header</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="inline">Inline</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded border border-border"
                />
                <label className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">Save Ad</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ads Grid */}
      {!editingId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id} className={!ad.active ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{ad.title}</CardTitle>
                    <CardDescription>{ad.position}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleToggleActive(ad.id)}>
                    {ad.active ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ad.image && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-muted h-32">
                    <img
                      src={ad.image || "/placeholder.svg"}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=300"
                      }}
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-4 break-all">{ad.link}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Created: {new Date(ad.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(ad)} className="gap-1">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ad.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {ads.length === 0 && !editingId && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No ads yet. Create one to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
