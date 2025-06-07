import React, { useEffect, useState } from 'react';
import { Calendar, BarChart2, PieChart, LineChart, Download, Filter, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import useAppointmentsStore from '../../store/appointments-store';

const AdminReports = () => {
  const { user } = useAuthStore();
  const { appointments } = useAppointmentsStore();
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock reports data - will be replaced with actual API calls
  const [reports] = useState({
    userStats: { total: 1250, active: 1180, new: 45 },
    appointmentStats: { total: appointments?.length || 0, completed: 240, cancelled: 15 },
    diagnosisStats: { total: 2850, completed: 2750, pending: 100 }
  });
  
  useEffect(() => {
    // Future: Load reports from API
    if (user?.id) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [user?.id, dateRange, reportType]);
  
  // Handle report download
  const handleDownloadReport = (format) => {
    alert(`Downloading ${reportType} report in ${format} format...`);
    // Actual download implementation would be here
  };
    // Handle report refresh
  const handleRefreshReport = () => {
    setIsLoading(true);
    // Future: Reload reports from API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analytics & Reports</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">View system performance and usage statistics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center" onClick={handleRefreshReport}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <div className="relative inline-block text-left">
            <Button className="flex items-center">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <div className="absolute right-0 mt-2 hidden w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800">
              <div className="py-1">
                <button className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700" onClick={() => handleDownloadReport('csv')}>
                  CSV
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700" onClick={() => handleDownloadReport('pdf')}>
                  PDF
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700" onClick={() => handleDownloadReport('excel')}>
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Date Range:</span>
        </div>
        <select
          className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
        
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Report Type:</span>
        </div>
        <select
          className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="all">All Reports</option>
          <option value="users">User Reports</option>
          <option value="diagnoses">Diagnosis Reports</option>
          <option value="appointments">Appointment Reports</option>
          <option value="system">System Reports</option>
        </select>
      </div>
      
      {/* Reports Summary */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card className="bg-primary-50 dark:bg-transparent dark:border dark:border-primary-900">
            <div>
              <h3 className="text-sm font-medium text-primary-700 dark:text-primary-400">New Users</h3>
              <p className="mt-1 text-2xl font-bold text-primary-900 dark:text-primary-50">
                {reports?.userStats?.newUsers || 0}
              </p>
              <p className="mt-1 text-xs text-primary-700 dark:text-primary-400">
                <span className={reports?.userStats?.growth >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}>
                  {reports?.userStats?.growth >= 0 ? '↑' : '↓'} {Math.abs(reports?.userStats?.growth || 0)}%
                </span>
                {' '}vs previous period
              </p>
            </div>
          </Card>
          
          <Card className="bg-secondary-50 dark:bg-transparent dark:border dark:border-secondary-900">
            <div>
              <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-400">Diagnoses</h3>
              <p className="mt-1 text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                {reports?.diagnosisStats?.totalDiagnoses || 0}
              </p>
              <p className="mt-1 text-xs text-secondary-700 dark:text-secondary-400">
                <span className={reports?.diagnosisStats?.growth >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}>
                  {reports?.diagnosisStats?.growth >= 0 ? '↑' : '↓'} {Math.abs(reports?.diagnosisStats?.growth || 0)}%
                </span>
                {' '}vs previous period
              </p>
            </div>
          </Card>
          
          <Card className="bg-success-50 dark:bg-transparent dark:border dark:border-success-900">
            <div>
              <h3 className="text-sm font-medium text-success-700 dark:text-success-400">Appointments</h3>
              <p className="mt-1 text-2xl font-bold text-success-900 dark:text-success-50">
                {reports?.appointmentStats?.totalAppointments || 0}
              </p>
              <p className="mt-1 text-xs text-success-700 dark:text-success-400">
                <span className={reports?.appointmentStats?.growth >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}>
                  {reports?.appointmentStats?.growth >= 0 ? '↑' : '↓'} {Math.abs(reports?.appointmentStats?.growth || 0)}%
                </span>
                {' '}vs previous period
              </p>
            </div>
          </Card>
          
          <Card className="bg-neutral-50 dark:bg-transparent dark:border dark:border-neutral-700">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-400">Average Response Time</h3>
              <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {reports?.systemStats?.avgResponseTime || '0ms'}
              </p>
              <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-400">
                <span className={reports?.systemStats?.responseTimeChange <= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}>
                  {reports?.systemStats?.responseTimeChange <= 0 ? '↓' : '↑'} {Math.abs(reports?.systemStats?.responseTimeChange || 0)}%
                </span>
                {' '}vs previous period
              </p>
            </div>
          </Card>
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">User Growth</h2>
            <Button variant="ghost" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> View Details
            </Button>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <LineChart className="mx-auto h-10 w-10 text-neutral-400" />
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  User Growth Chart - To be implemented
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Diagnoses Distribution Chart */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Diagnoses by Type</h2>
            <Button variant="ghost" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> View Details
            </Button>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <PieChart className="mx-auto h-10 w-10 text-neutral-400" />
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Diagnoses Distribution Chart - To be implemented
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Appointment Statistics Chart */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Appointments Over Time</h2>
            <Button variant="ghost" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> View Details
            </Button>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <BarChart2 className="mx-auto h-10 w-10 text-neutral-400" />
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Appointment Statistics Chart - To be implemented
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* System Performance Chart */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">System Performance</h2>
            <Button variant="ghost" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> View Details
            </Button>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <LineChart className="mx-auto h-10 w-10 text-neutral-400" />
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  System Performance Chart - To be implemented
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Detailed Reports Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Detailed Reports</h2>
        </div>
        
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr className="border-b border-neutral-200 text-left text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <th className="whitespace-nowrap px-4 py-3">Report Name</th>
                  <th className="whitespace-nowrap px-4 py-3">Type</th>
                  <th className="whitespace-nowrap px-4 py-3">Period</th>
                  <th className="whitespace-nowrap px-4 py-3">Generated</th>
                  <th className="whitespace-nowrap px-4 py-3">Size</th>
                  <th className="whitespace-nowrap px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <tr className="text-sm">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    User Activity Report
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                      Users
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Last 30 days
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Apr 21, 2025
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    245 KB
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button size="sm">View</Button>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    Diagnosis Outcomes
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs font-medium text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400">
                      Diagnoses
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Last 30 days
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Apr 20, 2025
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    180 KB
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button size="sm">View</Button>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    Appointment Analytics
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
                      Appointments
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Last 30 days
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Apr 19, 2025
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    205 KB
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button size="sm">View</Button>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    System Performance
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                      System
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Last 30 days
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    Apr 18, 2025
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    310 KB
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button size="sm">View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;