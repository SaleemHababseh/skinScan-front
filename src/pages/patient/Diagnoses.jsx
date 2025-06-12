import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';
import { formatDate } from '../../utils';
import { getUserRecords } from '../../api/users/getUserRecords';

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

const PatientDiagnoses = () => {
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserRecords = async () => {
      if (user?.id && token) {
        setIsLoading(true);
        setError(null);
        try {          const records = await getUserRecords(token);
          // Transform the API response to match the component's expected format
          const transformedData = records.map(record => ({
            id: record.records_info.img_id,
            bodyPart: 'Skin Analysis', // Default since not provided in API
            concernDescription: `Analysis result: ${getDiagnosisFullName(record.records_info.test_result)}`,
            diagnosisStatus: 'completed',
            uploadDate: record.records_info.test_date,
            diagnosisResult: record.records_info.test_result,
            imageUrl: `/api/placeholder-skin-image.jpg` // Placeholder since image URL not provided
          }));
          setDiagnoses(transformedData);
        } catch (err) {
          console.error('Failed to fetch user records:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserRecords();
  }, [user?.id, token]);
  // Helper function to provide full names for diagnosis codes
  const getDiagnosisFullName = (testResult) => {
    switch (testResult.toLowerCase()) {
      case 'bcc':
        return 'Basal Cell Carcinoma';
      case 'nev':
        return 'Nevus (Mole)';
      case 'mel':
        return 'Melanoma';
      default:
        return testResult.toUpperCase();
    }  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Diagnoses</h1>
          <p className="mt-1 text-neutral-600">View and track all your skin analyses</p>
        </div>
        <Link to="/patient/upload">
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Upload New Image
          </Button>
        </Link>      </div>
      
      {/* Diagnoses List */}
      {error ? (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-red-400" />
          <p className="mt-4 text-lg font-medium text-red-600">Error loading diagnoses</p>
          <p className="mt-1 text-neutral-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>      ) : diagnoses.length > 0 ? (
        <div className="space-y-4">
          {diagnoses.map((diagnosis) => (
            <Card key={diagnosis.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="h-48 w-full sm:h-auto sm:w-48 bg-neutral-100 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-neutral-400" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-neutral-900">{diagnosis.bodyPart}</h3>
                        <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          diagnosis.diagnosisStatus === 'completed'
                            ? 'bg-success-50 text-success-500'
                            : 'bg-warning-50 text-warning-500'
                        }`}>
                          {diagnosis.diagnosisStatus === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-neutral-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{safeFormatDate(diagnosis.uploadDate)}</span>
                      </div>
                    </div>
                    {diagnosis.doctorName && (
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs text-neutral-500">Reviewed by</span>
                        <p className="font-medium text-neutral-900">{diagnosis.doctorName}</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-3 text-sm text-neutral-600">
                    {diagnosis.concernDescription}
                  </p>
                    {diagnosis.diagnosisResult && (
                    <div className="mt-3 rounded-md bg-neutral-50 p-3">
                      <h4 className="font-medium text-neutral-900">Diagnosis:</h4>
                      <p className="mt-1 text-sm text-neutral-600">
                        {diagnosis.diagnosisResult.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900">No diagnoses found</p>
          <p className="mt-1 text-neutral-600">
            Upload your first skin image for analysis
          </p>
          <Link to="/patient/upload" className="mt-4">
            <Button>Upload Image</Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default PatientDiagnoses;