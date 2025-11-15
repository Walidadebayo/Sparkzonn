"use client"

import Link from "next/link"
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
        console.log(data);
        
        // Randomize and limit to 1 ad to avoid clutter
        const randomizedAds = data.sort(() => Math.random() - 0.5).slice(0, 3)
        setAds(randomizedAds)
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
    <div className="ad-slot flex py-6 flex-wrap justify-center items-center">
        <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wider">Advertisement</p>
      <div className="w-full  flex flex-wrap gap-4 justify-center ">
        {ads.map((ad) => (
          <Link
            key={ad.id}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden hover:opacity-90 transition shadow-md border bg-card max-w-sm shrink-0"
          >
            <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="w-full max-h-48 object-cover" />
            <div className="p-3 bg-muted/30">
              <p className="text-sm font-medium text-foreground truncate">{ad.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
