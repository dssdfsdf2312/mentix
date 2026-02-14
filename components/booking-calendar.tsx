"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Video,
  CheckCircle2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  Users,
  Monitor,
  Globe,
} from "lucide-react"

type Slot = {
  id: string
  date: string
  start_time: string
  end_time: string
  duration: number
  is_booked: boolean
}

type SessionType = "weekly" | "one-on-one" | null
type BookingStep = "session-type" | "date" | "slot" | "details" | "confirm" | "success"

const STEPS: { key: BookingStep; label: string }[] = [
  { key: "session-type", label: "Session" },
  { key: "date", label: "Date" },
  { key: "slot", label: "Time" },
  { key: "details", label: "Confirm" },
]

function getStepIndex(step: BookingStep): number {
  if (step === "confirm") return 3
  if (step === "success") return 4
  const idx = STEPS.findIndex((s) => s.key === step)
  return idx >= 0 ? idx : 0
}

export function BookingCalendar() {
  const [step, setStep] = useState<BookingStep>("session-type")
  const [sessionType, setSessionType] = useState<SessionType>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
  const [allSlots, setAllSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<{
    booking: Record<string, string>
    zoom: Record<string, string> | null
  } | null>(null)
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_message: "",
  })

  // Detect client timezone
  const [clientTimezone, setClientTimezone] = useState<string>("")
  const [timezoneOffset, setTimezoneOffset] = useState<string>("")

  useEffect(() => {
    // Get client timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setClientTimezone(timezone)
    
    // Calculate timezone offset for display
    const now = new Date()
    const offset = -now.getTimezoneOffset() / 60
    const offsetStr = `UTC${offset >= 0 ? '+' : ''}${offset}`
    setTimezoneOffset(offsetStr)
  }, [])

  const duration = sessionType === "weekly" ? "60" : "60"

  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch("/api/slots")
        const data = await res.json()
        if (data.slots) {
          setAllSlots(data.slots)
        }
      } catch (e) {
        console.error("Failed to fetch slots:", e)
      }
    }
    fetchSlots()
  }, [])

  const availableDates = allSlots.reduce((acc: Set<string>, slot) => {
    if (!slot.is_booked) acc.add(slot.date)
    return acc
  }, new Set<string>())

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Convert time from Cairo timezone (UTC+2) to client local timezone
  const convertToClientTimezone = (dateStr: string, timeStr: string): { date: string; time: string } => {
    const [year, month, day] = dateStr.split("-").map(Number)
    const [hours, minutes] = timeStr.split(":").map(Number)
    
    // Create date in Cairo timezone (UTC+2) - subtract 2 hours to get UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours - 2, minutes))
    
    // Convert to client local timezone
    const clientDate = new Date(utcDate)
    
    const localDateStr = formatDateLocal(clientDate)
    const localTimeStr = `${String(clientDate.getHours()).padStart(2, "0")}:${String(clientDate.getMinutes()).padStart(2, "0")}`
    
    return { date: localDateStr, time: localTimeStr }
  }