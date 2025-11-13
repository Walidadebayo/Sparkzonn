"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  description?: string
  _count?: { posts: number }
}

export default function CategoriesPage() {
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    setMounted(true)
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
  }


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert("Category name is required")
      return
    }


    try {
      const method = editingId && editingId !== "new" ? "PUT" : "POST"
      const endpoint = editingId && editingId !== "new" ? `/api/categories/${editingId}` : "/api/categories"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, description: formData.description }),
      })

      if (!response.ok) throw new Error("Failed to save category")
      fetchCategories()
      setEditingId(null)
      setFormData({ name: "", description: "" })
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Failed to save category")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error("Failed to delete category")
        fetchCategories()
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category")
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: "", description: "" })
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage content categories</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId("new")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        )}
      </div>

      {/* Form */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Create Category" : "Edit Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  placeholder="Category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="Category description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">Save Category</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      {!editingId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {category.description && <p className="text-sm text-muted-foreground mb-4">{category.description}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="gap-1">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
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

      {categories.length === 0 && !editingId && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No categories yet. Create one to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
