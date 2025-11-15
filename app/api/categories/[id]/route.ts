import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import slug from "slug"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = await params
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const finalSlug = slug(name)

    const existingCategory = await prisma.category.findUnique({ where: { slug: finalSlug } })
    if (existingCategory && existingCategory.id !== id) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        description,
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {    
    const {id} = await params

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Category deleted" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}