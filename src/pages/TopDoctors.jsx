import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import useUserStore from '../store/user-store';

const TopDoctors = () => {
  const { 
    topRatedDoctors, 
    isLoading, 
    error, 
    fetchTopRatedDoctors, 
    createUserAppointment,
    rateDoctorById,
    clearError 
  } = useUserStore();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchTopRatedDoctors();
  }, [fetchTopRatedDoctors]);

  const handleBookAppointment = async (doctorId) => {
    try {
      await createUserAppointment(doctorId);
      alert('Appointment booked successfully!');
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert('Error booking appointment: ' + err.message);
    }
  };

  const handleRateDoctor = async () => {
    if (selectedDoctor && rating > 0) {
      try {
        await rateDoctorById(selectedDoctor.id, rating);
        setShowRatingModal(false);
        setSelectedDoctor(null);
        setRating(0);
        // Refresh the list
        fetchTopRatedDoctors();
        alert('Rating submitted successfully!');
      } catch (err) {
        console.error('Error rating doctor:', err);
        alert('Error rating doctor: ' + err.message);
      }
    }
  };

  const openRatingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedDoctor(null);
    setRating(0);
    clearError();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading top doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Top Rated Doctors</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          Browse and connect with our highest-rated medical professionals
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topRatedDoctors && topRatedDoctors.length > 0 ? (
          topRatedDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={doctor.profilePicture}
                    alt={`Dr. ${doctor.f_name} ${doctor.l_name}`}
                    fallback={`${doctor.f_name?.[0] || 'D'}${doctor.l_name?.[0] || 'R'}`}
                    className="h-16 w-16"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Dr. {doctor.f_name} {doctor.l_name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {doctor.specialization || 'General Practitioner'}
                    </p>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {doctor.rating?.toFixed(1) || 'No rating'} ({doctor.totalRatings || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {doctor.bio && (
                  <div className="mt-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                      {doctor.bio}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openRatingModal(doctor)}
                    className="flex-1"
                  >
                    <Star className="mr-1 h-4 w-4" />
                    Rate
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBookAppointment(doctor.id)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Calendar className="mr-1 h-4 w-4" />
                    Book
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <User className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No doctors found</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              There are no top-rated doctors available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Rate Dr. {selectedDoctor.f_name} {selectedDoctor.l_name}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              How would you rate your experience with this doctor?
            </p>

            <div className="mt-4 flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <Button variant="outline" onClick={closeRatingModal} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleRateDoctor}
                disabled={rating === 0 || isLoading}
                className="flex-1"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopDoctors;
