// Mock users for the doctor and admin APIs
export const mockUsers = [
  {
    id: '1',
    email: 'patient@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    email: 'doctor@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'doctor',
    specialization: 'Dermatology',
    status: 'active',
    createdAt: '2023-11-05T14:20:00Z',
    profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    createdAt: '2023-10-01T09:00:00Z',
    profileImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    email: 'patient2@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Wilson',
    role: 'patient',
    status: 'active',
    createdAt: '2024-02-20T15:45:00Z',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '5',
    email: 'doctor2@example.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'doctor',
    specialization: 'Dermatology',
    status: 'active',
    createdAt: '2023-12-10T11:30:00Z',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Mock patients for doctor API
export const mockPatients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    gender: 'Male',
    email: 'patient@example.com',
    phone: '555-123-4567',
    medicalHistory: [
      { condition: 'Eczema', diagnosedDate: '2022-05-10', status: 'Ongoing' },
      { condition: 'Sunburn', diagnosedDate: '2023-07-20', status: 'Resolved' }
    ],
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    firstName: 'Jane',
    lastName: 'Wilson',
    age: 28,
    gender: 'Female',
    email: 'patient2@example.com',
    phone: '555-987-6543',
    medicalHistory: [
      { condition: 'Psoriasis', diagnosedDate: '2021-09-15', status: 'Ongoing' },
      { condition: 'Acne', diagnosedDate: '2023-02-05', status: 'Improving' }
    ],
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Mock appointments
export const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    dateTime: '2024-05-20T10:00:00Z',
    status: 'confirmed',
    imageId: '1',
    notes: 'Follow-up for eczema diagnosis',
    createdAt: '2024-05-11T08:30:00Z'
  },
  {
    id: '2',
    patientId: '4',
    doctorId: '2',
    patientName: 'Jane Wilson',
    doctorName: 'Dr. Sarah Smith',
    dateTime: '2024-05-21T14:30:00Z',
    status: 'pending',
    imageId: '3',
    notes: 'Initial consultation for psoriasis flare-up',
    createdAt: '2024-05-12T16:45:00Z'
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '5',
    patientName: 'John Doe',
    doctorName: 'Dr. Michael Johnson',
    dateTime: '2024-05-25T09:15:00Z',
    status: 'confirmed',
    imageId: '2',
    notes: 'Second opinion on mole diagnosis',
    createdAt: '2024-05-13T11:20:00Z'
  }
];

// Mock medical reports
export const mockReports = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    imageId: '1',
    diagnosis: 'Moderate Eczema',
    treatment: 'Prescription-strength hydrocortisone cream, twice daily application for 2 weeks.',
    notes: 'Patient should avoid common triggers like harsh soaps and hot water. Follow-up in 3 weeks to assess treatment effectiveness.',
    createdAt: '2024-05-11T11:30:00Z'
  },
  {
    id: '2',
    patientId: '4',
    doctorId: '5',
    imageId: '3',
    diagnosis: 'Psoriasis flare-up',
    treatment: 'Topical corticosteroid cream and oral antihistamine for itching.',
    notes: 'Recommend lifestyle changes including stress reduction techniques and avoiding known triggers.',
    createdAt: '2024-04-22T13:45:00Z'
  }
];

// Mock system logs for admin
export const mockSystemLogs = [
  {
    id: '1',
    userId: '1',
    action: 'LOGIN',
    ipAddress: '192.168.1.105',
    timestamp: '2024-05-15T08:32:10Z',
    details: 'User login successful'
  },
  {
    id: '2',
    userId: '1',
    action: 'UPLOAD_IMAGE',
    ipAddress: '192.168.1.105',
    timestamp: '2024-05-15T08:35:22Z',
    details: 'User uploaded skin image for analysis'
  },
  {
    id: '3',
    userId: '2',
    action: 'LOGIN',
    ipAddress: '192.168.1.200',
    timestamp: '2024-05-15T09:10:05Z',
    details: 'Doctor login successful'
  },
  {
    id: '4',
    userId: '2',
    action: 'VIEW_PATIENT',
    ipAddress: '192.168.1.200',
    timestamp: '2024-05-15T09:12:33Z',
    details: 'Doctor viewed patient profile (ID: 1)'
  },
  {
    id: '5',
    userId: '3',
    action: 'LOGIN',
    ipAddress: '192.168.1.50',
    timestamp: '2024-05-15T10:00:12Z',
    details: 'Admin login successful'
  },
  {
    id: '6',
    userId: '3',
    action: 'SYSTEM_CONFIG',
    ipAddress: '192.168.1.50',
    timestamp: '2024-05-15T10:05:45Z',
    details: 'Admin modified system settings'
  }
];