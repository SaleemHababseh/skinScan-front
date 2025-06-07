import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, BarChart2, Activity, Settings, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import useAppointmentsStore from '../../store/appointments-store';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { appointments } = useAppointmentsStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock admin stats - will be replaced with actual API calls
  const [stats] = useState({
    totalUsers: 1250,
    totalDoctors: 45,
    totalPatients: 1205,
    activeAppointments: appointments?.length || 0,
    totalDiagnoses: 2850,
    systemHealth: 98.5
  });
  
  const [recentActivities] = useState([
    { id: 1, type: 'user_registration', message: 'New patient registered', time: '2 minutes ago' },
    { id: 2, type: 'appointment_created', message: 'Appointment scheduled', time: '5 minutes ago' },
    { id: 3, type: 'diagnosis_completed', message: 'Diagnosis completed', time: '10 minutes ago' }
  ]);
  
  const [systemAlerts] = useState([
    { id: 1, type: 'warning', message: 'High server load detected', priority: 'medium' },
    { id: 2, type: 'info', message: 'System maintenance scheduled', priority: 'low' }
  ]);
  
  useEffect(() => {
    // Future: Load admin data from API
    if (user?.id) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [user?.id]);

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
                <p className="text-sm text-secondary-700 dark:text-secondary-400">Diagnoses</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                  {stats?.totalDiagnoses || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-success-50 dark:bg-transparent dark:border dark:border-success-900">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-success-100 p-3 dark:bg-success-900">
                <Activity className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm text-success-700 dark:text-success-400">Active Doctors</p>
                <p className="text-2xl font-bold text-success-900 dark:text-success-50">
                  {stats?.activeDoctors || 0}
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
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">98%</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* System Alerts & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Alerts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">System Alerts</h2>
            <Link to="/settings" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              Settings
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
                    alert.severity === 'critical' ? 'border-l-error-500' :
                    alert.severity === 'warning' ? 'border-l-warning-500' :
                    'border-l-info-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className={`mr-3 rounded-full p-2 ${
                        alert.severity === 'critical' ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' :
                        alert.severity === 'warning' ? 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400' :
                        'bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400'
                      }`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{alert.title}</h3>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{alert.description}</p>
                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">{alert.timestamp}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-neutral-400" />
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">No system alerts</p>
            </Card>
          )}
        </div>
        
        {/* Recent Activity */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Recent Activity</h2>
            <Link to="/admin/reports" className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : recentActivities && recentActivities.length > 0 ? (
            <Card>
              <div className="flow-root">
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            activity.type === 'user' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                            activity.type === 'diagnosis' ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400' :
                            activity.type === 'system' ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' :
                            'bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400'
                          }`}>
                            {activity.type === 'user' && <Users className="h-4 w-4" />}
                            {activity.type === 'diagnosis' && <FileText className="h-4 w-4" />}
                            {activity.type === 'system' && <Settings className="h-4 w-4" />}
                            {activity.type === 'other' && <Activity className="h-4 w-4" />}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {activity.description}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {activity.timestamp}
                          </p>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="flex h-40 flex-col items-center justify-center text-center">
              <Activity className="h-10 w-10 text-neutral-400" />
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">No recent activities</p>
            </Card>
          )}
        </div>
      </div>
      
      {/* Usage Statistics */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">System Usage</h2>
        </div>
        
        <Card className="overflow-hidden p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                User Registrations
              </h3>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                +{stats?.newUsersTodayPercentage || 0}%
              </p>
              <div className="mt-1 text-xs text-success-600 dark:text-success-400">
                <span>↑ {stats?.newUsersToday || 0} today</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Active Sessions
              </h3>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats?.activeSessions || 0}
              </p>
              <div className="mt-1 text-xs text-info-600 dark:text-info-400">
                <span>~ {stats?.averageSessionTime || '0min'} avg. time</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                System Load
              </h3>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats?.systemLoad || '0%'}
              </p>
              <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                <span>Normal performance</span>
              </div>
            </div>
          </div>
          
          {/* Placeholder for charts */}
          <div className="h-60 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Usage Chart - To be implemented
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;