"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  published: boolean
  featured: boolean
  likes: number
  coverImage?: string
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    published: false,
    featured: false,
    coverImage: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const limit = 10

  useEffect(() => {
    fetchPosts(page)
    fetchCategories()
  }, [page])

  const fetchPosts = async (currentPage = 1) => {
    try {
      const response = await fetch(`/api/posts?admin=true&page=${currentPage}&limit=${limit}`)
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id)
    setFormData(post)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if( imagePreview) URL.revokeObjectURL(imagePreview)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
      alert("Please fill in all required fields")
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('excerpt', formData.excerpt)
    formDataToSend.append('content', formData.content)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('author', formData.author)
    formDataToSend.append('featured', formData.featured?.toString() || 'false')
    formDataToSend.append('published', formData.published?.toString() || 'false')

    if (selectedFile) {
      formDataToSend.append('coverImage', selectedFile)
    }

    try {
      const method = editingId && editingId !== "new" ? "PUT" : "POST"
      const endpoint = editingId && editingId !== "new" ? `/api/posts/${editingId}` : "/api/posts"

      const response = await fetch(endpoint, {
        method,
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Failed to save post")
      await fetchPosts()
      handleCancel()
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete post")
      await fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      published: false,
      featured: false,
      coverImage: "",
    })
    setSelectedFile(null)
    setImagePreview(null)
  }

  if (loading) return <div className="p-6">Loading...</div>

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Manage and create blog posts</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId("new")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Create New Post" : "Edit Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Post title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Excerpt *</label>
                <Input
                  placeholder="Brief summary"
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Author *</label>
                <Input
                  placeholder="Post author"
                  value={formData.author || ""}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content *</label>
                <MDEditor
                  value={formData.content || ""}
                  onChange={(value) => setFormData({ ...formData, content: value || "" })}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  data-color-mode="light"
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.category || ""} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              <div>
                <label className="text-sm font-medium">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published || false}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded border border-border"
                    />
                    <span className="text-sm font-medium">Published</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border border-border"
                    />
                    <span className="text-sm font-medium">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">Save Post</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {!editingId && (
        <div>
          <Input
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      )}

      {/* Posts Table */}
      {!editingId && (
        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>{total} posts found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Author</th>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Published</th>
                    <th className="text-left p-3 font-semibold">Likes</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="p-3">{post.title}</td>
                      <td className="p-3 text-muted-foreground">{post.category}</td>
                      <td className="p-3 text-muted-foreground">{post.author}</td>
                      <td className="p-3 text-muted-foreground text-sm">{new Date(post.date).toLocaleDateString()}</td>
                      <td className="p-3 text-muted-foreground">{post.published ? "Yes" : "No"}</td>
                      <td className="p-3 text-muted-foreground">{post.likes}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page > 1) setPage(page - 1)
                        }}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(p)
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page < totalPages) setPage(page + 1)
                        }}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {filteredPosts.length === 0 && <div className="text-center py-8 text-muted-foreground">No posts found</div>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
