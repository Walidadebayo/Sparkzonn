"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileText, MessageSquare, Zap, Tag } from "lucide-react"
import { startOfWeek, endOfWeek, subWeeks } from "date-fns"

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    activeAds: 0,
    totalAds: 0,
    totalCategories: 0,
    totalLikes: 0,
  })
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [engagementData, setEngagementData] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [postsRes, categoriesRes, adsRes] = await Promise.all([
        fetch("/api/posts?admin=true"),
        fetch("/api/categories"),
        fetch("/api/ads?admin=true")
      ])

      const postsData = postsRes.ok ? await postsRes.json() : { posts: [] }
      const categories = categoriesRes.ok ? await categoriesRes.json() : []
      const ads = adsRes.ok ? await adsRes.json() : []

      const postsArray = postsData.posts || []
      setPosts(postsArray)
      setCategories(categories)

      // Calculate engagement data for last 4 weeks
      const now = new Date()
      const weeks = []
      for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(now, i))
        const weekEnd = endOfWeek(subWeeks(now, i))
        const weekPosts = postsArray.filter((p: any) => {
          const date = new Date(p.createdAt)
          return date >= weekStart && date <= weekEnd
        })
        const postsCount = weekPosts.length
        const commentsCount = weekPosts.reduce((sum: number, p: any) => sum + (p._count?.comments || 0), 0)
        const likesCount = weekPosts.reduce((sum: number, p: any) => sum + p.likes, 0)
        weeks.push({
          name: `Week ${4 - i}`,
          posts: postsCount,
          comments: commentsCount,
          likes: likesCount
        })
      }
      setEngagementData(weeks)

      setStats({
        totalPosts: postsArray.length,
        publishedPosts: postsArray.filter((p: any) => p.published).length,
        draftPosts: postsArray.filter((p: any) => !p.published).length,
        totalComments: postsArray.reduce((sum: number, p: any) => sum + (p._count?.comments || 0), 0),
        activeAds: ads.filter((a: any) => a.active).length,
        totalAds: ads.length,
        totalCategories: categories.length,
        totalLikes: postsArray.reduce((sum: number, p: any) => sum + p.likes, 0),
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (!mounted) return null

  // Chart data
  const postsPerCategory = categories.map((cat: any) => ({
    name: cat.name,
    value: posts.filter((p: any) => p.category === cat.name).length
  }))

  const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">All blog posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">User engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeAds}/{stats.totalAds}
            </div>
            <p className="text-xs text-muted-foreground">Running campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Content organization</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
            <CardDescription>Distribution of posts across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={postsPerCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {postsPerCategory.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Posts, comments, and likes over weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#ec4899" strokeWidth={2} />
                <Line type="monotone" dataKey="likes" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ads Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Metrics</CardTitle>
          <CardDescription>Summary of key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-3xl font-bold">{stats.totalLikes}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Likes per Post</p>
              <p className="text-3xl font-bold">
                {stats.totalPosts > 0 ? Math.round(stats.totalLikes / stats.totalPosts) : 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Comments per Post</p>
              <p className="text-3xl font-bold">
                {stats.totalPosts > 0 ? Math.round(stats.totalComments / stats.totalPosts) : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
