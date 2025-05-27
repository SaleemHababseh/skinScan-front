import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Filter, Search, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import useDoctorStore from '../../store/doctor-store';
import { formatDate } from '../../utils';

const DoctorAppointments = () => {
  const { user } = useAuthStore();
  const { appointments, loadDoctorData, updateAppointment, isLoading } = useDoctorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('day'); // day, week, month
  
  useEffect(() => {
    if (user) {
      loadDoctorData(user.id);
    }
  }, [user, loadDoctorData]);
  
  // Get all dates in the current month
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  
  // Get days for calendar view
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  
  // Navigate calendar
  const navigateCalendar = (direction) => {
    const newDate = new Date(selectedDate);
    
    if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    
    setSelectedDate(newDate);
  };
  
  // Filter appointments based on search term, filter status, and selected date
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.dateTime);
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (appointment.notes && appointment.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         appointment.status === filterStatus;
    
    let matchesDate = true;
    
    if (calendarView === 'day') {
      matchesDate = appointmentDate.toDateString() === selectedDate.toDateString();
    } else if (calendarView === 'week') {
      // Get start of week (Sunday)
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      
      // Get end of week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      matchesDate = appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    } else if (calendarView === 'month') {
      matchesDate = appointmentDate.getMonth() === selectedDate.getMonth() && 
                   appointmentDate.getFullYear() === selectedDate.getFullYear();
    }
    
    return matchesSearch && matchesFilter && matchesDate;
  }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  
  // Handle appointment status update
  const handleUpdateStatus = (appointmentId, status) => {
    updateAppointment(appointmentId, { status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Appointments</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your patient appointments</p>
      </div>
      
      {/* Calendar Navigation */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center rounded-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <button
              className={`px-3 py-1.5 text-sm ${calendarView === 'day' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
              onClick={() => setCalendarView('day')}
            >
              Day
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${calendarView === 'week' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
              onClick={() => setCalendarView('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${calendarView === 'month' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
              onClick={() => setCalendarView('month')}
            >
              Month
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => navigateCalendar(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {calendarView === 'day' && selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {calendarView === 'week' && `${new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - selectedDate.getDay()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - selectedDate.getDay() + 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {calendarView === 'month' && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => navigateCalendar(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input 
              type="text"
              placeholder="Search patient..." 
              className="w-52 pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Appointments List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {calendarView === 'day' && (
            <div className="relative">
              <div className="border-l border-neutral-200 pl-4 dark:border-neutral-800">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-4 mt-3 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                    <div className="py-6 text-xs text-neutral-500 dark:text-neutral-400">
                      {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                    </div>
                    
                    {filteredAppointments
                      .filter(apt => new Date(apt.dateTime).getHours() === i)
                      .map(appointment => (
                        <Card key={appointment.id} className="mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`h-full w-1 ${
                                appointment.status === 'confirmed' ? 'bg-success-500' :
                                appointment.status === 'pending' ? 'bg-warning-500' : 
                                appointment.status === 'completed' ? 'bg-info-500' : 'bg-neutral-300 dark:bg-neutral-700'
                              }`}></div>
                              <div className="p-3">
                                <div className="flex items-center">
                                  <Avatar 
                                    src={appointment.patientAvatar}
                                    alt={appointment.patientName}
                                    fallback={appointment.patientName.charAt(0)}
                                    className="h-10 w-10"
                                  />
                                  <div className="ml-3">
                                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                                      {appointment.patientName}
                                    </h3>
                                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                                      <Clock className="mr-1 h-3 w-3" />
                                      <span>{formatDate(appointment.dateTime, true)}</span>
                                    </div>
                                  </div>
                                </div>
                                {appointment.notes && (
                                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    {appointment.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 pr-3">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                appointment.status === 'confirmed' ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                                appointment.status === 'pending' ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                                appointment.status === 'completed' ? 'bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-400' :
                                'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              
                              <div className="flex space-x-1">
                                {appointment.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-7 w-7 rounded-full text-success-600 hover:bg-success-50 hover:text-success-700 dark:text-success-400 dark:hover:bg-success-900/30"
                                      onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-7 w-7 rounded-full text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                      onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {appointment.status === 'confirmed' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-7 w-7 rounded-full text-info-600 hover:bg-info-50 hover:text-info-700 dark:text-info-400 dark:hover:bg-info-900/30"
                                    onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {calendarView === 'week' && (
            <Card className="overflow-hidden">
              <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - date.getDay() + i);
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <div key={i} className="border-r border-neutral-200 p-2 text-center last:border-r-0 dark:border-neutral-800">
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{day}</div>
                      <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                        isToday ? 'bg-primary-500 text-white' : ''
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-7">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((_, dayIndex) => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - date.getDay() + dayIndex);
                  
                  const dayAppointments = filteredAppointments.filter(apt => 
                    new Date(apt.dateTime).toDateString() === date.toDateString()
                  );
                  
                  return (
                    <div key={dayIndex} className="min-h-[200px] border-r border-neutral-200 p-2 last:border-r-0 dark:border-neutral-800">
                      {dayAppointments.map(appointment => (
                        <Card key={appointment.id} className="mb-2 p-2">
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${
                              appointment.status === 'confirmed' ? 'bg-success-500' :
                              appointment.status === 'pending' ? 'bg-warning-500' : 
                              appointment.status === 'completed' ? 'bg-info-500' : 'bg-neutral-300 dark:bg-neutral-700'
                            }`}></div>
                            <div className="flex-1 text-xs font-medium">{appointment.patientName}</div>
                          </div>
                          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {new Date(appointment.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </Card>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
          
          {calendarView === 'month' && (
            <Card className="overflow-hidden">
              <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={i} className="p-2 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7">
                {Array(new Date(year, month, 1).getDay()).fill(null).map((_, i) => (
                  <div key={`empty-start-${i}`} className="h-24 border-b border-r border-neutral-200 p-2 text-center text-sm text-neutral-300 dark:border-neutral-800 dark:text-neutral-700"></div>
                ))}
                
                {daysInMonth.map((date, i) => {
                  const isToday = new Date().toDateString() === date.toDateString();
                  const dayAppointments = filteredAppointments.filter(apt => 
                    new Date(apt.dateTime).toDateString() === date.toDateString()
                  );
                  
                  return (
                    <div 
                      key={i} 
                      className={`h-24 border-b border-r border-neutral-200 p-1 dark:border-neutral-800 ${
                        isToday ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <div className={`mb-1 flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        isToday ? 'bg-primary-500 text-white' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      {dayAppointments.length > 0 && (
                        <div className="space-y-1 overflow-y-auto">
                          {dayAppointments.length <= 2 ? (
                            dayAppointments.map(appointment => (
                              <div 
                                key={appointment.id}
                                className={`rounded-sm p-1 text-xs ${
                                  appointment.status === 'confirmed' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' :
                                  appointment.status === 'pending' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300' : 
                                  'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                              >
                                {appointment.patientName}
                              </div>
                            ))
                          ) : (
                            <>
                              {dayAppointments.slice(0, 1).map(appointment => (
                                <div 
                                  key={appointment.id}
                                  className={`rounded-sm p-1 text-xs ${
                                    appointment.status === 'confirmed' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' :
                                    appointment.status === 'pending' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300' : 
                                    'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                                  }`}
                                >
                                  {appointment.patientName}
                                </div>
                              ))}
                              <div className="rounded-sm bg-neutral-100 p-1 text-center text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                +{dayAppointments.length - 1} more
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {Array(6 - new Date(year, month + 1, 0).getDay()).fill(null).map((_, i) => (
                  <div key={`empty-end-${i}`} className="h-24 border-b border-r border-neutral-200 p-2 text-center text-sm text-neutral-300 dark:border-neutral-800 dark:text-neutral-700"></div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Calendar className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
            No appointments found
          </p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'You have no appointments scheduled for this time period'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DoctorAppointments;