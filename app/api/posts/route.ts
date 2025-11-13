import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import imagekit from "@/lib/imagekit"

// GET all posts (public, published only) or by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit
    const isAdmin = searchParams.get("admin") === "true"

    const where: any = isAdmin ? {} : { published: true }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ]
    }

    const posts = await prisma.blog.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: isAdmin ? true : false,
        coverImage: true,
        featured: true,
        published: true,
        likes: true,
        createdAt: true,
        author: true,
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: isAdmin ? undefined : skip,
      take: isAdmin ? undefined : limit,
    })

    if (isAdmin) {
      // For admin, return paginated
      const mappedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category.name,
        author: post.author,
        date: post.createdAt.toISOString(),
        published: post.published,
        featured: post.featured,
        likes: post.likes,
      }))
      
      const total = mappedPosts.length
      const pages = Math.ceil(total / limit)
      const start = (page - 1) * limit
      const paginatedPosts = mappedPosts.slice(start, start + limit)
      
      return NextResponse.json({
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      })
    }

    const total = await prisma.blog.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const author = formData.get('author') as string
    const featured = formData.get('featured') === 'true'
    const published = formData.get('published') === 'true'
    const coverImageFile = formData.get('coverImage') as File | null

    if (!title || !excerpt || !content || !category || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find category
    const categoryRecord = await prisma.category.findUnique({
      where: { name: category }
    })
    if (!categoryRecord) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 })
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Check if slug exists
    const existing = await prisma.blog.findUnique({
      where: { slug }
    })
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    let coverImage = null
    let coverImageId = null

    // Upload image if provided
    if (coverImageFile) {
      const bytes = await coverImageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await imagekit.upload({
        file: buffer,
        fileName: coverImageFile.name,
        folder: '/blog-covers',
      })

      coverImage = result.url
      coverImageId = result.fileId
    }

    const post = await prisma.blog.create({
      data: {
        ...(coverImageId && { id: coverImageId }),
        title,
        slug,
        excerpt,
        content,
        categoryId: categoryRecord.id,
        author,
        featured,
        published,
        coverImage,
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
