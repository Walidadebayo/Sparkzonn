"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setMessage("Subscribed successfully!")
        setEmail("")
      } else {
        const data = await response.json()
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred. Please try again.")
    }

    setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Subscribe to our newsletter and get the best articles delivered to your inbox.
        </p>

        {status === "success" && (
          <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center justify-center gap-2 text-orange-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none transition disabled:opacity-50"
            required
          />
          <Button disabled={status === "loading" || status === "success"}>
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  )
}
