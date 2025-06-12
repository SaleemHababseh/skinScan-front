import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Filter, Search, Check, X, MessageCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import useDoctorStore from '../../store/doctor-store';
import { formatDate } from '../../utils';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    appointments,
    loadDoctorAppointments,
    acceptAppointment,
    cancelAppointment,
    isLoading
  } = useDoctorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user) {
      loadDoctorAppointments();
    }
  }, [user, loadDoctorAppointments]);  // Filter appointments based on search term and filter status
  const filteredAppointments = appointments.filter(appointment => {
    const patientName = appointment.patientname || appointment.patientName || appointment.patient_name || '';
    const doctorName = appointment.doctorname || appointment.doctorName || appointment.doctor_name || '';
    const notes = appointment.notes || '';
    
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.appointment_date || b.dateTime || b.date_time) - new Date(a.appointment_date || a.dateTime || a.date_time)); // Sort by date, newest first  // Handle appointment status update
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      if (status === 'accepted') {
        await acceptAppointment(appointmentId);
      } else if (status === 'cancelled') {
        await cancelAppointment(appointmentId);
      }
      // Refresh appointments after update
      await loadDoctorAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Appointments</h1>
        <p className="mt-1 text-neutral-600">Manage your patient appointments</p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input 
            type="text"
            placeholder="Search patient..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >            <option value="all">All Statuses</option>
            <option value="accepted">Accepted</option>
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
      ) : filteredAppointments.length > 0 ? (        <div className="space-y-4">
          {filteredAppointments.map(appointment => (
            <Card key={appointment.appointment_id || appointment.id} className="border-l-4 border-l-primary-500">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Avatar 
                    src={appointment.patientAvatar}
                    alt={appointment.patientname || appointment.patientName || appointment.patient_name || 'Patient'}
                    fallback={(appointment.patientname || appointment.patientName || appointment.patient_name || 'P').charAt(0)}
                    className="h-12 w-12"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="font-medium text-neutral-900">
                        {appointment.patientname || appointment.patientName || appointment.patient_name || 'Unknown Patient'}
                      </h3>                      <span className={`ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === 'accepted' ? 'bg-success-50 text-success-700 :
                        appointment.status === 'pending' ? 'bg-warning-50 text-warning-700 :
                        appointment.status === 'completed' ? 'bg-info-50 text-info-700 :
                        appointment.status === 'cancelled' ? 'bg-neutral-100 text-neutral-700 :
                        'bg-neutral-100 text-neutral-700
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-neutral-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{formatDate(appointment.appointment_date || appointment.dateTime || appointment.date_time, true)}</span>
                    </div>
                    {appointment.notes && (
                      <p className="mt-2 text-sm text-neutral-600">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>                <div className="flex items-center space-x-2">
                  {appointment.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-success-600 border-success-200 hover:bg-success-50 hover:border-success-300"
                        onClick={() => handleUpdateStatus(appointment.appointment_id || appointment.id, 'accepted')}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleUpdateStatus(appointment.appointment_id || appointment.id, 'cancelled')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </>
                  )}                  {appointment.status === 'accepted' && (
                    <>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-primary-600 border-primary-200 hover:bg-primary-50 hover:border-primary-300"
                        onClick={() => {
                          console.log('Doctor navigating to chat with appointment data:', appointment);
                          navigate('/chat', {
                            state: {
                              appointment,
                              chatPartner: {
                                id: appointment.user_id,
                                name: appointment.patientname,
                                type: 'patient'
                              },
                              appointmentId: appointment.appointment_id
                            }
                          });
                        }}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Start Chat
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleUpdateStatus(appointment.appointment_id || appointment.id, 'cancelled')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Calendar className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900">
            No appointments found
          </p>
          <p className="mt-1 text-neutral-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'You have no appointments scheduled'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DoctorAppointments;