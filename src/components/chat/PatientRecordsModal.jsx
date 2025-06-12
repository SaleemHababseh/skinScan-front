import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import PatientRecords from './PatientRecords';

const PatientRecordsModal = ({ isOpen, onClose, patientId, token, patientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            Patient Records
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <PatientRecords 
            patientId={patientId}
            token={token}
            patientName={patientName}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientRecordsModal;
