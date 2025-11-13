import prisma from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdSlot } from "@/components/ad-slot"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogPostContent } from "../blog-content"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const post = await prisma.blog.findUnique({
    where: { slug: id },
  })

  if (!post || !post.published) return { title: "Not Found" }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
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
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Blog Post Content */}
        <BlogPostContent post={post} />

        {/* Bottom Ad */}
        <div className="mt-12">
          <AdSlot position="FOOTER" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
