import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, BarChart2, Activity, AlertTriangle, UserCheck, UserX } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import { getAllUsersInfo, getUserInfoByRole, getAllRecords, getNotAcceptedDoctors, getReportsByStatus } from '../../api/admin';

const AdminDashboard = () => {
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Real admin stats from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalDiagnoses: 0,
    pendingDoctors: 0,
    pendingReports: 0,
    systemHealth: 98.5
  });
  
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Load admin overview data from APIs
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
        totalDiagnoses: Array.isArray(allRecords) ? allRecords.length : 0,
        pendingDoctors: Array.isArray(pendingDoctors) ? pendingDoctors.length : 0,
        pendingReports: Array.isArray(pendingReports) ? pendingReports.length : 0,
        systemHealth: 98.5
      });

      // Set system alerts
      const alerts = [];
      if (Array.isArray(pendingDoctors) && pendingDoctors.length > 0) {
        alerts.push({ 
          id: 1, 
          type: 'warning', 
          message: `${pendingDoctors.length} doctors pending approval`, 
          priority: 'high',
          action: '/admin/new-doctors'
        });
      }
      if (Array.isArray(pendingReports) && pendingReports.length > 0) {
        alerts.push({ 
          id: 2, 
          type: 'info', 
          message: `${pendingReports.length} pending reports`, 
          priority: 'medium',
          action: '/admin/reports'
        });
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
  }, [token]);

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
            <Link to="/admin/new-doctors">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <UserCheck className="mr-2 h-4 w-4" /> New Doctors
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
      
      {/* Stats Overview */}
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
                  <p className="text-sm text-success-700 dark:text-success-400">Active Doctors</p>
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
      
      {/* System Alerts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">System Alerts</h2>
          <Button variant="outline" size="sm" onClick={loadAdminData}>
            <Activity className="mr-2 h-4 w-4" /> Refresh
          </Button>
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
                <div className="flex items-center justify-between">
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
                  {alert.action && (
                    <Link to={alert.action}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex h-40 flex-col items-center justify-center text-center">
            <AlertTriangle className="h-8 w-8 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No alerts at this time</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">System is running smoothly</p>
          </Card>
        )}
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
            <Link to="/admin/new-doctors">
              <Button variant="outline" className="flex items-center">
                <UserCheck className="mr-2 h-4 w-4" /> Review New Doctors
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" /> View Reports
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
