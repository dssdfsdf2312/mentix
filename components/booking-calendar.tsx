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
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fetchSlotsForDate = useCallback(
    async (date: Date) => {
      setLoading(true)
      try {
        // Use local date formatting to avoid UTC timezone conversion
        const dateStr = formatDateLocal(date)
        const res = await fetch(`/api/slots?date=${dateStr}`)
        const data = await res.json()
        if (data.slots) {
          setAvailableSlots(
            data.slots.filter((s: Slot) => s.duration === parseInt(duration))
          )
        }
      } catch (e) {
        console.error("Failed to fetch slots:", e)
      }
      setLoading(false)
    },
    [duration]
  )

  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDate)
    }
  }, [selectedDate, duration, fetchSlotsForDate])

  const handleSessionSelect = (type: SessionType) => {
    setSessionType(type)
    setStep("date")
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    if (date) setStep("slot")
  }

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    setStep("details")
  }

  const handleSubmit = async () => {
    if (!selectedSlot || !form.client_name || !form.client_email) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          duration: parseInt(duration),
          session_type: sessionType,
          ...form,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setBookingResult(data)
        setStep("success")
      } else {
        alert(data.error || "Failed to book. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    }
    setSubmitting(false)
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(":")
    const hour = parseInt(h)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }

  const currentStepIndex = getStepIndex(step)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Stepper Progress */}
      {step !== "success" && (
        <div className="mb-10 flex items-center justify-center gap-0">
          {STEPS.map((s, i) => {
            const isActive = currentStepIndex === i
            const isCompleted = currentStepIndex > i
            return (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-12 sm:w-20 transition-colors duration-300 ${
                      currentStepIndex > i ? "bg-primary" : "bg-secondary"
                    }`}
                    style={{ marginTop: "-1rem" }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Step 1: Session Type Selection */}
      {step === "session-type" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Weekly Session Card */}
          <button
            type="button"
            onClick={() => handleSessionSelect("weekly")}
            className="group relative flex flex-col items-start rounded-xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-primary/50 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Weekly Session</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Students Weekly Session
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>60 min</span>
            </div>
            <div className="absolute inset-0 rounded-xl ring-2 ring-transparent transition-all group-hover:ring-primary/30" />
          </button>

          {/* 1-on-1 Mentoring Card */}
          <button
            type="button"
            onClick={() => handleSessionSelect("one-on-one")}
            className="group relative flex flex-col items-start rounded-xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-primary/50 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">1-on-1 Mentoring</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Personal trading mentorship session with screen sharing and live analysis
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>60 min</span>
            </div>
            <div className="absolute inset-0 rounded-xl ring-2 ring-transparent transition-all group-hover:ring-primary/30" />
          </button>
        </div>
      )}

      {/* Step 2: Date Selection */}
      {step === "date" && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSessionType(null)
                  setStep("session-type")
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">Select a Date</CardTitle>
                <CardDescription>
                  {sessionType === "weekly"
                    ? "Weekly Session"
                    : "1-on-1 Mentoring"}{" "}
                  - Choose an available date
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const dateStr = formatDateLocal(date)
                return (
                  date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                  !availableDates.has(dateStr)
                )
              }}
              modifiers={{
                available: (date) => {
                  const dateStr = formatDateLocal(date)
                  return (
                    date >= new Date(new Date().setHours(0, 0, 0, 0)) &&
                    availableDates.has(dateStr)
                  )
                },
              }}
              modifiersClassNames={{
                available: "day-available",
              }}
              className="rounded-md border border-border"
            />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Time Slot Selection */}
      {step === "slot" && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setStep("date")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">Select a Time</CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  - {duration} min{" "}
                  {sessionType === "weekly"
                    ? "Weekly Session"
                    : "1-on-1 Mentoring"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Clock className="mx-auto mb-3 h-10 w-10 opacity-50" />
                <p>No {duration}-minute slots available on this date.</p>
                <p className="mt-1 text-sm">
                  Try a different date or session type.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={
                      selectedSlot?.id === slot.id ? "default" : "outline"
                    }
                    className="h-auto flex-col gap-1 py-4"
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">
                      {formatTime(slot.start_time)}
                    </span>
                    <span className="text-xs opacity-70">
                      to {formatTime(slot.end_time)}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Contact Details */}
      {(step === "details" || step === "confirm") && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("slot")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">Your Details</CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedSlot && formatTime(selectedSlot.start_time)} -{" "}
                  {duration} min
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Session summary */}
            <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              {sessionType === "weekly" ? (
                <Users className="h-5 w-5 shrink-0 text-primary" />
              ) : (
                <Video className="h-5 w-5 shrink-0 text-primary" />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {sessionType === "weekly"
                    ? "Weekly Session"
                    : "1-on-1 Mentoring Session"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {duration} minutes -{" "}
                  {sessionType === "weekly"
                    ? "Group weekly session via Zoom"
                    : "A Zoom link will be sent to your email"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={form.client_name}
                  onChange={(e) =>
                    setForm({ ...form, client_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.client_email}
                  onChange={(e) =>
                    setForm({ ...form, client_email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> Phone (optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.client_phone}
                onChange={(e) =>
                  setForm({ ...form, client_phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Message (optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your trading experience and goals..."
                value={form.client_message}
                onChange={(e) =>
                  setForm({ ...form, client_message: e.target.value })
                }
                rows={3}
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={
                !form.client_name || !form.client_email || submitting
              }
              onClick={handleSubmit}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Booking...
                </span>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success */}
      {step === "success" && bookingResult && (
        <Card className="border-primary/30 bg-card">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Booking Confirmed!
            </h2>
            <p className="mb-6 text-muted-foreground">
              Your{" "}
              {sessionType === "weekly"
                ? "weekly session"
                : "mentoring session"}{" "}
              has been scheduled. Check your email for confirmation details.
            </p>
            <div className="mx-auto max-w-sm space-y-3 rounded-lg bg-muted/50 p-6 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session</span>
                <span className="font-medium text-foreground">
                  {sessionType === "weekly"
                    ? "Weekly Session"
                    : "1-on-1 Mentoring"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">
                  {selectedSlot && formatTime(selectedSlot.start_time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">
                  {duration} minutes
                </span>
              </div>
              {bookingResult.zoom?.join_url && (
                <div className="border-t border-border pt-3">
                  <Badge variant="outline" className="mb-2">
                    <Video className="mr-1 h-3 w-3" /> Zoom Meeting
                  </Badge>
                  <a
                    href={bookingResult.zoom.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-primary hover:underline"
                  >
                    {bookingResult.zoom.join_url}
                  </a>
                </div>
              )}
            </div>
            <Button className="mt-8" onClick={() => window.location.reload()}>
              Book Another Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}