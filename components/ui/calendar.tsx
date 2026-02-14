"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: `${defaultClassNames.root}`,
        months: `${defaultClassNames.months}`,
        month: `${defaultClassNames.month}`,
        month_caption: `${defaultClassNames.month_caption} flex justify-center pt-1 relative items-center`,
        caption_label: `${defaultClassNames.caption_label} text-sm font-medium`,
        nav: `${defaultClassNames.nav} flex items-center`,
        button_previous: `${defaultClassNames.button_previous} absolute left-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100`,
        button_next: `${defaultClassNames.button_next} absolute right-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100`,
        weekdays: `${defaultClassNames.weekdays}`,
        weekday: `${defaultClassNames.weekday} text-muted-foreground w-9 font-normal text-[0.8rem]`,
        weeks: `${defaultClassNames.weeks}`,
        week: `${defaultClassNames.week}`,
        day: `${defaultClassNames.day} h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20`,
        day_button: `${defaultClassNames.day_button} inline-flex h-9 w-9 items-center justify-center rounded-md p-0 font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-selected:opacity-100`,
        selected: `bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground`,
        today: `bg-accent text-accent-foreground`,
        outside: `text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground`,
        disabled: `text-muted-foreground opacity-50`,
        hidden: `invisible`,
        range_middle: `aria-selected:bg-accent aria-selected:text-accent-foreground`,
        range_start: ``,
        range_end: ``,
        chevron: `${defaultClassNames.chevron} h-4 w-4`,
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
