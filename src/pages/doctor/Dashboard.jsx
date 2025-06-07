import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, FileText, BarChart2, Calendar, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import useAppointmentsStore from '../../store/appointments-store';
import { formatDate } from '../../utils';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const { 
    appointments = [], 
    getDoctorAppointments,
    isLoading 
  } = useAppointmentsStore();
  
  // Local state for patients and pending diagnoses (simplified for now)
  const [patients] = useState([]);
  const [pendingDiagnoses] = useState([]);
  
  useEffect(() => {
    // Load doctor appointments on component mount
    if (user?.id) {
      getDoctorAppointments();
    }
  }, [user?.id, getDoctorAppointments]);
  
  const todayAppointments = appointments
    ?.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      const today = new Date();
      return aptDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    })
    ?.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  
  const urgentCases = pendingDiagnoses
    ?.filter(diagnosis => diagnosis.urgency === 'high')
    ?.slice(0, 3);
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-primary p-6 text-white shadow-md">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Dr. {user?.lastName || 'Doctor'} 👋</h1>
            <p className="mt-1">Manage patient diagnoses and appointments</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/doctor/patients">
              <Button className="bg-white text-primary-500 hover:bg-neutral-100">
                <Users className="mr-2 h-4 w-4" /> View Patients
              </Button>
            </Link>
            <Link to="/doctor/appointments">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Calendar className="mr-2 h-4 w-4" /> Manage Appointments
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-secondary-50 dark:bg-transparent dark:border dark:border-secondary-900">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-secondary-100 p-3 dark:bg-secondary-900">
              <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-secondary-700 dark:text-secondary-400">Total Patients</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{patients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-primary-50 dark:bg-transparent dark:border dark:border-primary-900">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-primary-700 dark:text-primary-400">Pending Diagnoses</p>
              <p className="text-2xl font-bold text-primary-900 dark:text-primary-50">{pendingDiagnoses?.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-neutral-50 dark:bg-transparent dark:border dark:border-neutral-700">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-neutral-200 p-3 dark:bg-neutral-800">
              <Calendar className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
              <p className="text-sm text-neutral-700 dark:text-neutral-400">Today's Appointments</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{todayAppointments?.length}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Today's Appointments & Urgent Cases */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Today's Schedule</h2>
            <Link to="/doctor/appointments" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : todayAppointments?.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id} className={`
                  border-l-4
                  ${appointment.status === 'confirmed' ? 'border-l-success-500' : ''}
                  ${appointment.status === 'pending' ? 'border-l-warning-500' : ''}
                  ${appointment.status === 'cancelled' ? 'border-l-neutral-300 dark:border-l-neutral-700' : ''}
                `}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                        <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {appointment.patientName}
                            </h3>
                            <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${appointment.status === 'confirmed' ? 'bg-success-50 text-success-500 dark:bg-success-900/30' : ''}
                              ${appointment.status === 'pending' ? 'bg-warning-50 text-warning-500 dark:bg-warning-900/30' : ''}
                              ${appointment.status === 'cancelled' ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800' : ''}
                            `}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(appointment.dateTime, true)}
                          </p>
                        </div>
                        <div className="mt-2 flex space-x-2 sm:mt-0">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button size="sm">Start Session</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <Calendar className="h-10 w-10 text-neutral-400" />
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">No appointments scheduled for today</p>
              <Link to="/doctor/appointments" className="mt-2">
                <Button size="sm">View All Appointments</Button>
              </Link>
            </Card>
          )}
        </div>
        
        {/* Urgent Cases */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Urgent Cases</h2>
            <Link to="/doctor/patients" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : urgentCases?.length > 0 ? (
            <div className="space-y-4">
              {urgentCases.map((diagnosis) => (
                <Card key={diagnosis.id} className="border-l-4 border-l-error-500">
                  <div className="flex">
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={diagnosis.imageUrl}
                        alt={`Skin condition on ${diagnosis.bodyPart}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {diagnosis.patientName}
                            </h3>
                            <span className="ml-2 inline-flex items-center rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-600 dark:bg-error-900/30 dark:text-error-400">
                              Urgent
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {diagnosis.bodyPart} • {formatDate(diagnosis.uploadDate)}
                          </p>
                        </div>
                        <Button size="sm">Review</Button>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {diagnosis.concernDescription}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-neutral-400" />
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">No urgent cases at the moment</p>
            </Card>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Recent Activity</h2>
        </div>
        
        <Card>
          <div className="flow-root">
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      You reviewed Sarah Johnson's diagnosis
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">30 minutes ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Appointment confirmed with Michael Brown
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">2 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      New patient registered: Emma Wilson
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Yesterday</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;