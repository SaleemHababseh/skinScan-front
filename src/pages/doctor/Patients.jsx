import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, FileText, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import useAppointmentsStore from '../../store/appointments-store';
import { formatDate } from '../../utils';

const DoctorPatients = () => {
  const { user } = useAuthStore();
  const { appointments, getDoctorAppointments, isLoading } = useAppointmentsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  useEffect(() => {
    if (user?.id) {
      getDoctorAppointments();
    }
  }, [user?.id, getDoctorAppointments]);
  
  // Extract unique patients from appointments
  const patients = appointments ? appointments.reduce((acc, appointment) => {
    const patient = {
      id: appointment.patientId,
      firstName: appointment.patientName?.split(' ')[0] || 'Unknown',
      lastName: appointment.patientName?.split(' ').slice(1).join(' ') || '',
      email: appointment.patientEmail || '',
      lastAppointment: appointment.dateTime,
      totalAppointments: appointments.filter(apt => apt.patientId === appointment.patientId).length
    };
    
    if (!acc.find(p => p.id === patient.id)) {
      acc.push(patient);
    }
    return acc;
  }, []) : [];
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(prevSelected => 
      prevSelected && prevSelected.id === patient.id ? null : patient
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Patients</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage and view patient information</p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input 
            type="text"
            placeholder="Search patients by name or email..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>
      
      {/* Patients List with Detail View */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Patients List */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {filteredPatients.map(patient => (
                <Card 
                  key={patient.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPatient && selectedPatient.id === patient.id 
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
                      : 'hover:border-primary-200 hover:bg-primary-50/50 dark:hover:border-primary-800 dark:hover:bg-primary-900/10'
                  }`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="flex items-center">
                    <Avatar 
                      src={patient.avatarUrl} 
                      alt={`${patient.firstName} ${patient.lastName}`} 
                      fallback={`${patient.firstName[0]}${patient.lastName[0]}`}
                      className="h-10 w-10"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Patient ID: {patient.id}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Patient Detail View */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <Card className="overflow-hidden">
                <div className="border-b border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex items-center">
                    <Avatar 
                      src={selectedPatient.avatarUrl} 
                      alt={`${selectedPatient.firstName} ${selectedPatient.lastName}`} 
                      fallback={`${selectedPatient.firstName[0]}${selectedPatient.lastName[0]}`}
                      className="h-16 w-16"
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{selectedPatient.email}</span>
                        <span>•</span>
                        <span>{selectedPatient.phone}</span>
                        <span>•</span>
                        <span>Patient since {formatDate(selectedPatient.registrationDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Patient Info Tabs */}
                  <div className="border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex space-x-8">
                      <button className="border-b-2 border-primary-500 pb-2 text-sm font-medium text-primary-600 dark:border-primary-400 dark:text-primary-400">
                        Overview
                      </button>
                      <button className="pb-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                        Medical History
                      </button>
                      <button className="pb-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                        Diagnoses
                      </button>
                      <button className="pb-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                        Appointments
                      </button>
                    </div>
                  </div>
                  
                  {/* Patient Overview */}
                  <div className="mt-4 space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Personal Information</h3>
                      <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Age</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.age || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Gender</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.gender || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Date of Birth</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Address</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Medical Information */}
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Medical Information</h3>
                      <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Blood Type</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.bloodType || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Allergies</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.allergies || 'None reported'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Medical Conditions</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.medicalConditions || 'None reported'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Current Medications</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedPatient.medications || 'None reported'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Recent Activity</h3>
                        <Button variant="ghost" size="sm" className="text-primary-500">View All</Button>
                      </div>
                      
                      <div className="mt-2 space-y-3">
                        <div className="flex items-start space-x-3 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                            <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Uploaded new skin image</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">3 days ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info-100 dark:bg-info-900/30">
                            <Calendar className="h-4 w-4 text-info-600 dark:text-info-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Booked an appointment</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Last week</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <Button>Schedule Appointment</Button>
                      <Button variant="outline">Message Patient</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex h-full items-center justify-center p-10 text-center">
                <div>
                  <Users className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-3 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Select a patient to view details
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    Click on a patient from the list to view their detailed information.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
            No patients found
          </p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {searchTerm ? 'Try adjusting your search term' : 'You have no patients assigned yet'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DoctorPatients;