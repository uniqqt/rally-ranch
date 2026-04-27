import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Booking } from "@/types/booking";

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function getBookedSlots(date: string): Promise<string[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db, "bookings"), where("date", "==", date));
  const snapshot = await withTimeout(getDocs(q));
  return snapshot.docs
    .map((d) => d.data() as Booking)
    .filter((b) => b.status !== "cancelled")
    .flatMap((b) => b.timeSlotIds ?? []);
}

export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Promise<string> {
  if (!isFirebaseConfigured()) {
    return `local_${Date.now()}`;
  }
  const docRef = await withTimeout(
    addDoc(collection(db, "bookings"), {
      ...booking,
      createdAt: Timestamp.now().toDate().toISOString(),
    })
  );
  return docRef.id;
}

export async function getAllBookings(): Promise<Booking[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const snapshot = await withTimeout(getDocs(q));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<void> {
  await withTimeout(updateDoc(doc(db, "bookings", id), { status }));
}

export async function deleteBooking(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, "bookings", id)));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (!isFirebaseConfigured()) return null;
  const upper = id.toUpperCase();

  // Try exact match first
  const snap = await withTimeout(getDoc(doc(db, "bookings", id)));
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Booking;

  // Fall back to prefix search (short ID match)
  const all = await withTimeout(getDocs(collection(db, "bookings")));
  const match = all.docs.find((d) => d.id.toUpperCase().startsWith(upper));
  if (!match) return null;
  return { id: match.id, ...match.data() } as Booking;
}
