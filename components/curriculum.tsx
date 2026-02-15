"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Layers, TrendingUp, Target, ShieldCheck, BookOpen } from "lucide-react"
import { useTranslations } from 'next-intl'

const icons = [BarChart3, Layers, TrendingUp, Target, ShieldCheck, BookOpen]

export function Curriculum() {
  const t = useTranslations('curriculum')
  const modules = t.raw('modules') as Array<{ title: string; description: string }>

  return (
    <section id="curriculum" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground text-pretty">
            {t('description')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => {
            const Icon = icons[i] || BarChart3
            return (
              <Card key={mod.title} className="border-border bg-card transition-colors hover:border-primary/30">
                <CardHeader>
                  <Icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-foreground">{mod.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
