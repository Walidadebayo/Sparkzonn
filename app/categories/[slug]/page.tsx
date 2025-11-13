import prisma from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { AdSlot } from "@/components/ad-slot"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) return { title: "Not Found" }

  return {
    title: `${category.name} - Sparkzonn`,
    description: category.description || `Articles in ${category.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      blogs: {
        where: { published: true },
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!category) {
    notFound()
  }

  const posts = category.blogs

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdSlot position="SIDEBAR" />
        </div>

        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-border">
          <div className="space-y-6">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Category</p>
              <h1 className="text-5xl sm:text-6xl font-bold text-balance">{category.name}</h1>
              <p className="text-lg text-muted-foreground">
                Explore {posts.length} {posts.length === 1 ? "article" : "articles"} in {category.name}
              </p>
              {category.description && <p className="text-base text-muted-foreground">{category.description}</p>}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={{
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt,
                    coverImage: post.coverImage || "",
                    author: post.author || "Unknown",
                    category: post.category.name,
                    categorySlug: post.category.slug,
                    featured: post.featured,
                    likes: post.likes,
                    createdAt: post.createdAt,
                    slug: post.slug,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">No articles found in {category.name}</p>
              <Link href="/blog">
                <Button>Browse All Articles</Button>
              </Link>
            </div>
          )}
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <AdSlot position="INLINE" />
        </div>
      </main>
      <Footer />
    </>
  )
}
