'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Mail, Phone, Video, Trash2, Edit, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Appointment, AvailabilitySlot } from '@/lib/types/appointments';

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state for availability
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  });

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch availability slots
  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/admin/slots');
      const data = await response.json();
      if (data.slots) {
        setAvailabilitySlots(data.slots);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchAvailability();
  }, []);

  // Auto-clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Delete appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Appointment deleted successfully');
        fetchAppointments();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete appointment');
    }
  };

  // Update appointment status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Status updated successfully');
        fetchAppointments();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  // Add availability slot
  const handleAddAvailability = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate fields
    if (!newSlot.dayOfWeek || !newSlot.startTime || !newSlot.endTime) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: parseInt(newSlot.dayOfWeek),
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Availability slot added successfully');
        fetchAvailability();
        // Reset form
        setNewSlot({ dayOfWeek: '', startTime: '', endTime: '' });
      } else {
        setError(data.error || 'Failed to add availability slot');
      }
    } catch (error) {
      console.error('Error adding availability:', error);
      setError('Failed to add availability slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete availability slot
  const handleDeleteAvailability = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;

    try {
      const response = await fetch(`/api/admin/slots?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Availability slot deleted successfully');
        fetchAvailability();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete availability slot');
    }
  };

  // Delete all availability slots
  const handleDeleteAllSlots = async () => {
    if (!confirm('Are you sure you want to delete ALL available slots? This action cannot be undone!')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/slots?all=true`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('All availability slots deleted successfully');
        fetchAvailability();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to delete all slots');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Appointment Dashboard</h1>
          <p className="text-muted-foreground">Manage your appointments and availability</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 text-green-600">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>View and manage all scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Meeting Link</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No appointments scheduled
                        </TableCell>
                      </TableRow>
                    ) : (
                      appointments.map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell>
                            <div className="font-medium">{apt.clientName}</div>
                            {apt.notes && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {apt.notes}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-sm">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {apt.clientEmail}
                              </span>
                              {apt.clientPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {apt.clientPhone}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(apt.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {apt.startTime} - {apt.endTime}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={apt.status}
                              onValueChange={(value) => handleUpdateStatus(apt.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {apt.zoomJoinUrl ? (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={apt.zoomJoinUrl} target="_blank" rel="noopener noreferrer">
                                  <Video className="w-4 h-4 mr-1" />
                                  Join
                                </a>
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAppointment(apt.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-4">
          <div className="grid gap-6">
            {/* Add Availability Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Availability Slot</CardTitle>
                <CardDescription>Set your available days and times</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAvailability} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Day of Week</Label>
                    <Select
                      value={newSlot.dayOfWeek} 
                      onValueChange={(value) => setNewSlot({ ...newSlot, dayOfWeek: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayNames.map((day, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    {loading ? 'Adding...' : 'Add Availability Slot'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current Availability */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Availability</CardTitle>
                    <CardDescription>Your active availability slots</CardDescription>
                  </div>
                  {availabilitySlots.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAllSlots}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Slots
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availabilitySlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No availability slots set</p>
                  ) : (
                    availabilitySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{dayNames[slot.dayOfWeek]}</div>
                          <div className="text-sm text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAvailability(slot.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
