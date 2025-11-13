import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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
    const body = await request.json()
    const { title, image, link, position, active } = body

    if (!title || !image || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        image,
        link,
        position: position || "SIDEBAR",
        active: active !== undefined ? active : true,
      }
    })

    return NextResponse.json(ad)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 })
  }
}
