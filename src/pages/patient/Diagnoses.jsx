import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Filter, Search, Calendar, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuthStore from '../../store/auth-store';
import { formatDate } from '../../utils';

const PatientDiagnoses = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  // Placeholder for skin images - will be integrated with API later
  const [skinImages] = useState([]);
  
  useEffect(() => {
    // Future: Load patient diagnoses/skin images from API
    if (user?.id) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [user?.id]);
  
  // Filter diagnoses based on search term and filter status
  const filteredDiagnoses = (skinImages && Array.isArray(skinImages)) ? skinImages.filter(image => {
    const matchesSearch = image.bodyPart?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         image.concernDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         image.diagnosisStatus === filterStatus;
                         
    return matchesSearch && matchesFilter;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Diagnoses</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">View and track all your skin analyses</p>
        </div>
        <Link to="/patient/upload">
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Upload New Image
          </Button>
        </Link>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input 
            type="text"
            placeholder="Search diagnoses..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <select 
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      
      {/* Diagnoses List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredDiagnoses.length > 0 ? (
        <div className="space-y-4">
          {filteredDiagnoses.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="h-48 w-full sm:h-auto sm:w-48">
                  <img
                    src={image.imageUrl}
                    alt={`Skin condition on ${image.bodyPart}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{image.bodyPart}</h3>
                        <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          image.diagnosisStatus === 'completed'
                            ? 'bg-success-50 text-success-500 dark:bg-success-900/30 dark:text-success-500'
                            : 'bg-warning-50 text-warning-500 dark:bg-warning-900/30 dark:text-warning-500'
                        }`}>
                          {image.diagnosisStatus === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{formatDate(image.uploadDate)}</span>
                      </div>
                    </div>
                    {image.doctorName && (
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Reviewed by</span>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{image.doctorName}</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                    {image.concernDescription}
                  </p>
                  
                  {image.diagnosisResult && (
                    <div className="mt-3 rounded-md bg-neutral-50 p-3 dark:bg-neutral-800/50">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Diagnosis:</h4>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {image.diagnosisResult}
                      </p>
                    </div>
                  )}
                  
                  {image.recommendation && (
                    <div className="mt-3 rounded-md bg-primary-50 p-3 dark:bg-primary-900/20">
                      <h4 className="font-medium text-primary-900 dark:text-primary-300">Recommendation:</h4>
                      <p className="mt-1 text-sm text-primary-800 dark:text-primary-400">
                        {image.recommendation}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" className="flex items-center">
                      View Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">No diagnoses found</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Upload your first skin image for analysis'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link to="/patient/upload" className="mt-4">
              <Button>Upload Image</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
};

export default PatientDiagnoses;