"use client"

import { MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { CommentForm } from "@/components/comment-form"
import { LikeButton } from "@/components/like-button"
import { useState } from "react"
import { toast } from "sonner"

interface Comment {
  id: string
  userName: string
  content: string
  createdAt: Date
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  coverImage: string | null
  featured: boolean
  published: boolean
  likes: number
  createdAt: Date
  category: { name: string; slug: string }
  comments: Comment[]
}

export function BlogPostContent({ post }: { post: Post }) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Fallback for older browsers or if clipboard fails
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      } catch (clipboardError) {
        toast.error("Unable to share. Please copy the URL manually.")
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <>
      {/* Article Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
            {post.category.name}
          </span>
          {post.featured && (
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">⭐ Featured</span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold">{post.title}</h1>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="font-semibold text-foreground">{post.author}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LikeButton postId={post.id} initialLikes={post.likes} />
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose dark:prose-invert max-w-none mb-12">
        <div className="text-lg text-foreground leading-relaxed mb-6">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Share Section */}
      <div className="border-t border-border pt-8 mb-12">
        <p className="text-sm font-semibold text-muted-foreground mb-4">Share this article</p>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
          onClick={handleShare}
          disabled={isSharing}
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      </div>

      {/* Comments Section */}
      <div className="border-t border-border pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({post.comments.length})</h2>

        {/* Comment Form */}
        <div className="mb-8">
          <CommentForm postId={post.id} onCommentAdded={() => window.location.reload()} />
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{comment.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-foreground">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </>
  )
}