import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserX, UserCheck, Users } from 'lucide-react';
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
  bio?: string;
  tags?: string[];
}

interface DoctorFormData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  consultation_fee: string;
  bio: string;
  tags: string[];
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
  const { token, user } = useAuth();
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
    bio: '',
    tags: []
  });
  // const { toast } = useToast();

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
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
  }, []);

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
      bio: '',
      tags: []
    });
    setEditingDoctor(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingDoctor ? `/api/doctors/${editingDoctor.id}` : '/api/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        specialty: formData.specialty,
        bio: formData.bio,
        tags: formData.tags,
        consultation_price: formData.consultation_fee ? parseFloat(formData.consultation_fee) : undefined,
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
        const error = await response.json();
        throw new Error(error.error || 'Failed to save doctor');
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to save doctor",
      //   variant: "destructive"
      // });
    }
  };

  // Handle doctor deletion
  const handleDelete = async (doctorId: string) => {
    try {
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
        //   description: "Doctor deactivated successfully"
        // });
        fetchDoctors();
      } else {
        throw new Error('Failed to deactivate doctor');
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to deactivate doctor",
      //   variant: "destructive"
      // });
    }
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
      bio: doctor.bio || '',
      tags: doctor.tags || []
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
          <DialogContent className="max-w-md">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Badge variant={doctor.is_active ? "default" : "secondary"}>
                  {doctor.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {doctor.email}</p>
                <p><span className="font-medium">Phone:</span> {doctor.phone_number}</p>
                {doctor.consultation_price && (
                  <p><span className="font-medium">Fee:</span> R$ {doctor.consultation_price}</p>
                )}
                {doctor.tags && doctor.tags.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {doctor.bio && (
                  <p><span className="font-medium">Bio:</span> {doctor.bio}</p>
                )}
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
                      <AlertDialogTitle>Deactivate Doctor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to deactivate Dr. {doctor.name}? This will make them unavailable for new appointments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(doctor.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deactivate
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
