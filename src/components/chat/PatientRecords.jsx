import React, { useState, useEffect } from 'react';
import { getRecordsByUserId } from '../../api/admin/records';
import { Calendar, FileText, User, AlertCircle } from 'lucide-react';

const PatientRecords = ({ patientId, token, patientName }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!patientId || !token) return;
      
      setLoading(true);
      setError(null);
      try {
        const recordsData = await getRecordsByUserId(patientId, token);
        setRecords(Array.isArray(recordsData) ? recordsData : []);
      } catch (err) {
        console.error('Error fetching patient records:', err);
        setError('Failed to load patient records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId, token]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getTestResultBadgeColor = (result) => {
    if (!result) return 'bg-neutral-100 text-neutral-600';
    const lowerResult = result.toLowerCase();
    if (lowerResult.includes('positive') || lowerResult.includes('malignant') || lowerResult.includes('cancer')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    if (lowerResult.includes('negative') || lowerResult.includes('benign') || lowerResult.includes('nev') || lowerResult.includes('normal')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3 mb-2">
          <User className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Patient Records
          </h3>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {patientName || 'Unknown Patient'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {error ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <FileText className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No medical records found
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {records.length} record{records.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {records.map((record, index) => {
              const recordInfo = record.records_info || record;
              return (
                <div 
                  key={recordInfo.img_id || index} 
                  className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary-600" />
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        Record #{recordInfo.img_id || index + 1}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                      ID: {recordInfo.img_id || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {recordInfo.test_date ? formatDate(recordInfo.test_date) : 'Date not available'}
                      </span>
                    </div>
                    
                    {recordInfo.test_result && (
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTestResultBadgeColor(recordInfo.test_result)}`}>
                          Result: {recordInfo.test_result}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
