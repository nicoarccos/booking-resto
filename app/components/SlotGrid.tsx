import React, { useState } from 'react';
import { AvailableSlot } from './types'; // Import AvailableSlot

interface SlotGridProps {
  slots: AvailableSlot[];  // ✅ Change from Slot[] to AvailableSlot[]
  selectedSlot: AvailableSlot | null;  // ✅ Change from Slot to AvailableSlot
  onSelectSlot: (slot: AvailableSlot) => void;  // ✅ Change type
}

const SlotGrid: React.FC<SlotGridProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 30;

  // Calculate slots to display
  const startIndex = (currentPage - 1) * slotsPerPage;
  const endIndex = startIndex + slotsPerPage;
  const currentSlots = slots.slice(startIndex, endIndex);

  const totalPages = Math.ceil(slots.length / slotsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentSlots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => onSelectSlot(slot)}
            className={`p-4 border rounded-lg shadow-md cursor-pointer ${
              selectedSlot?.id === slot.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
            } hover:bg-blue-50 transition`}
          >
            <p className="text-sm font-medium text-gray-600">{slot.date}</p>
            <p className="text-sm text-gray-500">{slot.day}</p>
            <p className="text-sm font-semibold text-gray-700">{slot.time_slot}</p>
            <p
              className={`text-sm mt-2 ${
                slot.booked ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {slot.booked ? 'Unavailable' : 'Available'}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SlotGrid;
