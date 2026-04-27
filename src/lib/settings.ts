import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const SETTINGS_DOC = doc(db, "settings", "admin");
const FALLBACK_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rallyranch2024";

export async function getAdminPassword(): Promise<string> {
  if (!isFirebaseConfigured()) return FALLBACK_PASSWORD;
  try {
    const snap = await getDoc(SETTINGS_DOC);
    return snap.exists() ? (snap.data().password as string) : FALLBACK_PASSWORD;
  } catch {
    return FALLBACK_PASSWORD;
  }
}

export async function setAdminPassword(password: string): Promise<void> {
  await setDoc(SETTINGS_DOC, { password }, { merge: true });
}
