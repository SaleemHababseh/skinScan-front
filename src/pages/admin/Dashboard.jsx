import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, BarChart2, Activity, AlertTriangle, UserCheck, UserX } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import useAppointmentsStore from '../../store/appointments-store';
import { getAllUsersInfo, getUserInfoByRole, getAllRecords, getRecordByImageId, removeRecordByImageId, getNotAcceptedDoctors, getReportsByStatus } from '../../api/admin';

const AdminDashboard = () => {
  const { user, token } = useAuthStore();
  const { appointments } = useAppointmentsStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Real admin stats from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    activeAppointments: appointments?.length || 0,
    totalDiagnoses: 0,
    pendingDoctors: 0,
    pendingReports: 0,
    systemHealth: 98.5
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);

  // Load admin data from APIs
  const loadAdminData = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // Get all users
      const allUsers = await getAllUsersInfo(token);
      
      // Get doctors and patients separately
      const doctors = await getUserInfoByRole('doctor', token);
      const patients = await getUserInfoByRole('patient', token);
      
      // Get all records for diagnoses count
      const allRecords = await getAllRecords(token);
      
      // Get pending doctors
      const pendingDoctors = await getNotAcceptedDoctors(false, token);
      
      // Get pending reports
      const pendingReports = await getReportsByStatus('pending', token);
      
      setStats({
        totalUsers: Array.isArray(allUsers) ? allUsers.length : 0,
        totalDoctors: Array.isArray(doctors) ? doctors.length : 0,
        totalPatients: Array.isArray(patients) ? patients.length : 0,
        activeAppointments: appointments?.length || 0,
        totalDiagnoses: Array.isArray(allRecords) ? allRecords.length : 0,
        pendingDoctors: Array.isArray(pendingDoctors) ? pendingDoctors.length : 0,
        pendingReports: Array.isArray(pendingReports) ? pendingReports.length : 0,
        systemHealth: 98.5
      });

      // Set recent activities based on data
      setRecentActivities([
        { id: 1, type: 'user_registration', message: `${Array.isArray(patients) ? patients.length : 0} total patients registered`, time: 'All time' },
        { id: 2, type: 'doctor_pending', message: `${Array.isArray(pendingDoctors) ? pendingDoctors.length : 0} doctors awaiting approval`, time: 'Active' },
        { id: 3, type: 'diagnosis_completed', message: `${Array.isArray(allRecords) ? allRecords.length : 0} total diagnoses completed`, time: 'All time' }
      ]);

      // Set recent records (latest 5)
      if (Array.isArray(allRecords)) {
        const formattedRecords = allRecords
          .map((record, index) => {
            const recordInfo = record.records_info || record;
            return {
              id: recordInfo.img_id || index,
              userId: recordInfo.user_id,
              diagnosis: recordInfo.test_result || 'Unknown',
              date: recordInfo.test_date || new Date().toISOString(),
              imageId: recordInfo.img_id
            };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentRecords(formattedRecords);
      }

      // Set system alerts
      const alerts = [];
      if (Array.isArray(pendingDoctors) && pendingDoctors.length > 0) {
        alerts.push({ id: 1, type: 'warning', message: `${pendingDoctors.length} doctors pending approval`, priority: 'high' });
      }
      if (Array.isArray(pendingReports) && pendingReports.length > 0) {
        alerts.push({ id: 2, type: 'info', message: `${pendingReports.length} pending reports`, priority: 'medium' });
      }
      setSystemAlerts(alerts);

    } catch (error) {
      console.error('Error loading admin data:', error);
      setSystemAlerts([
        { id: 1, type: 'error', message: 'Failed to load admin data', priority: 'high' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [token, appointments?.length]);

  // Handle record deletion
  const handleDeleteRecord = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await removeRecordByImageId(imageId, token);
        // Reload admin data to refresh records
        loadAdminData();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  useEffect(() => {
    // Load admin data from API
    if (user?.id && token) {
      loadAdminData();
    }
  }, [user?.id, token, loadAdminData]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-primary p-6 text-white shadow-md">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Admin {user?.firstName || ''} 👋</h1>
            <p className="mt-1">Manage your platform and monitor system performance</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/admin/users">
              <Button className="bg-white text-primary-500 hover:bg-neutral-100">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <BarChart2 className="mr-2 h-4 w-4" /> View Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-primary-50 dark:bg-transparent dark:border dark:border-primary-900">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-primary-700 dark:text-primary-400">Total Users</p>
                  <p className="text-2xl font-bold text-primary-900 dark:text-primary-50">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-secondary-50 dark:bg-transparent dark:border dark:border-secondary-900">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-secondary-100 p-3 dark:bg-secondary-900">
                  <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary-700 dark:text-secondary-400">Total Diagnoses</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                    {stats?.totalDiagnoses || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-success-50 dark:bg-transparent dark:border dark:border-success-900">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-success-100 p-3 dark:bg-success-900">
                  <UserCheck className="h-6 w-6 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-sm text-success-700 dark:text-success-400">Total Doctors</p>
                  <p className="text-2xl font-bold text-success-900 dark:text-success-50">
                    {stats?.totalDoctors || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-warning-50 dark:bg-transparent dark:border dark:border-warning-900">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-warning-100 p-3 dark:bg-warning-900">
                  <UserX className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <p className="text-sm text-warning-700 dark:text-warning-400">Pending Doctors</p>
                  <p className="text-2xl font-bold text-warning-900 dark:text-warning-50">
                    {stats?.pendingDoctors || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-info-50 dark:bg-transparent dark:border dark:border-info-900">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-info-100 p-3 dark:bg-info-900">
                  <Users className="h-6 w-6 text-info-600 dark:text-info-400" />
                </div>
                <div>
                  <p className="text-sm text-info-700 dark:text-info-400">Total Patients</p>
                  <p className="text-2xl font-bold text-info-900 dark:text-info-50">
                    {stats?.totalPatients || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-error-50 dark:bg-transparent dark:border dark:border-error-900">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-error-100 p-3 dark:bg-error-900">
                  <AlertTriangle className="h-6 w-6 text-error-600 dark:text-error-400" />
                </div>
                <div>
                  <p className="text-sm text-error-700 dark:text-error-400">Pending Reports</p>
                  <p className="text-2xl font-bold text-error-900 dark:text-error-50">
                    {stats?.pendingReports || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-50 dark:bg-transparent dark:border dark:border-neutral-800">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-neutral-200 p-3 dark:bg-neutral-800">
                  <BarChart2 className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                </div>
                <div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-400">System Health</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {stats?.systemHealth || 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
      
      {/* System Alerts & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Alerts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">System Alerts</h2>
            <Link to="/admin/users" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              Manage
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : systemAlerts && systemAlerts.length > 0 ? (
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <Card 
                  key={index}
                  className={`border-l-4 ${
                    alert.priority === 'high' ? 'border-l-error-500' :
                    alert.priority === 'medium' ? 'border-l-warning-500' :
                    'border-l-info-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.priority === 'high' ? 'text-error-500' :
                      alert.priority === 'medium' ? 'text-warning-500' :
                      'text-info-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {alert.message}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Priority: {alert.priority}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <AlertTriangle className="h-8 w-8 text-neutral-400" />
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No alerts at this time</p>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">System Overview</h2>
            <Link to="/admin/reports" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <Card key={activity.id}>
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full p-2 ${
                      activity.type === 'user_registration' ? 'bg-primary-100 dark:bg-primary-900' :
                      activity.type === 'doctor_pending' ? 'bg-warning-100 dark:bg-warning-900' :
                      'bg-success-100 dark:bg-success-900'
                    }`}>
                      {activity.type === 'user_registration' && <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
                      {activity.type === 'doctor_pending' && <UserX className="h-4 w-4 text-warning-600 dark:text-warning-400" />}
                      {activity.type === 'diagnosis_completed' && <FileText className="h-4 w-4 text-success-600 dark:text-success-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {activity.message}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Quick Actions</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Common administrative tasks</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/users">
              <Button variant="outline" className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" /> View Reports
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center" onClick={loadAdminData}>
              <Activity className="mr-2 h-4 w-4" /> Refresh Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
