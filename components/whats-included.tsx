"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, FileText, MessageCircle } from "lucide-react"
import { useTranslations } from 'next-intl'

const icons = [Video, Users, FileText, MessageCircle]

export function WhatsIncluded() {
  const t = useTranslations('whatsIncluded')
  const items = t.raw('items') as Array<{ title: string; description: string }>

  return (
    <section id="included" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            {t('description')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i] || Video
            return (
              <Card key={item.title} className="border-border bg-card text-center transition-colors hover:border-primary/30">
                <CardHeader>
                  <Icon className="mx-auto mb-2 h-10 w-10 text-primary" />
                  <CardTitle className="text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
