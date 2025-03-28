export interface AvailableSlot {
  id: string;
  date: string;
  day: string;
  time_slot: string;
  booked: boolean; // Renamed from is_booked to match Slot
}
