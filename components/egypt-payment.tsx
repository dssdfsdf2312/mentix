"use client"

import { useState } from "react"
import { Copy, Check, CreditCard } from "lucide-react"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 active:scale-95"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

function StepNumber({ num }: { num: number }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
      {num}
    </span>
  )
}

export function EgyptPayment() {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border p-6 md:p-10">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            <span className="text-balance">
              For Egyptian People You Can Pay With{" "}
              <span className="text-primary">Instapay</span>
            </span>
          </h2>

          <h3 className="mb-6 text-lg font-bold text-foreground">How to Pay</h3>

          <ol className="mb-8 space-y-5">
            <li className="flex items-center gap-4 border-b border-border pb-5">
              <StepNumber num={1} />
              <p className="text-sm text-muted-foreground md:text-base">
                {"Open your "}
                <span className="font-bold text-foreground">INSTAPAY</span>
                {" app to Send the Payment"}
              </p>
            </li>
            <li className="flex items-start gap-4 border-b border-border pb-5">
              <StepNumber num={2} />
              <p className="text-sm text-muted-foreground md:text-base">
                {"For "}
                <span className="font-bold text-foreground">STARTER PLAN</span>
                {" Pay "}
                <span className="font-bold text-primary">9,600 EGP</span>
                {" and For "}
                <span className="font-bold text-foreground">1-on-1 Coaching</span>
                {" PLAN Contact Us"}
              </p>
            </li>
            <li className="flex items-center gap-4">
              <StepNumber num={3} />
              <p className="text-sm text-muted-foreground md:text-base">
                {"Send a payment confirmation screenshot to the team "}
                <a
                  href="https://t.me/mentixsupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/here relative inline-flex items-center gap-1 font-bold"
                >
                  <span className="relative inline-block animate-here-bounce rounded-md bg-primary px-2.5 py-0.5 text-xs text-primary-foreground shadow-[0_0_12px_hsl(43,100%,50%,0.4)] transition-shadow hover:shadow-[0_0_20px_hsl(43,100%,50%,0.6)]">
                    HERE
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                    </span>
                  </span>
                  <svg
                    className="h-4 w-4 animate-here-point text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 7l10 10" />
                    <path d="M17 7v10H7" />
                  </svg>
                </a>
              </p>
            </li>
          </ol>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Instapay</p>
                  <p className="text-base font-bold tracking-wide text-foreground">
                    0115 8022 001
                  </p>
                </div>
              </div>
              <CopyButton text="01158022001" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Vodafone Cash</p>
                  <p className="text-base font-bold tracking-wide text-foreground">
                    0106 2791 235
                  </p>
                </div>
              </div>
              <CopyButton text="01062791235" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
