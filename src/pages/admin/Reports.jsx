import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Filter, RefreshCw, FileText, X, Eye } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import { getReportsByStatus } from '../../api/admin';

const AdminReports = () => {
  const { user, token } = useAuthStore();
  const [reportStatus, setReportStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [detailedReports, setDetailedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportCounts, setReportCounts] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
    total: 0
  });// Load reports data from API
  const loadReportsData = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // Get reports by status with individual error handling
      const reportPromises = [
        getReportsByStatus('pending', token).catch(error => {
          console.error('Error loading pending reports:', error);
          return [];
        }),
        getReportsByStatus('in_progress', token).catch(error => {
          console.error('Error loading in_progress reports:', error);
          return [];
        }),
        getReportsByStatus('resolved', token).catch(error => {
          console.error('Error loading resolved reports:', error);
          return [];
        })
      ];

      const [pendingReports, inProgressReports, resolvedReports] = await Promise.allSettled(reportPromises).then(results => 
        results.map(result => result.status === 'fulfilled' ? result.value : [])
      );

      // Update report counts
      setReportCounts({
        pending: Array.isArray(pendingReports) ? pendingReports.length : 0,
        in_progress: Array.isArray(inProgressReports) ? inProgressReports.length : 0,
        resolved: Array.isArray(resolvedReports) ? resolvedReports.length : 0,
        total: (Array.isArray(pendingReports) ? pendingReports.length : 0) + 
               (Array.isArray(inProgressReports) ? inProgressReports.length : 0) + 
               (Array.isArray(resolvedReports) ? resolvedReports.length : 0)
      });

      // Set detailed reports based on current filter
      let currentReports = [];
      if (reportStatus === 'pending') {
        currentReports = pendingReports;
      } else if (reportStatus === 'in_progress') {
        currentReports = inProgressReports;
      } else if (reportStatus === 'resolved') {
        currentReports = resolvedReports;
      } else {
        // Combine all reports
        currentReports = [
          ...(Array.isArray(pendingReports) ? pendingReports : []),
          ...(Array.isArray(inProgressReports) ? inProgressReports : []),
          ...(Array.isArray(resolvedReports) ? resolvedReports : [])
        ];
      }
      
      setDetailedReports(Array.isArray(currentReports) ? currentReports : []);

    } catch (error) {
      console.error('Error loading reports data:', error);
      // Set empty arrays as fallback
      setReportCounts({
        pending: 0,
        in_progress: 0,
        resolved: 0,
        total: 0
      });
      setDetailedReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, reportStatus]);
  useEffect(() => {
    // Load reports from API
    if (user?.id && token) {
      loadReportsData();
    }
  }, [user?.id, token, loadReportsData]);
    // Handle report refresh
  const handleRefreshReport = () => {
    loadReportsData();
  };

  // Handle view report details
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };
  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };  // Modal component using React Portal
  const ReportModal = () => {
    // Handle escape key press and body scroll
    useEffect(() => {
      if (!isModalOpen) return;

      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          handleCloseModal();
        }
      };

      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    });

    if (!isModalOpen || !selectedReport) return null;

    // Handle backdrop click
    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        handleCloseModal();
      }
    };

    return createPortal(
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      >
        <div className="relative mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Report Details #{selectedReport.report_id}
            </h3>
            <button
              onClick={handleCloseModal}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Reporter
                </label>
                <p className="mt-1 text-sm text-neutral-900">
                  User #{selectedReport.reporter_id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Reported User
                </label>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedReport.reported_user_id ? `User #${selectedReport.reported_user_id}` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Report Type
                </label>
                <p className="mt-1">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                    {selectedReport.report_type ? selectedReport.report_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Status
                </label>
                <p className="mt-1">                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedReport.status === 'pending' 
                      ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                      : selectedReport.status === 'in_progress' 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : selectedReport.status === 'resolved' 
                          ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                          : 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}>
                    {selectedReport.status ? selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1).replace('_', ' ') : 'Unknown'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Created Date
                </label>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">
                Description
              </label>
              <div className="mt-2 rounded-lg bg-neutral-50 p-4">
                <p className="text-sm text-neutral-900 whitespace-pre-wrap">
                  {selectedReport.description || 'No description provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">System Reports</h1>
          <p className="mt-1 text-neutral-600">View and manage system reports</p>
        </div>
        <Button variant="outline" className="flex items-center" onClick={handleRefreshReport}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      {/* Report Status Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">Report Status:</span>
        </div>
        <select
          className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm"
          value={reportStatus}
          onChange={(e) => setReportStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Report Counts Summary */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card className="bg-neutral-50">
            <div>
              <h3 className="text-sm font-medium text-neutral-700">Total Reports</h3>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                {reportCounts.total}
              </p>
            </div>
          </Card>
          
          <Card className="bg-warning-50">
            <div>
              <h3 className="text-sm font-medium text-warning-700">Pending</h3>
              <p className="mt-1 text-2xl font-bold text-warning-900">
                {reportCounts.pending}
              </p>
            </div>
          </Card>
          
          <Card className="bg-blue-50">
            <div>
              <h3 className="text-sm font-medium text-blue-700">In Progress</h3>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {reportCounts.in_progress}
              </p>
            </div>
          </Card>
          
          <Card className="bg-success-50">
            <div>
              <h3 className="text-sm font-medium text-success-700">Resolved</h3>
              <p className="mt-1 text-2xl font-bold text-success-900">
                {reportCounts.resolved}
              </p>
            </div>
          </Card>
        </div>
      )}      
      {/* Detailed Reports Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Detailed Reports {reportStatus !== 'all' && `(${reportStatus.charAt(0).toUpperCase() + reportStatus.slice(1)})`}
          </h2>
          <p className="text-sm text-neutral-600">
            {detailedReports.length} report{detailedReports.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <Card className="overflow-hidden">
          {detailedReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">                <thead className="bg-neutral-50">
                  <tr className="border-b border-neutral-200 text-left text-sm font-medium text-neutral-500">
                    <th className="whitespace-nowrap px-4 py-3">Report ID</th>
                    <th className="whitespace-nowrap px-4 py-3">Reporter</th>
                    <th className="whitespace-nowrap px-4 py-3">Reported User</th>
                    <th className="whitespace-nowrap px-4 py-3">Report Type</th>
                    <th className="whitespace-nowrap px-4 py-3">Description</th>
                    <th className="whitespace-nowrap px-4 py-3">Status</th>
                    <th className="whitespace-nowrap px-4 py-3">Created Date</th>
                    <th className="whitespace-nowrap px-4 py-3">Actions</th>
                  </tr>
                </thead><tbody className="divide-y divide-neutral-200">                  {detailedReports.map((report, index) => (
                    <tr key={report.report_id || index} className="text-sm">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900">
                        #{report.report_id || `REPORT-${index + 1}`}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                        User #{report.reporter_id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                        {report.reported_user_id ? `User #${report.reported_user_id}` : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                          {report.report_type ? report.report_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">
                        {report.description || 'No description'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          report.status === 'pending' 
                            ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                            : report.status === 'in_progress' 
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                              : report.status === 'resolved' 
                                ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                                : 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('_', ' ') : 'Unknown'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                        {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                      </td>                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewReport(report)}
                            className="flex items-center"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <FileText className="h-8 w-8 text-neutral-400" />
              <p className="mt-2 text-sm font-medium text-neutral-900">
                No reports found
              </p>
              <p className="text-xs text-neutral-600">
                {reportStatus !== 'all' 
                  ? `No reports with status "${reportStatus}" found`
                  : 'No reports available for the selected criteria'
                }
              </p>
            </div>          )}
        </Card>
      </div>

      {/* Report Details Modal using React Portal */}
      <ReportModal />
    </div>
  );
};

export default AdminReports;