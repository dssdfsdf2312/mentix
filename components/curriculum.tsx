import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Layers, TrendingUp, Target, ShieldCheck, BookOpen } from "lucide-react"

const modules = [
  {
    icon: BarChart3,
    title: "Market Mechanics",
    description: "Understand how markets truly move through order flow and volume analysis.",
  },
  {
    icon: Layers,
    title: "Consistency Profitable",
    description: "Learn how to be a consistent profitable trader — long term profitable.",
  },
  {
    icon: TrendingUp,
    title: "PropFirm & Funded Acc",
    description: "Master how to pass a propfirm challenge with a professional strategy & risk management.",
  },
  {
    icon: Target,
    title: "POI Identification",
    description: "Identify high-probability Points of Interest using OB, FVG, and supply & demand zones.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    description: "Develop a professional risk framework to protect and grow your capital.",
  },
  {
    icon: BookOpen,
    title: "Trade Execution",
    description: "Build a repeatable execution plan with clear rules and journaling practices.",
  },
]

export function Curriculum() {
  return (
    <section id="curriculum" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {"What You'll"} <span className="text-primary">Master</span>
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground text-pretty">
            {"Master momentum trading with clarity. Mentix Trading teaches a structured, repeatable process using POI (OB & FVG, supply & demand), market structure, and liquidity to build precision, confidence, and consistency in every trade."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Card key={mod.title} className="border-border bg-card transition-colors hover:border-primary/30">
              <CardHeader>
                <mod.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-foreground">{mod.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
