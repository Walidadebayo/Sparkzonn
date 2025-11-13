"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface CommentFormProps {
  postId: string
  onCommentAdded: () => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [userName, setUserName] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userName: userName.trim(), content: content.trim() }),
      })

      if (response.ok) {
        setUserName("")
        setContent("")
        onCommentAdded()
      } else {
        alert("Failed to add comment")
      }
    } catch (error) {
      alert("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-semibold">Add a Comment</h3>

      <div>
        <Input
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="gap-2">
        <Send className="w-4 h-4" />
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  )
}