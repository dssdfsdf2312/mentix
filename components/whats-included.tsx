import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, FileText, MessageCircle } from "lucide-react"

const items = [
  {
    icon: Video,
    title: "60+ Video Lessons",
    description: "In-depth recorded lessons covering every aspect of POI (OB & FVG, supply & demand), market structure, and liquidity trading.",
  },
  {
    icon: Users,
    title: "Private Community",
    description: "Join an exclusive Discord & Telegram community of serious traders for daily discussion.",
  },
  {
    icon: FileText,
    title: "Trading Playbook",
    description: "A complete playbook with setups, checklists, and journaling templates.",
  },
  {
    icon: MessageCircle,
    title: "1-on-1 Live Sessions",
    description: "Weekly 1-on-1 live sessions where you can ask questions and get real-time feedback.",
  },
]

export function WhatsIncluded() {
  return (
    <section id="included" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {"What's"} <span className="text-primary">Included</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Everything you need to become a consistently profitable trader.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.title} className="border-border bg-card text-center transition-colors hover:border-primary/30">
              <CardHeader>
                <item.icon className="mx-auto mb-2 h-10 w-10 text-primary" />
                <CardTitle className="text-foreground">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
