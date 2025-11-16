import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/lib/imagekit";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const position = formData.get("position") as string;
    const active = formData.get("active") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!title || !link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { id } = await params;

    let imageUrl = null;
    let imageId = null;

    // Upload new image if provided
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await imagekit.upload({
        file: buffer,
        fileName: imageFile.name,
        folder: "/ads",
      });

      imageUrl = result.url;
      imageId = result.fileId;
    }

    const updateData: any = {
      title,
      link,
      position: position?.toUpperCase() as any,
      active,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }
    if (imageId) {
      updateData.id = imageId;
    }

    const ad = await prisma.ad.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const ad = await prisma.ad.findUnique({
      where: { id },
    });
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }
    try {
      await imagekit.deleteFile(id);
    } catch (error) {
      console.error("Failed to delete image from ImageKit:", error);
    }
    await prisma.ad.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ad deleted" });
  } catch (error) {
    console.error("Failed to delete ad:", error);
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
