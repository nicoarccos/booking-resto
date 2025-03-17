import { motion } from "framer-motion";
import SlotGrid from "./SlotGrid";
import { AvailableSlot } from "./types";

interface MonthSectionProps {
  month: string;
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
}

const MonthSection = ({ month, slots, selectedSlot, onSelectSlot }: MonthSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 p-6 bg-background rounded-lg shadow-lg border border-accent/10"
    >
      <div className="relative mb-6">
        <motion.h3 
          className="text-2xl font-playfair text-primary inline-block relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {month}
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.h3>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg p-6"
      >
        {slots.length > 0 ? (
          <SlotGrid 
            slots={slots} 
            selectedSlot={selectedSlot} 
            onSelectSlot={onSelectSlot} 
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-text-secondary font-body text-lg">
              No available slots for this month
            </p>
            <p className="text-sm text-text-secondary/70 mt-2">
              Please try selecting a different date
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MonthSection; 