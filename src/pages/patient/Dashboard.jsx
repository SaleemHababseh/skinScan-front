import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, FileText, BarChart2, Clock, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import usePatientStore from '../../store/patient-store';
import { formatDate } from '../../utils';

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { 
    skinImages, 
    appointments, 
    currentAnalysis,
    loadPatientData,
    isLoading 
  } = usePatientStore();
  
  useEffect(() => {
    if (user) {
      loadPatientData(user.id);
    }
  }, [user, loadPatientData]);
  
  const recentDiagnoses = skinImages.slice(0, 3);
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-primary p-6 text-white shadow-md">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.firstName} 👋</h1>
            <p className="mt-1">Track your skin health and manage your appointments</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/patient/upload">
              <Button className="bg-white text-primary-500 hover:bg-neutral-100">
                <Plus className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            </Link>
            <Link to="/patient/appointments">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Calendar className="mr-2 h-4 w-4" /> Book Appointment
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
              <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-secondary-700 dark:text-secondary-400">Total Diagnoses</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{skinImages.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-primary-50 dark:bg-transparent dark:border dark:border-primary-900">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-primary-700 dark:text-primary-400">Appointments</p>
              <p className="text-2xl font-bold text-primary-900 dark:text-primary-50">{appointments.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-neutral-50 dark:bg-transparent dark:border dark:border-neutral-700">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-neutral-200 p-3 dark:bg-neutral-800">
              <BarChart2 className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
              <p className="text-sm text-neutral-700 dark:text-neutral-400">Progress</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">85%</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Diagnoses & Upcoming Appointments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Diagnoses */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Recent Diagnoses</h2>
            <Link to="/patient/diagnoses" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : recentDiagnoses.length > 0 ? (
            <div className="space-y-4">
              {recentDiagnoses.map((image) => (
                <Card key={image.id} className="flex overflow-hidden">
                  <div className="h-24 w-24 flex-shrink-0">
                    <img
                      src={image.imageUrl}
                      alt={`Skin condition on ${image.bodyPart}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{image.bodyPart}</h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(image.uploadDate)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {image.concernDescription}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        image.diagnosisStatus === 'completed'
                          ? 'bg-success-50 text-success-500 dark:bg-success-900/30 dark:text-success-500'
                          : 'bg-warning-50 text-warning-500 dark:bg-warning-900/30 dark:text-warning-500'
                      }`}>
                        {image.diagnosisStatus === 'completed' ? 'Completed' : 'Processing'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <FileText className="h-10 w-10 text-neutral-400" />
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">No diagnoses yet</p>
              <Link to="/patient/upload" className="mt-2">
                <Button size="sm">Upload Your First Image</Button>
              </Link>
            </Card>
          )}
        </div>
        
        {/* Upcoming Appointments */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900">
                        <Clock className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {appointment.doctorName}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'bg-success-50 text-success-500 dark:bg-success-900/30 dark:text-success-500'
                            : 'bg-warning-50 text-warning-500 dark:bg-warning-900/30 dark:text-warning-500'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(appointment.dateTime)}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <Calendar className="h-10 w-10 text-neutral-400" />
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">No upcoming appointments</p>
              <Link to="/patient/appointments" className="mt-2">
                <Button size="sm">Book an Appointment</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
      
      {/* Helpful Tips */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Skin Care Tips</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-primary-500">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Daily Sunscreen</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Apply a broad-spectrum sunscreen with at least SPF 30 daily, even on cloudy days.
            </p>
          </Card>
          
          <Card className="border-l-4 border-l-secondary-500">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Stay Hydrated</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Drink plenty of water throughout the day to keep your skin hydrated from the inside out.
            </p>
          </Card>
          
          <Card className="border-l-4 border-l-warning-500">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Monitor Changes</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Regularly check your skin for any new or changing spots, moles, or lesions.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;