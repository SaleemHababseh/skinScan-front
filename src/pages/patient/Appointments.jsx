import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Filter, Search, ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuthStore from '../../store/auth-store';
import usePatientStore from '../../store/patient-store';
import { formatDate } from '../../utils';

const PatientAppointments = () => {
  const { user } = useAuthStore();
  const { appointments, loadPatientData, bookAppointment, cancelAppointment, isLoading } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    doctorId: '',
    notes: '',
  });
  const [doctors, setDoctors] = useState([
    { id: 'doc1', name: 'Dr. Sarah Johnson', specialty: 'Dermatologist' },
    { id: 'doc2', name: 'Dr. Robert Chen', specialty: 'Dermatologist' },
    { id: 'doc3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist' },
  ]);
  
  useEffect(() => {
    if (user) {
      loadPatientData(user.id);
    }
  }, [user, loadPatientData]);
  
  // Filter appointments based on search term and filter status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (appointment.notes && appointment.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                       appointment.status === filterStatus;
                       
    return matchesSearch && matchesFilter;
  });
  
  // Separate upcoming and past appointments
  const currentDate = new Date();
  const upcomingAppointments = filteredAppointments
    .filter(appointment => new Date(appointment.dateTime) > currentDate)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
  const pastAppointments = filteredAppointments
    .filter(appointment => new Date(appointment.dateTime) <= currentDate)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  // Handle booking form submission
  const handleBookAppointment = (e) => {
    e.preventDefault();
    
    // Find the selected doctor
    const selectedDoctor = doctors.find(doctor => doctor.id === newAppointment.doctorId);
    
    if (!selectedDoctor) return;
    
    // Create appointment dateTime by combining date and time
    const dateTime = `${newAppointment.date}T${newAppointment.time}`;
    
    // Create appointment object
    const appointment = {
      id: `apt-${Date.now()}`, // Generate temporary ID
      patientId: user.id,
      doctorId: newAppointment.doctorId,
      doctorName: selectedDoctor.name,
      dateTime,
      notes: newAppointment.notes,
      status: 'pending',
    };
    
    // Book appointment using store function
    bookAppointment(appointment);
    
    // Reset form and hide it
    setNewAppointment({
      date: '',
      time: '',
      doctorId: '',
      notes: '',
    });
    setShowBookingForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Appointments</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Schedule and manage your appointments with specialists</p>
        </div>
        <Button onClick={() => setShowBookingForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Book New Appointment
        </Button>
      </div>
      
      {/* Booking Form */}
      {showBookingForm && (
        <Card className="border-2 border-primary-100 dark:border-primary-900">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Book New Appointment</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowBookingForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleBookAppointment} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newAppointment.date}
                  onChange={e => setNewAppointment({...newAppointment, date: e.target.value})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Time
                </label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={newAppointment.time}
                  onChange={e => setNewAppointment({...newAppointment, time: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="doctor" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Select Doctor
              </label>
              <select
                id="doctor"
                required
                value={newAppointment.doctorId}
                onChange={e => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option value="">Select a specialist</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialty})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Appointment Notes
              </label>
              <textarea
                id="notes"
                placeholder="Describe the reason for your appointment..."
                value={newAppointment.notes}
                onChange={e => setNewAppointment({...newAppointment, notes: e.target.value})}
                className="w-full rounded-md border border-neutral-300 bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Book Appointment
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search appointments..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Appointments List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Upcoming Appointments ({upcomingAppointments.length})
            </h2>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <Card key={appointment.id} className={`
                    border-l-4 
                    ${appointment.status === 'confirmed' ? 'border-l-success-500' : ''}
                    ${appointment.status === 'pending' ? 'border-l-warning-500' : ''}
                    ${appointment.status === 'cancelled' ? 'border-l-neutral-300 dark:border-l-neutral-700' : ''}
                  `}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div className="mb-4 flex flex-1 items-start sm:mb-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                          <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {appointment.doctorName}
                            </h3>
                            <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${appointment.status === 'confirmed' ? 'bg-success-50 text-success-500 dark:bg-success-900/30' : ''}
                              ${appointment.status === 'pending' ? 'bg-warning-50 text-warning-500 dark:bg-warning-900/30' : ''}
                              ${appointment.status === 'cancelled' ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800' : ''}
                            `}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(appointment.dateTime)}</span>
                          </div>
                          {appointment.notes && (
                            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {appointment.status !== 'cancelled' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
                            onClick={() => cancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex h-40 flex-col items-center justify-center text-center">
                <Calendar className="h-10 w-10 text-neutral-400" />
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">No upcoming appointments</p>
                <Button size="sm" className="mt-4" onClick={() => setShowBookingForm(true)}>
                  Book an Appointment
                </Button>
              </Card>
            )}
          </div>
          
          {/* Past Appointments */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Past Appointments ({pastAppointments.length})
            </h2>
            
            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map(appointment => (
                  <Card key={appointment.id} className="opacity-80">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div className="flex flex-1 items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <Check className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="font-medium text-neutral-700 dark:text-neutral-300">
                              {appointment.doctorName}
                            </h3>
                            <span className="ml-2 inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800">
                              Completed
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(appointment.dateTime)}</span>
                          </div>
                          {appointment.notes && (
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex h-32 items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">No past appointments</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;