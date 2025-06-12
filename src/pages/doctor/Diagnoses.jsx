import React, { useEffect, useState } from 'react';
import { FileText, Search, Filter, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuthStore from '../../store/auth-store';
import useDoctorStore from '../../store/doctor-store';
import { formatDate } from '../../utils';

// Helper function to safely format dates
const safeFormatDate = (dateValue) => {
  if (!dateValue) return 'No date provided';
  
  try {
    return formatDate(dateValue);
  } catch (error) {
    console.warn('Date formatting error:', error, 'for value:', dateValue);
    return 'Invalid date';
  }
};

// Helper function to get full diagnosis name
const getDiagnosisFullName = (testResult) => {
  const diagnosisMap = {
    'bcc': 'Basal Cell Carcinoma',
    'mel': 'Melanoma', 
    'nev': 'Nevus (Mole)',
    'bkl': 'Benign Keratosis-like Lesion',
    'akiec': 'Actinic Keratosis',
    'vasc': 'Vascular Lesion',
    'df': 'Dermatofibroma'
  };
  
  return diagnosisMap[testResult?.toLowerCase()] || testResult?.toUpperCase() || 'Unknown';
};

const DoctorDiagnoses = () => {
  const { user } = useAuthStore();
  const { 
    patientRecords,
    loadPatientRecords,
    isLoading
  } = useDoctorStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // Load patient records on component mount
    if (user?.id) {
      loadPatientRecords();
    }
  }, [user?.id, loadPatientRecords]);

  // Filter diagnoses based on search term and status
  const filteredDiagnoses = patientRecords.filter(record => {
    // Handle the actual API data structure
    const recordInfo = record.records_info || record;
    const testResult = recordInfo.test_result || record.testResult || '';
    
    // Search by test result/diagnosis type only
    const matchesSearch = searchTerm === '' || 
      testResult.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For status, we'll consider all records as 'completed' since they have test results
    const status = 'completed';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group diagnoses by status
  const groupedDiagnoses = {
    completed: filteredDiagnoses, // All records with test results are considered completed
    pending: [], // No pending records in this data structure
    urgent: [] // No urgent classification in this data structure
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Your Diagnoses</h1>
        <p className="mt-1 text-neutral-600">Review and manage medical records and diagnoses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
   
        <Card className="bg-neutral-50">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-neutral-200 p-3">
              <FileText className="h-6 w-6 text-neutral-700" />
            </div>
            <div>
              <p className="text-sm text-neutral-700">Total Records</p>
              <p className="text-2xl font-bold text-neutral-900">{patientRecords.length}</p>
            </div>
          </div>
        </Card>
      </div>

    
      {/* Diagnoses List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredDiagnoses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDiagnoses.map((diagnosis) => {
            // Handle the actual API data structure
            const recordInfo = diagnosis.records_info || diagnosis;
            const testResult = recordInfo.test_result || diagnosis.testResult;
            const testDate = recordInfo.test_date || diagnosis.testDate;
            const imgId = recordInfo.img_id || diagnosis.imgId;
            
            return (
              <Card 
                key={imgId || diagnosis.id}
                className="hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
              >
                <div className="flex flex-col">
                  {/* Header with status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">
                        Test Date: {safeFormatDate(testDate)}
                      </h3>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-50 text-success-500">
                      Completed
                    </span>
                  </div>
                  
                  {/* Image placeholder */}
                  <div className="h-32 bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-neutral-400 mx-auto mb-1" />
                      <span className="text-xs text-neutral-500">Image ID: {imgId}</span>
                    </div>
                  </div>
                  
                  {/* Diagnosis info */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-neutral-700">
                        Diagnosis: {getDiagnosisFullName(testResult)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Result Code: {testResult?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex h-40 flex-col items-center justify-center text-center">
          <FileText className="h-10 w-10 text-neutral-400" />
          <p className="mt-2 text-neutral-600">No diagnoses found</p>
          <p className="text-sm text-neutral-500">
            Patient records will appear here when uploaded
          </p>
        </Card>
      )}
    </div>
  );
};

export default DoctorDiagnoses;
