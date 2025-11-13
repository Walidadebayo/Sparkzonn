"use client"

import { useEffect, useState } from "react"

interface Ad {
  id: string
  title: string
  image: string
  link: string
}

interface AdSlotProps {
  position: "HEADER" | "SIDEBAR" | "FOOTER" | "INLINE"
}

export function AdSlot({ position }: AdSlotProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`/api/ads?position=${position}`)
        const data = await response.json()
        setAds(data)
      } catch (error) {
        console.error("Failed to fetch ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [position])

  if (loading || ads.length === 0) return null

  return (
    <div className="ad-slot space-y-4">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden hover:opacity-80 transition"
        >
          <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="w-full h-auto object-cover" />
        </a>
      ))}
    </div>
  )
}
