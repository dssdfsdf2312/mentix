"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How can Mentix Trading help me achieve consistent profits?",
    answer:
      "With expert strategies, real-time coaching, and a supportive community, we simplify momentum trading for sustainable results.",
  },
  {
    question: "What makes Mentix Trading different from other communities?",
    answer:
      "We offer structured trading models, live sessions, and direct access to experts who\u2019ve helped thousands of traders succeed.",
  },
  {
    question: "Is Mentix Trading suitable for beginners?",
    answer:
      "Yes! We simplify complex strategies into clear steps, guiding you from beginner to consistent trader.",
  },
  {
    question: "How does Mentix Trading support funded traders?",
    answer:
      "We offer continuous feedback and coaching to help you secure funding, stay disciplined, and scale your trading.",
  },
  {
    question: "How does the community support my trading journey?",
    answer:
      "Our active community shares insights, strategies, and real-time feedback to keep you motivated and on track.",
  },
]

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-foreground md:text-lg">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
          <span className="text-balance">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </span>
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-sm text-muted-foreground md:text-base">
          Everything you need to know about Mentix Trading
        </p>

        <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
