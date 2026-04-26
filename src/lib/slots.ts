import { TimeSlot } from "@/types/booking";

export const BASE_SLOTS: TimeSlot[] = [
  { id: "16-17", label: "4:00 PM – 5:00 PM",   startHour: 16, endHour: 17, price: 150 },
  { id: "17-18", label: "5:00 PM – 6:00 PM",   startHour: 17, endHour: 18, price: 150 },
  { id: "18-19", label: "6:00 PM – 7:00 PM",   startHour: 18, endHour: 19, price: 200 },
  { id: "19-20", label: "7:00 PM – 8:00 PM",   startHour: 19, endHour: 20, price: 200 },
  { id: "20-21", label: "8:00 PM – 9:00 PM",   startHour: 20, endHour: 21, price: 200 },
  { id: "21-22", label: "9:00 PM – 10:00 PM",  startHour: 21, endHour: 22, price: 200 },
  { id: "22-23", label: "10:00 PM – 11:00 PM", startHour: 22, endHour: 23, price: 200 },
];

// Thu–Sat only: extra late slot
export const MIDNIGHT_SLOT: TimeSlot = {
  id: "23-00", label: "11:00 PM – 12:00 AM", startHour: 23, endHour: 0, price: 200,
};

// Thu=4, Fri=5, Sat=6 get the midnight slot
export function getSlotsForDate(date: Date): TimeSlot[] {
  const day = date.getDay();
  return day >= 4 ? [...BASE_SLOTS, MIDNIGHT_SLOT] : BASE_SLOTS;
}

export function getOpenHoursLabel(date: Date): string {
  return date.getDay() >= 4 ? "4:00 PM – 12:00 AM" : "4:00 PM – 11:00 PM";
}

// ALL_SLOTS used for slot lookup by id regardless of day
export const ALL_SLOTS: TimeSlot[] = [...BASE_SLOTS, MIDNIGHT_SLOT];

// Legacy alias
export const TIME_SLOTS = BASE_SLOTS;
