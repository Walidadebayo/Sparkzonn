"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface LikeButtonProps {
  postId: string
  initialLikes: number
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user has already liked this post
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")
    setIsLiked(likedPosts.includes(postId))
  }, [postId])

  const handleLike = async () => {
    if (isLiked || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        setLikes(prev => prev + 1)
        setIsLiked(true)

        // Store in localStorage
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")
        likedPosts.push(postId)
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts))
      } else {
        alert("Failed to like post")
      }
    } catch (error) {
      alert("Failed to like post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={`gap-2 ${isLiked ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-50" : ""}`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      {likes}
    </Button>
  )
}