import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Upload, 
  Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import useDoctorStore from '../../store/doctor-store';
import { formatDate } from '../../utils';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, fetchUserBasicInfo } = useAuthStore();  const { 
    appointments,
    loadDoctorAppointments,
    isLoading
  } = useDoctorStore();
  const loadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  // Single effect to handle all data loading
  useEffect(() => {
    const loadAllData = async () => {
      if (!user?.id || loadingRef.current || hasLoadedRef.current) return;

      loadingRef.current = true;

      try {
        // Load user info if needed
        const needsUserInfo = !user.f_name && !user.firstName;
        const promises = [];

        if (needsUserInfo) {
          promises.push(
            fetchUserBasicInfo().catch((error) => {
              console.error('Dashboard: Error loading user info:', error);
            })
          );
        }

        // Load doctor appointments
        promises.push(loadDoctorAppointments());

        await Promise.all(promises);
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading doctor data:', error);
      } finally {
        loadingRef.current = false;
      }
    };

    loadAllData();
  }, [user?.id, user?.f_name, user?.firstName, fetchUserBasicInfo, loadDoctorAppointments]);
  // Reset data when user changes
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [user?.id]);

  // Get recent appointments (last 3)
  const recentAppointments = appointments
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .slice(0, 3);

  // eslint-disable-next-line no-unused-vars
  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = "blue" }) => (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <div className="text-center">
        <div className={`mx-auto w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, Dr. {user?.f_name || user?.firstName || 'Doctor'}!</h1>
        <p className="mt-2 opacity-90">Here's what's happening with your patients today.</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            icon={Calendar}
            title="View Appointments"
            description="Manage your schedule"
            onClick={() => navigate('/doctor/appointments')}
            color="blue"
          />
          <QuickActionCard
            icon={Upload}
            title="Upload Scan"
            description="Analyze skin images"
            onClick={() => navigate('/doctor/upload')}
            color="green"
          />
          <QuickActionCard
            icon={FileText}
            title="Review Diagnoses"
            description="Check patient results"
            onClick={() => navigate('/doctor/diagnoses')}
            color="purple"
          />
     
        </div>
      </div>

      {/* Recent Activity */}
      <div>        {/* Recent Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Appointments</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/doctor/appointments')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {appointment.patientname || 'Unknown Patient'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'accepted' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {appointment.status || 'pending'}
                  </span>
                </div>
              ))
            ) : (              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No appointments available
              </p>
            )}
          </div>        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;