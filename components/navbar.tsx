"use client"

import { useState } from "react"
import { Menu, X, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from 'next-intl'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('navbar')

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-foreground tracking-tight">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('brand')}
        </a>

        <div className="hidden items-center gap-4 md:flex">
          <a href="/booking" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('booking')}
          </a>
          <a href="/crypto" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('crypto')}
          </a>
          <LanguageSwitcher />
          <Button asChild size="sm">
            <a href="https://discord.gg/MKysYbcnYW" target="_blank" rel="noopener noreferrer">{t('joinDiscord')}</a>
          </Button>
        </div>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <a
              href="/booking"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {t('booking')}
            </a>
            <a
              href="/crypto"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {t('crypto')}
            </a>
            <LanguageSwitcher />
            <Button asChild size="sm" className="w-full">
              <a href="https://discord.gg/MKysYbcnYW" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{t('joinDiscord')}</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
