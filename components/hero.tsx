"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"
import { useTranslations } from 'next-intl'

export function Hero() {
  const videoRef = useRef<HTMLIFrameElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const t = useTranslations('hero')

  const loadVideo = useCallback(() => {
    setVideoLoaded(true)
  }, [])

  return (
    <section className="relative px-4 pb-10 pt-10 text-center md:pt-12">
      <div className="mx-auto max-w-4xl">
        <Badge variant="outline" className="mb-6 animate-pulse rounded-full border-primary/30 bg-primary/10 px-5 py-2.5 text-base font-medium text-primary md:text-lg">
          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          {t('badge')}
        </Badge>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
          {t('title')}{" "}
          <span className="text-primary">{t('titleHighlight')}</span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-foreground md:text-lg text-pretty">
          {t('description')}
        </p>

        <div className="mx-auto mb-10 w-full max-w-3xl overflow-hidden rounded-xl border border-border">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {videoLoaded ? (
              <iframe
                ref={videoRef}
                className="absolute inset-0 h-full w-full"
                src="https://www.loom.com/embed/2da9913dcacf473a849c5208c0e76a5d?autoplay=1"
                title="Mentorship Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={loadVideo}
                className="absolute inset-0 flex items-center justify-center group"
                aria-label="Play video"
              >
                <Image
                  src="/certs/cert-3.png"
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110 shadow-lg">
                    <Play className="h-7 w-7 ml-1" />
                  </div>
                  <span className="text-sm font-medium text-white drop-shadow-md">{t('watchIntro')}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-lg font-bold leading-relaxed text-primary md:text-xl text-pretty">
          {t('tagline')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 text-base">
            <a href="/enroll">
              {t('enrollButton')} <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
            <a href="#curriculum">{t('learnMore')}</a>
          </Button>
        </div>

        <p className="mt-8 text-base font-medium text-foreground">
          {t('socialText')}
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/eslamfx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Instagram"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a
            href="https://discord.gg/qGV635EkgT"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Discord"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
          <a
            href="https://x.com/eslam4x"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="X"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
