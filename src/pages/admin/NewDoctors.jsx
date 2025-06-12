import React, { useEffect, useState, useCallback } from 'react';
import { UserCheck, UserX, Eye, Download, RefreshCw, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import { getNotAcceptedDoctors, acceptDoctor } from '../../api/admin';
import { baseURL } from '../../api/config';

const NewDoctors = () => {
  const { token } = useAuthStore();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [loadingCV, setLoadingCV] = useState(false);

  // Load pending doctors
  const loadPendingDoctors = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const doctors = await getNotAcceptedDoctors(false, token);
      setPendingDoctors(Array.isArray(doctors) ? doctors : []);
    } catch (error) {
      console.error('Error loading pending doctors:', error);
      setPendingDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Handle doctor acceptance
  const handleAcceptDoctor = async (doctor) => {
    const doctorId = (typeof doctor === 'object') ? (doctor.doctor_id || doctor.id) : doctor;
    if (window.confirm('Are you sure you want to accept this doctor?')) {
      try {
        await acceptDoctor(doctorId, token);
        // Reload the list
        loadPendingDoctors();
      } catch (error) {
        console.error('Error accepting doctor:', error);
        alert('Failed to accept doctor');
      }
    }
  };
  // Handle CV viewing
  const handleViewCV = async (doctor) => {
    setSelectedDoctor(doctor);
    setLoadingCV(true);
    setShowCVModal(true);
    
    try {
      const doctorId = doctor.doctor_id || doctor.id;
      const response = await fetch(`${baseURL}admin/doctor-info/get-doctor-cv/${doctorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load CV');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCvData(url);
    } catch (error) {
      console.error('Error loading CV:', error);
      setCvData(null);
    } finally {
      setLoadingCV(false);
    }
  };

  // Handle CV download
  const handleDownloadCV = async (doctor) => {
    try {
      const doctorId = (typeof doctor === 'object') ? (doctor.doctor_id || doctor.id) : doctor;
      const response = await fetch(`${baseURL}admin/doctor-info/get-doctor-cv/${doctorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `doctor_${doctorId}_cv.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download CV');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV');
    }
  };

  useEffect(() => {
    loadPendingDoctors();
  }, [token, loadPendingDoctors]);

  // Cleanup blob URL when modal is closed or component unmounts
  useEffect(() => {
    return () => {
      if (cvData && cvData.startsWith('blob:')) {
        URL.revokeObjectURL(cvData);
      }
    };
  }, [cvData]);

  // Add cleanup when modal is closed
  const handleCloseModal = () => {
    if (cvData && cvData.startsWith('blob:')) {
      URL.revokeObjectURL(cvData);
    }
    setCvData(null);
    setShowCVModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>          <h1 className="text-2xl font-bold">New Doctor Applications</h1>
          <p className="text-sm text-neutral-600">
            Review and approve doctor registrations
          </p>
        </div>
        <Button onClick={loadPendingDoctors} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Pending Doctors List */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : pendingDoctors.length > 0 ? (
        <div className="space-y-4">
          {pendingDoctors.map((doctor) => (
            <Card key={doctor.doctor_id || doctor.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar 
                    src={(doctor.doctor_id || doctor.id) ? `${baseURL}users/get/user-profile-picture?user_id=${doctor.doctor_id || doctor.id}` : null}
                    fallback={doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'D'}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {doctor.name || `${doctor.f_name || ''} ${doctor.l_name || ''}`.trim() || 'Unknown'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {doctor.email}
                    </p>
                    {doctor.phone && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Phone: {doctor.phone}
                      </p>
                    )}
                    {doctor.specialization && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Specialization: {doctor.specialization}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-100">
                        Pending Approval
                      </span>
                      {doctor.created_at && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Applied: {new Date(doctor.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewCV(doctor)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View CV
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadCV(doctor)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-yellow-500 hover:bg-green-600 text-white"
                    onClick={() => handleAcceptDoctor(doctor)}
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-40 flex-col items-center justify-center text-center dark:bg-neutral-800">
          <User className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No pending doctor applications</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">All doctors have been reviewed</p>
        </Card>
      )}

      {/* CV Modal */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
            <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  CV - {selectedDoctor?.name || `${selectedDoctor?.f_name || ''} ${selectedDoctor?.l_name || ''}`.trim()}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadCV(selectedDoctor)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCloseModal}>
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                {loadingCV ? (
                  <div className="flex h-96 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                  </div>
                ) : cvData ? (
                  <div className="space-y-4">
                    <div className="h-[70vh] bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-hidden">
                      <iframe
                        src={cvData}
                        className="w-full h-full"
                        title="Doctor CV Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-96 flex-col items-center justify-center">
                    <UserX className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">Failed to load CV</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 border-t border-neutral-200 dark:border-neutral-700 px-6 py-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button 
                  className="bg-success-600 hover:bg-success-700 text-white"
                  onClick={() => {
                    handleAcceptDoctor(selectedDoctor);
                    handleCloseModal();
                  }}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve Doctor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDoctors;
