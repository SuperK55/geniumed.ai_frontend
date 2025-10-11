import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserX, UserCheck, Users, Calendar, CalendarCheck, CalendarX } from 'lucide-react';
import { notify } from '@/utils/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import TagInput from '@/components/ui/tag-input';
import { useAuth } from '@/hooks/useAuth';
// import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  specialty: string;
  is_active: boolean;
  created_at: string;
  consultation_price?: number;
  return_consultation_price?: number;
  consultation_duration?: number;
  bio?: string;
  tags?: string[];
  languages?: string[];
  telemedicine_available?: boolean;
  working_hours?: any;
  date_specific_availability?: DateSpecificAvailability[];
  timezone?: string;
  office_address?: string;
  city?: string;
  state?: string;
  // Google Calendar integration fields
  google_calendar_id?: string;
  calendar_sync_enabled?: boolean;
  last_calendar_sync?: string;
}

interface DoctorFormData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  consultation_fee: string;
  return_consultation_fee: string;
  consultation_duration: string;
  bio: string;
  tags: string[];
  languages: string[];
  telemedicine_available: boolean;
  office_address: string;
  city: string;
  state: string;
  working_hours: WorkingHours;
  date_specific_availability: DateSpecificAvailability[];
  timezone: string;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface WorkingHours {
  monday: { enabled: boolean; timeSlots: TimeSlot[] };
  tuesday: { enabled: boolean; timeSlots: TimeSlot[] };
  wednesday: { enabled: boolean; timeSlots: TimeSlot[] };
  thursday: { enabled: boolean; timeSlots: TimeSlot[] };
  friday: { enabled: boolean; timeSlots: TimeSlot[] };
  saturday: { enabled: boolean; timeSlots: TimeSlot[] };
  sunday: { enabled: boolean; timeSlots: TimeSlot[] };
}

interface DateSpecificAvailability {
  id?: string;
  date: string; // YYYY-MM-DD format
  type: 'unavailable' | 'modified_hours';
  reason?: string;
  start?: string; // HH:MM format (only for modified_hours)
  end?: string; // HH:MM format (only for modified_hours)
}

