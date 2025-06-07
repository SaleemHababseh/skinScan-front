import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  X,
  Check,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import useAuthStore from "../../store/auth-store";
import useAppointmentsStore from "../../store/appointments-store";
import { formatDate } from "../../utils";
const PatientAppointments = () => {
  const { token } = useAuthStore();  const {
    appointments,
    doctors,
    isLoading,
    fetchPatientAppointments,
    createNewAppointment,
    fetchTopRatedDoctors,
  } = useAppointmentsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: "",
  });

  useEffect(() => {
    if (token) {
      fetchPatientAppointments(token);
      fetchTopRatedDoctors(token);
    }
  }, [token, fetchPatientAppointments, fetchTopRatedDoctors]);

  // Helper function to determine if appointment is upcoming
  const isUpcoming = (appointmentDate) => {
    if (!appointmentDate) return false;
    const appointmentDay = new Date(appointmentDate);
    const today = new Date();
    
    // Set both dates to start of day for proper comparison
    appointmentDay.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // An appointment is upcoming if it's today or in the future
    return appointmentDay >= today;
  };

  // Filter and categorize appointments
  const filteredAppointments = (appointments || []).filter((appointment) => {
    const matchesSearch =
      (appointment.doctorname && appointment.doctorname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appointment.notes && appointment.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const upcomingAppointments = filteredAppointments
    .filter((appointment) => isUpcoming(appointment.appointment_date))
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  const pastAppointments = filteredAppointments
    .filter((appointment) => !isUpcoming(appointment.appointment_date))
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));  // Handle booking form submission
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.doctorId) {
      alert("Please select a doctor");
      return;
    }

    try {
      await createNewAppointment(newAppointment.doctorId, token);
      setNewAppointment({ doctorId: "" });
      setShowBookingForm(false);
      fetchPatientAppointments(token);
      alert("Appointment request sent successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment: " + error.message);
    }  };

  // Reusable appointment card component
  const AppointmentCard = ({ appointment, isUpcoming }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "confirmed":
          return "bg-success-50 text-success-500 dark:bg-success-900/30";
        case "pending":
          return "bg-warning-50 text-warning-500 dark:bg-warning-900/30";
        case "cancelled":
          return "bg-neutral-100 text-neutral-500 dark:bg-neutral-800";
        default:
          return "bg-neutral-100 text-neutral-500 dark:bg-neutral-800";
      }
    };

    const getBorderColor = (status) => {
      switch (status) {
        case "confirmed":
          return "border-l-success-500";
        case "pending":
          return "border-l-warning-500";
        case "cancelled":
          return "border-l-neutral-300 dark:border-l-neutral-700";
        default:
          return "border-l-primary-500";
      }
    };

    return (
      <Card
        key={appointment.appointment_id}
        className={`border-l-4 ${getBorderColor(appointment.status)} ${!isUpcoming ? 'opacity-80' : ''}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="mb-4 flex flex-1 items-start sm:mb-0">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isUpcoming 
                ? 'bg-primary-100 dark:bg-primary-900/30' 
                : 'bg-neutral-100 dark:bg-neutral-800'
            }`}>
              {isUpcoming ? (
                <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              ) : (
                <Check className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
              )}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className={`font-medium ${
                  isUpcoming 
                    ? 'text-neutral-900 dark:text-neutral-100' 
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}>
                  {appointment.doctorname}
                </h3>
                <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isUpcoming && appointment.status !== 'cancelled' 
                    ? getStatusColor(appointment.status)
                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                }`}>
                  {isUpcoming && appointment.status !== 'cancelled' 
                    ? (appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1) || 'Pending')
                    : 'Completed'
                  }
                </span>
              </div>
              <div className={`mt-1 flex items-center text-sm ${
                isUpcoming 
                  ? 'text-neutral-500 dark:text-neutral-400' 
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}>
                <Calendar className="mr-1 h-4 w-4" />
                <span>{formatDate(appointment.appointment_date)}</span>
              </div>
              {appointment.notes && (
                <p className={`mt-1 text-sm ${
                  isUpcoming 
                    ? 'text-neutral-600 dark:text-neutral-400' 
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            My Appointments
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Schedule and manage your appointments with specialists
          </p>
        </div>        <Button onClick={() => setShowBookingForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Request Appointment
        </Button>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <Card className="border-2 border-primary-100 dark:border-primary-900">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Request New Appointment
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowBookingForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>          <form onSubmit={handleBookAppointment} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="doctor"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Select Doctor
              </label>
              <select
                id="doctor"
                required
                value={newAppointment.doctorId}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    doctorId: e.target.value,
                  })
                }
                className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option value="">Select a specialist</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.name} (Rating: {doctor.rating_avg.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📝 <strong>Note:</strong> This will send an appointment request to the selected doctor. 
                The doctor will contact you to schedule the specific date and time.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send Appointment Request</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search appointments..."
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
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>      {/* Appointments List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Upcoming Appointments ({upcomingAppointments.length})
            </h2>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.appointment_id} appointment={appointment} isUpcoming={true} />
                ))}
              </div>
            ) : (
              <Card className="flex h-40 flex-col items-center justify-center text-center">
                <Calendar className="h-10 w-10 text-neutral-400" />
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  No upcoming appointments
                </p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowBookingForm(true)}
                >
                  Request Appointment
                </Button>
              </Card>
            )}
          </div>

          {/* Past Appointments */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Past Appointments ({pastAppointments.length})
            </h2>

            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.appointment_id} appointment={appointment} isUpcoming={false} />
                ))}
              </div>
            ) : (
              <Card className="flex h-32 items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No past appointments
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
