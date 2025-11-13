import prisma from "@/lib/prisma"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://sparkzonn.com"

  // Get all published posts
  const posts = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  // Get all categories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }))

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
  }))

  const legalEntries = ["privacy-policy", "terms-of-service", "disclaimer", "cookie-policy", "contact"].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    ...postEntries,
    ...categoryEntries,
    ...legalEntries,
  ]
}
