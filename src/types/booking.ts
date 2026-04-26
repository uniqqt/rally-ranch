export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface TimeSlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
  price: number;
}

export interface Booking {
  id?: string;
  date: string;
  timeSlotIds: string[];
  timeSlotLabels: string[];
  price: number;          // total of all selected slots
  name: string;
  phone: string;
  email?: string;
  proofUrl?: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}
