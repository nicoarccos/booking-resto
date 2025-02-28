import { AvailableSlot } from './types';

interface SlotCardProps {
  slot: AvailableSlot;
  isSelected: boolean;
  onClick: () => void;
}


interface SlotCardProps {
    slot: AvailableSlot;
    isSelected: boolean;
    onClick: () => void;
  }
  
  const SlotCard = ({ slot, isSelected, onClick }: SlotCardProps) => (
    <button
      onClick={onClick}
      style={{
        padding: "10px",
        border: isSelected ? "2px solid blue" : "1px solid #ccc",
        backgroundColor: slot.booked ? "#f8d7da" : "#d4edda",
        cursor: slot.booked ? "not-allowed" : "pointer",
        color: slot.booked ? "#721c24" : "#155724",
      }}
      disabled={slot.booked}
    >
      <strong>{slot.date}</strong>
      <br />
      {slot.day} - {slot.time_slot}
      <br />
      {slot.booked ? "Unavailable" : "Available"}
    </button>
  );
  
  export default SlotCard;
  