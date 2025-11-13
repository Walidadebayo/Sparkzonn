import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    // Increment likes
    const post = await prisma.blog.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    })

    return NextResponse.json({ likes: post.likes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}