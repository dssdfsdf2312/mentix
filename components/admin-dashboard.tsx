"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Video,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Users,
  CalendarDays,
  TrendingUp,
  LogOut,
} from "lucide-react"

type Slot = {
  id: string
  date: string
  start_time: string
  end_time: string
  duration: number
  is_booked: boolean
  created_at: string
}

type Booking = {
  id: string
  slot_id: string
  client_name: string
  client_email: string
  client_phone: string | null
  client_message: string | null
  duration: number
  status: string
  zoom_meeting_id: string | null
  zoom_join_url: string | null
  zoom_start_url: string | null
  created_at: string
  availability_slots: Slot
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [rescheduleBookingId, setRescheduleBookingId] = useState<string | null>(null)
  const [rescheduleSlotId, setRescheduleSlotId] = useState<string>("")

  // Add slot form
  const [newSlotDate, setNewSlotDate] = useState("")
  const [newSlotStartTime, setNewSlotStartTime] = useState("09:00")
  const [newSlotDuration, setNewSlotDuration] = useState("60")
  const [addingSlot, setAddingSlot] = useState(false)

  // Bulk slot form
  const [bulkDate, setBulkDate] = useState("")
  const [bulkStartHour, setBulkStartHour] = useState("9")
  const [bulkEndHour, setBulkEndHour] = useState("17")
  const [bulkDuration, setBulkDuration] = useState("60")
  const [addingBulk, setAddingBulk] = useState(false)

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true)
    try {
      const res = await fetch("/api/admin/bookings")
      const data = await res.json()
      if (data.bookings) setBookings(data.bookings)
    } catch (e) {
      console.error("Failed to fetch bookings:", e)
    }
    setLoadingBookings(false)
  }, [])

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true)
    try {
      const res = await fetch("/api/admin/slots")
      const data = await res.json()
      if (data.slots) setSlots(data.slots)
    } catch (e) {
      console.error("Failed to fetch slots:", e)
    }
    setLoadingSlots(false)
  }, [])

  useEffect(() => {
    fetchBookings()
    fetchSlots()
  }, [fetchBookings, fetchSlots])

  const formatTime = (time: string) => {
    const [h, m] = time.split(":")
    const hour = parseInt(h)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleAddSlot = async () => {
    if (!newSlotDate || !newSlotStartTime) return
    setAddingSlot(true)
    const dur = parseInt(newSlotDuration)
    const [h, m] = newSlotStartTime.split(":").map(Number)
    const endMinutes = h * 60 + m + dur
    const endH = Math.floor(endMinutes / 60).toString().padStart(2, "0")
    const endM = (endMinutes % 60).toString().padStart(2, "0")

    try {
      await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slots: [{
            date: newSlotDate,
            start_time: `${newSlotStartTime}:00`,
            end_time: `${endH}:${endM}:00`,
            duration: dur,
          }],
        }),
      })
      fetchSlots()
      setNewSlotDate("")
      setNewSlotStartTime("09:00")
    } catch (e) {
      console.error("Failed to add slot:", e)
    }
    setAddingSlot(false)
  }

  const handleBulkAdd = async () => {
    if (!bulkDate) return
    setAddingBulk(true)
    const dur = parseInt(bulkDuration)
    const startH = parseInt(bulkStartHour)
    const endH = parseInt(bulkEndHour)
    const slotsToAdd = []

    for (let h = startH; h < endH; h += dur / 60) {
      const startMinutes = Math.round(h * 60)
      const endMinutes = startMinutes + dur
      if (endMinutes > endH * 60) break

      const sH = Math.floor(startMinutes / 60).toString().padStart(2, "0")
      const sM = (startMinutes % 60).toString().padStart(2, "0")
      const eH = Math.floor(endMinutes / 60).toString().padStart(2, "0")
      const eM = (endMinutes % 60).toString().padStart(2, "0")

      slotsToAdd.push({
        date: bulkDate,
        start_time: `${sH}:${sM}:00`,
        end_time: `${eH}:${eM}:00`,
        duration: dur,
      })
    }

    try {
      await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: slotsToAdd }),
      })
      fetchSlots()
      setBulkDate("")
    } catch (e) {
      console.error("Failed to bulk add:", e)
    }
    setAddingBulk(false)
  }

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Delete this slot?")) return
    try {
      await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" })
      fetchSlots()
    } catch (e) {
      console.error("Failed to delete slot:", e)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!confirm(`Change status to "${newStatus}"?`)) return
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, status: newStatus }),
      })
      fetchBookings()
      fetchSlots()
    } catch (e) {
      console.error("Failed to update status:", e)
    }
  }

  const handleReschedule = async (bookingId: string) => {
    if (!rescheduleSlotId) return
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, new_slot_id: rescheduleSlotId }),
      })
      fetchBookings()
      fetchSlots()
      setRescheduleBookingId(null)
      setRescheduleSlotId("")
    } catch (e) {
      console.error("Failed to reschedule:", e)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "rescheduled": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default: return ""
    }
  }

  const confirmedCount = bookings.filter(b => b.status === "confirmed").length
  const totalSlots = slots.length
  const availableSlots = slots.filter(s => !s.is_booked).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Mentix Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            document.cookie = "admin_session=; path=/; max-age=0"
            window.location.reload()
          }}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedCount}</p>
                <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <CalendarDays className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{availableSlots}</p>
                <p className="text-sm text-muted-foreground">Available Slots</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <CalendarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSlots}</p>
                <p className="text-sm text-muted-foreground">Total Slots</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="slots">Availability</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">All Bookings</h2>
              <Button variant="outline" size="sm" onClick={fetchBookings}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>

            {loadingBookings ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : bookings.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No bookings yet.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Client</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Zoom</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id} className="border-border">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{booking.client_name}</p>
                              <p className="text-sm text-muted-foreground">{booking.client_email}</p>
                              {booking.client_phone && (
                                <p className="text-xs text-muted-foreground">{booking.client_phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">
                                {booking.availability_slots ? formatDate(booking.availability_slots.date) : "N/A"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.availability_slots ? formatTime(booking.availability_slots.start_time) : "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-foreground">{booking.duration} min</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {booking.zoom_start_url ? (
                              <a
                                href={booking.zoom_start_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <Video className="h-3.5 w-3.5" /> Start
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {booking.status === "confirmed" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-emerald-400 hover:text-emerald-300"
                                    onClick={() => handleStatusChange(booking.id, "completed")}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                  <Dialog open={rescheduleBookingId === booking.id} onOpenChange={(open) => {
                                    if (!open) { setRescheduleBookingId(null); setRescheduleSlotId(""); }
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-amber-400 hover:text-amber-300"
                                        onClick={() => setRescheduleBookingId(booking.id)}
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-card border-border">
                                      <DialogHeader>
                                        <DialogTitle>Reschedule Booking</DialogTitle>
                                        <DialogDescription>
                                          Select a new available slot for {booking.client_name}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <Select value={rescheduleSlotId} onValueChange={setRescheduleSlotId}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a new slot" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {slots
                                              .filter(s => !s.is_booked && s.duration === booking.duration)
                                              .map(s => (
                                                <SelectItem key={s.id} value={s.id}>
                                                  {formatDate(s.date)} at {formatTime(s.start_time)} ({s.duration} min)
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          className="w-full"
                                          disabled={!rescheduleSlotId}
                                          onClick={() => handleReschedule(booking.id)}
                                        >
                                          Confirm Reschedule
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300"
                                    onClick={() => handleStatusChange(booking.id, "cancelled")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="slots" className="space-y-6">
            {/* Add single slot */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" /> Add Single Slot
                </CardTitle>
                <CardDescription>Add an individual availability slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newSlotDate}
                      onChange={(e) => setNewSlotDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newSlotStartTime}
                      onChange={(e) => setNewSlotStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={newSlotDuration} onValueChange={setNewSlotDuration}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                        <SelectItem value="90">90 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddSlot} disabled={addingSlot || !newSlotDate}>
                    {addingSlot ? "Adding..." : "Add Slot"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bulk add slots */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> Bulk Add Slots
                </CardTitle>
                <CardDescription>Generate multiple slots for an entire day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={bulkDate}
                      onChange={(e) => setBulkDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Hour</Label>
                    <Select value={bulkStartHour} onValueChange={setBulkStartHour}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, "0")}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>End Hour</Label>
                    <Select value={bulkEndHour} onValueChange={setBulkEndHour}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, "0")}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={bulkDuration} onValueChange={setBulkDuration}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                        <SelectItem value="90">90 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleBulkAdd} disabled={addingBulk || !bulkDate}>
                    {addingBulk ? "Adding..." : "Generate Slots"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Slots list */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">All Availability Slots</h2>
              <Button variant="outline" size="sm" onClick={fetchSlots}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : slots.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No availability slots configured.</p>
                  <p className="text-sm text-muted-foreground">Add slots above to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slots.map((slot) => (
                        <TableRow key={slot.id} className="border-border">
                          <TableCell className="font-medium text-foreground">
                            {formatDate(slot.date)}
                          </TableCell>
                          <TableCell>
                            <span className="text-foreground">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-foreground">{slot.duration} min</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              slot.is_booked
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }>
                              {slot.is_booked ? "Booked" : "Available"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {!slot.is_booked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteSlot(slot.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
