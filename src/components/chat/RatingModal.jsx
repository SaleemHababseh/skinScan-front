import React, { useState } from 'react';
import Button from '../ui/Button';
import { X, Star } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, onSubmit, doctorName }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      onClose();
      setRating(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Rate Dr. {doctorName}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-neutral-600 mb-4">
            How would you rate your experience with this doctor?
          </p>
          
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {rating > 0 && (
            <p className="text-center mt-2 text-sm text-neutral-600">
              {rating} star{rating !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            className="flex-1"
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
