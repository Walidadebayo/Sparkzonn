import Link from "next/link"
import { Heart } from "lucide-react"

interface BlogCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string
    coverImage: string
    author: string
    category: string
    categorySlug: string
    featured: boolean
    likes: number
    createdAt: Date
  }
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className={`group cursor-pointer h-full ${featured ? "md:col-span-2 md:row-span-2" : ""}`}>
        <div className="h-full flex flex-col bg-card hover:bg-accent/10 rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-primary/50">
          {/* Image */}
          <div className={`relative overflow-hidden bg-muted ${featured ? "h-96" : "h-48"}`}>
            <img
              src={post.coverImage || "/placeholder.svg?height=300&width=400&query=blog-post"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 sm:p-6">
            {/* Category */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <Link href={`/categories/${post.categorySlug}`}>
                <span className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
                  {post.category}
                </span>
              </Link>
              {post.featured && (
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">⭐ Featured</span>
              )}
            </div>

            {/* Title */}
            <h3
              className={`font-bold mb-2 line-clamp-2 group-hover:text-primary transition ${
                featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
              }`}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted-foreground mb-4 flex-1 line-clamp-2">{post.excerpt}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-current" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
