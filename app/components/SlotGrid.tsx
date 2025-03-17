import React, { useState } from 'react';
import { AvailableSlot } from './types';
import SlotCard from './SlotCard';
import { motion } from 'framer-motion';

interface SlotGridProps {
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
}

const SlotGrid: React.FC<SlotGridProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 12; // Reduced for better visibility

  // Group slots by time period
  const groupedSlots = slots.reduce((acc, slot) => {
    const hour = parseInt(slot.time_slot.split(':')[0]);
    let period = '';
    
    if (hour < 12) {
      period = 'Morning (Before 12 PM)';
    } else if (hour < 17) {
      period = 'Afternoon (12 PM - 5 PM)';
    } else {
      period = 'Evening (After 5 PM)';
    }

    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  // Calculate pagination
  const startIndex = (currentPage - 1) * slotsPerPage;
  const endIndex = startIndex + slotsPerPage;
  
  // Flatten grouped slots for pagination
  const allSlots = Object.values(groupedSlots).flat();
  const currentSlots = allSlots.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allSlots.length / slotsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {Object.entries(groupedSlots).map(([period, periodSlots]) => (
        <div key={period} className="space-y-3">
          <h4 className="text-sm font-sans text-text-primary">{period}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {periodSlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={selectedSlot?.id === slot.id}
                onClick={() => !slot.booked && onSelectSlot(slot)}
              />
            ))}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`
              px-4 py-2 rounded-default font-sans text-sm transition-all
              ${currentPage === 1
                ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                : 'bg-background border border-primary text-primary hover:bg-background/80'
              }
            `}
          >
            Previous
          </button>
          <span className="text-sm font-body text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`
              px-4 py-2 rounded-default font-sans text-sm transition-all
              ${currentPage === totalPages
                ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                : 'bg-background border border-primary text-primary hover:bg-background/80'
              }
            `}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SlotGrid;
