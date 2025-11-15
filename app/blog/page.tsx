import prisma from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { AdSlot } from "@/components/ad-slot"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>
}

export const metadata = {
  title: "Blog - Sparkzonn",
  description: "Read our latest articles on technology, lifestyle, and innovation",
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams

  const [allPosts, categories] = await Promise.all([
    prisma.blog.findMany({
      where: { published: true },
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  // Filter posts based on search params
  let filteredPosts = allPosts
  if (params.category) {
    filteredPosts = filteredPosts.filter((p) => p.category.slug === params.category)
  }
  if (params.q) {
    const q = params.q.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q),
    )
  }

  return (
    <>
      <Header />
      <main className="bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdSlot position="HEADER" />
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog Articles</h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection of thought-provoking articles and insights.
          </p>
        </section>

        {/* Filters Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <form action="/blog" method="get">
                <input
                  type="text"
                  name="q"
                  placeholder="Search articles..."
                  defaultValue={params.q || ""}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none transition"
                />
              </form>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Button variant={!params.category ? "default" : "outline"} asChild>
                <Link href="/blog">All</Link>
              </Button>
              {categories.map((cat) => (
                <Button key={cat.slug} variant={params.category === cat.slug ? "default" : "outline"} asChild>
                  <Link href={`/blog?category=${cat.slug}`}>{cat.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
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
              <p className="text-lg text-muted-foreground">No articles found. Try adjusting your search.</p>
            </div>
          )}
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <AdSlot position="FOOTER" />
        </div>
      </main>
      <Footer />
    </>
  )
}
