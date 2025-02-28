import SlotGrid from "./SlotGrid";
import { AvailableSlot } from "./types"; // Ensure correct path

interface MonthSectionProps {
  month: string;
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
}

const MonthSection = ({ month, slots, selectedSlot, onSelectSlot }: MonthSectionProps) => {
  return (
    <div>
      <h3>{month}</h3>
      {/* ✅ Directly pass slots without transformation */}
      <SlotGrid slots={slots} selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
    </div>
  );
};

export default MonthSection;
