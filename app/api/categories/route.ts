import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import slug from "slug"

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: { select: { blogs: true } },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const baseSlug = slug(name)
    const existingCategory = await prisma.category.findUnique({ where: { slug: baseSlug } })
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }


    const category = await prisma.category.create({
      data: {
        name,
        slug: baseSlug,
        description,
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
