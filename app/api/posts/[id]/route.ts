import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import imagekit from "@/lib/imagekit"

export async function GET({ params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const post = await prisma.blog.findUnique({
      where: { slug: id },
      include: {
        category: true,
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!post || !post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const featured = formData.get('featured') === 'true'
    const published = formData.get('published') === 'true'
    const coverImageFile = formData.get('coverImage') as File | null

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find category
    const categoryRecord = await prisma.category.findUnique({
      where: { name: category }
    })
    if (!categoryRecord) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 })
    }

    // Generate new slug if title changed
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    let coverImage = null
    let coverImageId = null

    // Upload new image if provided
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

    const post = await prisma.blog.update({
      where: { id },
      data: {
        ...(coverImageId && { id: coverImageId }),
        title,
        slug,
        excerpt,
        content,
        categoryId: categoryRecord.id,
        featured,
        published,
        ...(coverImage && { coverImage }),
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get the post to check for cover image
    const post = await prisma.blog.findUnique({
      where: { id },
      select: { coverImage: true, id: true }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete image from ImageKit if exists
    if (post.coverImage) {
      try {
        await imagekit.deleteFile(post.id)
      } catch (imageError) {
        console.error('Failed to delete image from ImageKit:', imageError)
        // Continue with post deletion even if image deletion fails
      }
    }

    await prisma.blog.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Post deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
