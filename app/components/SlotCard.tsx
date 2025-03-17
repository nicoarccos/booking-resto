import { AvailableSlot } from './types';
import { motion } from 'framer-motion';

interface SlotCardProps {
  slot: AvailableSlot;
  isSelected: boolean;
  onClick: () => void;
}

const SlotCard = ({ slot, isSelected, onClick }: SlotCardProps) => {
  const formattedTime = slot.time_slot.split('-').map(time => 
    time.trim().replace(':00', '')
  ).join(' - ');

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: slot.booked ? 1 : 1.02 }}
      whileTap={{ scale: slot.booked ? 1 : 0.98 }}
      className={`
        w-full p-4 rounded-default border transition-all
        ${slot.booked 
          ? 'bg-background border-error/20 cursor-not-allowed' 
          : isSelected
            ? 'bg-background border-primary shadow-highlight'
            : 'border-gray-200 hover:border-accent hover:bg-background/50'
        }
      `}
      disabled={slot.booked}
    >
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-sans text-text-primary">
            {formattedTime}
          </span>
          <span className={`
            text-xs font-body px-2 py-1 rounded-full
            ${slot.booked 
              ? 'bg-error/10 text-error'
              : 'bg-success/10 text-success'
            }
          `}>
            {slot.booked ? 'Booked' : 'Available'}
          </span>
        </div>
        <div className="text-xs font-body text-text-secondary">
          {slot.day}
        </div>
      </div>
    </motion.button>
  );
};

export default SlotCard;
  