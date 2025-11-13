import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, image, link, position, active } = body

    if (!title || !image || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const { id } = await params
    const ad = await prisma.ad.update({
      where: { id },
      data: {
        title,
        image,
        link,
        position,
        active,
      }
    })

    return NextResponse.json(ad)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    await prisma.ad.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Ad deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 })
  }
}