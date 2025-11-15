import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import imagekit from "@/lib/imagekit"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position")
    const isAdmin = searchParams.get("admin") === "true"

    const where: any = isAdmin ? {} : { active: true }
    if (position) {
      where.position = position
    }

    const ads = await prisma.ad.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(ads)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const link = formData.get('link') as string
    const position = formData.get('position') as string
    const active = formData.get('active') === 'true'
    const imageFile = formData.get('image') as File | null

    if (!title || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Upload image to ImageKit
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await imagekit.upload({
      file: buffer,
      fileName: imageFile.name,
      folder: '/ads',
    })
    if (!result.url) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 })
    }

    const ad = await prisma.ad.create({
      data: {
        id: result.fileId,
        title,
        image: result.url,
        link,
        position: (position?.toUpperCase() as any) || "SIDEBAR",
        active,
      }
    })

    return NextResponse.json(ad)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 })
  }
}