const MEDICAL_SPECIALTIES = [
  'Endocrino Pediátrico',
  'Oftalmologista',
  'Nutrólogo',
  'Psicólogo',
  'Reumatologia Pediátrica',
  'Dermatologista',
  'Otorrino Estético/Funcional',
  'Psiquiatra',
  'Pediatra',
  'Uroginecologista',
  'Fonoaudiólogo',
  'Neonatologista',
  'Ginecologista Obstetra',
  'Alergista/Imunologista',
  'Cardiologista',
  'Clínica Médica / Dor',
  'Endocrinologista',
  'Urologista',
  'Infectologista',
  'Clínico Geral',
  'Pneumologista',
  'Nutricionista',
  'Mastologista',
  'Ortopedista',
  'Nefrologista',
  'Oncologista',
  'Reumatologista',
  'Dermatologista Pediátrico',
  'Otorrino Pediátrico',
  'Geriatra',
  'Cirurgião Plástico',
  'Otorrinolaringologista',
  'Cirurgião Geral',
  'Otoneurologista',
  'Ginecologista Endócrino',
  'Hepatologista',
  'Neurocirurgia de Coluna',
  'Neurologia (Sono)',
  'Fisioterapeuta',
  'Dermatologista Estético',
  'Proctologista/Coloproctologista',
  'Hematologista',
  'Angiologista/Vascular',
  'Neurologia (Tontura/Vertigem)',
  'Nefropediatra',
  'Ortopedista de Coluna',
  'Obstetra',
  'Gastroenterologista',
  'Neurologista',
  'Endoscopista',
  'Ginecologista',
  'Cardiopediatra'
];

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    consultation_fee: '',
    return_consultation_fee: '',
    consultation_duration: '90',
    bio: '',
    tags: [],
    languages: ['Português'],
    telemedicine_available: false,
    office_address: '',
    city: '',
    state: '',
    working_hours: {
      monday: { 
        enabled: true, 
        timeSlots: [{ id: '1', start: '09:00', end: '17:00' }] 
      },
      tuesday: { 
        enabled: true, 
        timeSlots: [{ id: '2', start: '09:00', end: '17:00' }] 
      },
      wednesday: { 
        enabled: true, 
        timeSlots: [{ id: '3', start: '09:00', end: '17:00' }] 
      },
      thursday: { 
        enabled: true, 
        timeSlots: [{ id: '4', start: '09:00', end: '17:00' }] 
      },
      friday: { 
        enabled: true, 
        timeSlots: [{ id: '5', start: '09:00', end: '17:00' }] 
      },
      saturday: { 
        enabled: false, 
        timeSlots: [] 
      },
      sunday: { 
        enabled: false, 
        timeSlots: [] 
      }
    },
    date_specific_availability: [],
    timezone: 'America/Sao_Paulo'
  });
  // const { toast } = useToast();

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
      } else {
        // throw new Error('Failed to fetch doctors');
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load doctors",
      //   variant: "destructive"
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    
    // Listen for calendar connection success from OAuth window
    const handleCalendarSuccess = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'CALENDAR_CONNECTED') {
        notify.success('Google Calendar Connected', {
          description: 'Calendar has been successfully connected',
          duration: 4000
        });
        fetchDoctors(); // Refresh doctors list
      }
    };
    
    window.addEventListener('message', handleCalendarSuccess);
    return () => window.removeEventListener('message', handleCalendarSuccess);
  }, []);

  // Google Calendar API functions
  const connectGoogleCalendar = async (doctorId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/google-calendar/auth/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Open Google OAuth in new window
        window.open(data.authUrl, '_blank', 'width=500,height=600');
        
        notify.success('Google Calendar', {
          description: 'Please complete the authorization in the new window',
          duration: 4000
        });
      } else {
        const error = await response.json();
        notify.error('Calendar Connection Failed', {
          description: error.error || 'Failed to initiate Google Calendar connection',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      notify.error('Calendar Connection Failed', {
        description: 'Network error occurred',
        duration: 4000
      });
    }
  };

  const disconnectGoogleCalendar = async (doctorId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/google-calendar/disconnect/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        notify.success('Google Calendar Disconnected', {
          description: 'Calendar has been successfully disconnected',
          duration: 4000
        });
        // Refresh doctors list to update calendar status
        fetchDoctors();
      } else {
        const error = await response.json();
        notify.error('Disconnect Failed', {
          description: error.error || 'Failed to disconnect Google Calendar',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      notify.error('Disconnect Failed', {
        description: 'Network error occurred',
        duration: 4000
      });
    }
  };

  const getCalendarStatus = async (doctorId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/google-calendar/status/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error getting calendar status:', error);
    }
    return null;
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      consultation_fee: '',
      return_consultation_fee: '',
      consultation_duration: '90',
      bio: '',
      tags: [],
      languages: ['Português'],
      telemedicine_available: false,
      office_address: '',
      city: '',
      state: '',
      working_hours: {
        monday: { 
          enabled: true, 
          timeSlots: [{ id: '1', start: '09:00', end: '17:00' }] 
        },
        tuesday: { 
          enabled: true, 
          timeSlots: [{ id: '2', start: '09:00', end: '17:00' }] 
        },
        wednesday: { 
          enabled: true, 
          timeSlots: [{ id: '3', start: '09:00', end: '17:00' }] 
        },
        thursday: { 
          enabled: true, 
          timeSlots: [{ id: '4', start: '09:00', end: '17:00' }] 
        },
        friday: { 
          enabled: true, 
          timeSlots: [{ id: '5', start: '09:00', end: '17:00' }] 
        },
        saturday: { 
          enabled: false, 
          timeSlots: [] 
        },
        sunday: { 
          enabled: false, 
          timeSlots: [] 
        }
      },
      date_specific_availability: [],
      timezone: 'America/Sao_Paulo'
    });
    setEditingDoctor(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
        return;
      }
      
      const url = editingDoctor ? `/api/doctors/${editingDoctor.id}` : '/api/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        specialty: formData.specialty,
        bio: formData.bio,
        tags: formData.tags,
        languages: formData.languages,
        consultation_price: formData.consultation_fee ? parseFloat(formData.consultation_fee) : undefined,
        return_consultation_price: formData.return_consultation_fee ? parseFloat(formData.return_consultation_fee) : undefined,
        consultation_duration: formData.consultation_duration ? parseInt(formData.consultation_duration) : 90,
        telemedicine_available: formData.telemedicine_available,
        office_address: formData.office_address,
        city: formData.city,
        state: formData.state,
        working_hours: formData.working_hours,
        date_specific_availability: formData.date_specific_availability,
        timezone: formData.timezone,
        owner_id: user?.id
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: `Doctor ${editingDoctor ? 'updated' : 'created'} successfully`
        // });
        resetForm();
        setShowAddDialog(false);
        fetchDoctors();
      } else {
        const errorData = await response.json();
        notify.error('Error Saving Doctor', {
          description: errorData.error || 'Failed to save doctor information.',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      notify.error('Network Error', {
        description: 'Network error occurred. Please check your connection and try again.',
        duration: 6000
      });
    }
  };

  // Handle doctor deletion
  const handleDelete = async (doctorId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: "Doctor permanently deleted"
        // });
        fetchDoctors();
      } else {
        throw new Error('Failed to delete doctor');
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to delete doctor",
      //   variant: "destructive"
      // });
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (doctorId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });

      if (response.ok) {
        fetchDoctors();
      } else {
        throw new Error('Failed to update doctor status');
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);
    }
  };

  // Helper function to convert old working hours format to new format
  const convertWorkingHours = (oldHours: any): WorkingHours => {
    if (!oldHours) {
      return {
        monday: { enabled: true, timeSlots: [{ id: '1', start: '09:00', end: '17:00' }] },
        tuesday: { enabled: true, timeSlots: [{ id: '2', start: '09:00', end: '17:00' }] },
        wednesday: { enabled: true, timeSlots: [{ id: '3', start: '09:00', end: '17:00' }] },
        thursday: { enabled: true, timeSlots: [{ id: '4', start: '09:00', end: '17:00' }] },
        friday: { enabled: true, timeSlots: [{ id: '5', start: '09:00', end: '17:00' }] },
        saturday: { enabled: false, timeSlots: [] },
        sunday: { enabled: false, timeSlots: [] }
      };
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const converted: WorkingHours = {} as WorkingHours;

    days.forEach((day, index) => {
      const dayData = oldHours[day];
      if (dayData) {
        // Check if it's old format (has start/end directly) or new format (has timeSlots)
        if (dayData.start && dayData.end && !dayData.timeSlots) {
          // Old format - convert to new format
          converted[day as keyof WorkingHours] = {
            enabled: dayData.enabled || false,
            timeSlots: dayData.enabled ? [{ id: `${index + 1}`, start: dayData.start, end: dayData.end }] : []
          };
        } else {
          // New format - use as is
          converted[day as keyof WorkingHours] = {
            enabled: dayData.enabled || false,
            timeSlots: dayData.timeSlots || []
          };
        }
      } else {
        // Default for missing days
        converted[day as keyof WorkingHours] = {
          enabled: index < 5, // Monday-Friday enabled by default
          timeSlots: index < 5 ? [{ id: `${index + 1}`, start: '09:00', end: '17:00' }] : []
        };
      }
    });

    return converted;
  };

  // Open edit dialog
  const openEditDialog = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone_number,
      specialty: doctor.specialty,
      consultation_fee: doctor.consultation_price?.toString() || '',
      return_consultation_fee: doctor.return_consultation_price?.toString() || '',
      consultation_duration: doctor.consultation_duration?.toString() || '90',
      bio: doctor.bio || '',
      tags: doctor.tags || [],
      languages: doctor.languages || ['Português'],
      telemedicine_available: doctor.telemedicine_available || false,
      office_address: doctor.office_address || '',
      city: doctor.city || '',
      state: doctor.state || '',
      working_hours: convertWorkingHours(doctor.working_hours),
      date_specific_availability: doctor.date_specific_availability || [],
      timezone: doctor.timezone || 'America/Sao_Paulo'
    });
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage your medical team</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+55 11 99999-9999"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Specialty *</label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  required
                >
                  <SelectTrigger 
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                    style={{ 
                      backgroundColor: 'white !important', 
                      backgroundImage: 'none !important',
                      WebkitBoxShadow: 'none !important',
                      boxShadow: 'none !important',
                      outline: 'none !important',
                      borderColor: '#e2e8f0 !important',
                      color: '#111827 !important'
                    }}
                  >
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICAL_SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              
              <TagInput
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add skill"
              />

              <div>
                <label className="block text-sm font-medium mb-1">Languages</label>
                <Input
                  value={formData.languages.join(', ')}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang) })}
                  placeholder="Português, English, Spanish"
                />
                <p className="text-xs text-gray-500 mt-1">Separate languages with commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.consultation_fee}
                  onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                  placeholder="150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Return Consultation Fee</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.return_consultation_fee}
                  onChange={(e) => setFormData({ ...formData, return_consultation_fee: e.target.value })}
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Consultation Duration (minutes)</label>
                <Input
                  type="number"
                  value={formData.consultation_duration}
                  onChange={(e) => setFormData({ ...formData, consultation_duration: e.target.value })}
                  placeholder="90"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="telemedicine"
                  checked={formData.telemedicine_available}
                  onChange={(e) => setFormData({ ...formData, telemedicine_available: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="telemedicine" className="text-sm font-medium">
                  Telemedicine Available
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Office Address</label>
                <Input
                  value={formData.office_address}
                  onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
                  placeholder="Rua das Flores, 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about the doctor..."
                  rows={3}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                  style={{ 
                    backgroundColor: 'white !important', 
                    backgroundImage: 'none !important',
                    WebkitBoxShadow: 'none !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                    borderColor: '#e2e8f0 !important',
                    color: '#111827 !important'
                  }}
                />
              </div>

              {/* Working Hours Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Set when you are available for meetings</h3>
                
                {Object.entries(formData.working_hours).map(([day, dayData]) => (
                  <div key={day} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {day.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={dayData.enabled}
                          onChange={(e) => {
                            const newWorkingHours = { ...formData.working_hours };
                            newWorkingHours[day as keyof WorkingHours] = {
                              ...dayData,
                              enabled: e.target.checked,
                              timeSlots: e.target.checked && dayData.timeSlots.length === 0 
                                ? [{ id: Date.now().toString(), start: '09:00', end: '17:00' }]
                                : dayData.timeSlots
                            };
                            setFormData({ ...formData, working_hours: newWorkingHours });
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium capitalize">{day}</span>
                        {dayData.enabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newWorkingHours = { ...formData.working_hours };
                              const newTimeSlot = {
                                id: Date.now().toString(),
                                start: '09:00',
                                end: '17:00'
                              };
                              newWorkingHours[day as keyof WorkingHours] = {
                                ...dayData,
                                timeSlots: [...dayData.timeSlots, newTimeSlot]
                              };
                              setFormData({ ...formData, working_hours: newWorkingHours });
                            }}
                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {dayData.enabled ? (
                        <div className="space-y-2">
                          {dayData.timeSlots.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">No time slots set</div>
                          ) : (
                            dayData.timeSlots.map((timeSlot, index) => (
                              <div key={timeSlot.id} className="flex items-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="time"
                                    value={timeSlot.start}
                                    onChange={(e) => {
                                      const newWorkingHours = { ...formData.working_hours };
                                      const updatedTimeSlots = [...dayData.timeSlots];
                                      updatedTimeSlots[index] = { ...timeSlot, start: e.target.value };
                                      newWorkingHours[day as keyof WorkingHours] = {
                                        ...dayData,
                                        timeSlots: updatedTimeSlots
                                      };
                                      setFormData({ ...formData, working_hours: newWorkingHours });
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                  />
                                  <span className="text-gray-400">to</span>
                                  <input
                                    type="time"
                                    value={timeSlot.end}
                                    onChange={(e) => {
                                      const newWorkingHours = { ...formData.working_hours };
                                      const updatedTimeSlots = [...dayData.timeSlots];
                                      updatedTimeSlots[index] = { ...timeSlot, end: e.target.value };
                                      newWorkingHours[day as keyof WorkingHours] = {
                                        ...dayData,
                                        timeSlots: updatedTimeSlots
                                      };
                                      setFormData({ ...formData, working_hours: newWorkingHours });
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newWorkingHours = { ...formData.working_hours };
                                    const updatedTimeSlots = dayData.timeSlots.filter((_, i) => i !== index);
                                    newWorkingHours[day as keyof WorkingHours] = {
                                      ...dayData,
                                      timeSlots: updatedTimeSlots,
                                      enabled: updatedTimeSlots.length > 0
                                    };
                                    setFormData({ ...formData, working_hours: newWorkingHours });
                                  }}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">Unavailable</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timezone Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date-Specific Availability Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Date-Specific Hours</h3>
                    <p className="text-sm text-gray-600">Adjust hours for specific days or mark as unavailable</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAvailability: DateSpecificAvailability = {
                        id: Date.now().toString(),
                        date: new Date().toISOString().split('T')[0],
                        type: 'unavailable',
                        reason: ''
                      };
                      setFormData({
                        ...formData,
                        date_specific_availability: [...formData.date_specific_availability, newAvailability]
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Date
                  </Button>
                </div>

                {formData.date_specific_availability.map((availability, index) => (
                  <div key={availability.id || index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Date-Specific Availability</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedAvailability = formData.date_specific_availability.filter((_, i) => i !== index);
                          setFormData({ ...formData, date_specific_availability: updatedAvailability });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input
                          type="date"
                          value={availability.date}
                          onChange={(e) => {
                            const updatedAvailability = [...formData.date_specific_availability];
                            updatedAvailability[index] = { ...availability, date: e.target.value };
                            setFormData({ ...formData, date_specific_availability: updatedAvailability });
                          }}
                          className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select
                          value={availability.type}
                          onValueChange={(value: 'unavailable' | 'modified_hours') => {
                            const updatedAvailability = [...formData.date_specific_availability];
                            updatedAvailability[index] = { ...availability, type: value };
                            setFormData({ ...formData, date_specific_availability: updatedAvailability });
                          }}
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                            <SelectItem value="modified_hours">Modified Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Reason</label>
                      <Input
                        value={availability.reason || ''}
                        onChange={(e) => {
                          const updatedAvailability = [...formData.date_specific_availability];
                          updatedAvailability[index] = { ...availability, reason: e.target.value };
                          setFormData({ ...formData, date_specific_availability: updatedAvailability });
                        }}
                        placeholder="e.g., Holiday, Personal day, Conference"
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                      />
                    </div>

                    {availability.type === 'modified_hours' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start Time</label>
                          <Input
                            type="time"
                            value={availability.start || '09:00'}
                            onChange={(e) => {
                              const updatedAvailability = [...formData.date_specific_availability];
                              updatedAvailability[index] = { ...availability, start: e.target.value };
                              setFormData({ ...formData, date_specific_availability: updatedAvailability });
                            }}
                            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">End Time</label>
                          <Input
                            type="time"
                            value={availability.end || '17:00'}
                            onChange={(e) => {
                              const updatedAvailability = [...formData.date_specific_availability];
                              updatedAvailability[index] = { ...availability, end: e.target.value };
                              setFormData({ ...formData, date_specific_availability: updatedAvailability });
                            }}
                            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {formData.date_specific_availability.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No date-specific availability set</p>
                    <p className="text-sm">Click "Add Date" to set specific dates when the doctor is unavailable or has modified hours</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingDoctor ? 'Update' : 'Create'} Doctor
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter(d => d.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter(d => !d.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calendar Connected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter(d => d.google_calendar_id).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search doctors by name, specialty, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {doctor.is_active ? "Active" : "Inactive"}
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={doctor.is_active}
                      onChange={() => handleStatusToggle(doctor.id, doctor.is_active)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {doctor.email}</p>
                <p><span className="font-medium">Phone:</span> {doctor.phone_number}</p>
                {doctor.consultation_price && (
                  <p><span className="font-medium">Fee:</span> R$ {doctor.consultation_price}</p>
                )}
                {doctor.return_consultation_price && (
                  <p><span className="font-medium">Return Fee:</span> R$ {doctor.return_consultation_price}</p>
                )}
                {doctor.consultation_duration && (
                  <p><span className="font-medium">Duration:</span> {doctor.consultation_duration} min</p>
                )}
                {doctor.telemedicine_available && (
                  <p><span className="font-medium">Telemedicine:</span> Available</p>
                )}
                {doctor.office_address && (
                  <p><span className="font-medium">Address:</span> {doctor.office_address}</p>
                )}
                {(doctor.city || doctor.state) && (
                  <p><span className="font-medium">Location:</span> {doctor.city}{doctor.city && doctor.state ? ', ' : ''}{doctor.state}</p>
                )}
                {doctor.languages && doctor.languages.length > 0 && (
                  <p><span className="font-medium">Languages:</span> {doctor.languages.join(', ')}</p>
                )}
                {doctor.tags && doctor.tags.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {doctor.bio && (
                  <p><span className="font-medium">Authorities:</span> {doctor.bio}</p>
                )}
                
                {/* Google Calendar Status */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {doctor.google_calendar_id ? (
                        <>
                          <CalendarCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Calendar Connected</span>
                        </>
                      ) : (
                        <>
                          <CalendarX className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">No Calendar</span>
                        </>
                      )}
                    </div>
                    
                    {doctor.google_calendar_id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disconnectGoogleCalendar(doctor.id)}
                        className="text-red-600 hover:text-red-700 text-xs px-2 py-1 h-7"
                      >
                        <CalendarX className="w-3 h-3 mr-1" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => connectGoogleCalendar(doctor.id)}
                        className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 h-7"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                  
                  {doctor.last_calendar_sync && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last sync: {new Date(doctor.last_calendar_sync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(doctor)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete Dr. {doctor.name}? This action cannot be undone and will remove all doctor data from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(doctor.id)}
                        className="bg-red-800 hover:bg-red-900 text-white"
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first doctor."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
