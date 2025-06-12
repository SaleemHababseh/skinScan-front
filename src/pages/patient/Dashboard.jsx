import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Upload, 
  Heart,
  Star
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import { getPatientAppointments } from '../../api/users/getPatientAppointments';
import { getUserRecords } from '../../api/users/getUserRecords';
import { formatDate } from '../../utils';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, token, fetchUserBasicInfo } = useAuthStore();
    const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  // Single effect to handle all data loading
  useEffect(() => {
    const loadAllData = async () => {
      if (!user?.id || !token || loadingRef.current || hasLoadedRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);

      try {
        // Load user info if needed
        const needsUserInfo = !user.f_name && !user.firstName;
        if (needsUserInfo) {
          await fetchUserBasicInfo().catch((error) => {
            console.error('Dashboard: Error loading user info:', error);
          });
        }

        // Load patient data
        const [appointmentsData, recordsData] = await Promise.all([
          getPatientAppointments(token).catch(() => []),
          getUserRecords(token).catch(() => [])
        ]);
        
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        
        // Transform records data to handle the records_info structure
        const transformedRecords = Array.isArray(recordsData) 
          ? recordsData.map(record => record.records_info || record) 
          : [];
        setRecords(transformedRecords);
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };

    loadAllData();
  }, [user?.id, token, user?.f_name, user?.firstName, fetchUserBasicInfo]);

  // Reset data when user changes
  useEffect(() => {
    hasLoadedRef.current = false;
    setAppointments([]);
    setRecords([]);  }, [user?.id]);

  // Get recent appointments from API
  const recentAppointments = appointments
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .slice(0, 3);

  // Get recent records
  const recentRecords = records
    .sort((a, b) => new Date(b.test_date) - new Date(a.test_date))
    .slice(0, 3);

  // eslint-disable-next-line no-unused-vars
  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = "blue" }) => (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <div className="text-center">
        <div className={`mx-auto w-12 h-12 bg-${color}-100}-900/20 rounded-lg flex items-center justify-center mb-4`}>
          <Icon className={`h-6 w-6 text-${color}-600}-400`} />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.f_name || user?.firstName || 'Patient'}!</h1>
        <p className="mt-2 opacity-90">Take control of your skin health journey.</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            icon={Calendar}
            title="Book Appointment"
            description="Schedule with a doctor"
            onClick={() => navigate('/patient/appointments')}
            color="blue"
          />
          <QuickActionCard
            icon={Upload}
            title="Upload Skin Image"
            description="Get AI analysis"
            onClick={() => navigate('/patient/upload')}
            color="green"
          />
          <QuickActionCard
            icon={FileText}
            title="My Records"
            description="View scan history"
            onClick={() => navigate('/patient/records')}
            color="purple"
          />

        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        {/* Recent Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/patient/appointments')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {appointment.doctorname || 'Unknown Doctor'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'accepted' 
                      ? 'bg-green-100 text-green-800
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800
                      : 'bg-red-100 text-red-800
                  }`}>
                    {appointment.status || 'pending'}
                  </span>
                </div>
              ))            ) : (
              <p className="text-gray-500 text-center py-4">
                No appointments available
              </p>
            )}
          </div>
        </Card>

        {/* Recent Records */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Scan Records</h3>            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/patient/diagnoses')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentRecords.length > 0 ? (
              recentRecords.map((record, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {record.test_result || 'Skin Analysis'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(record.test_date)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.test_result === 'normal' || record.test_result === 'nev'
                      ? 'bg-green-100 text-green-800
                      : record.test_result === 'bkl' || record.test_result === 'bcc'
                      ? 'bg-yellow-100 text-yellow-800
                      : 'bg-blue-100 text-blue-800
                  }`}>
                    {record.test_result || 'analyzed'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No scan records available
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Health Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skin Health Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Daily Protection</h4>
            <p className="text-sm text-blue-700">
              Apply sunscreen with SPF 30+ daily, even on cloudy days.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Regular Checks</h4>
            <p className="text-sm text-green-700">
              Examine your skin monthly for any changes in moles or spots.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Stay Hydrated</h4>
            <p className="text-sm text-purple-700">
              Drink plenty of water and moisturize regularly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;