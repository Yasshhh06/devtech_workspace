import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB-azF1FdAkYv6OXHqf4LdmreYRUkYsJaM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "devtech-workspace.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "devtech-workspace",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "devtech-workspace.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "150888795100",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:150888795100:web:bd92bbdab2287a31dbdd19",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4ZXNXMKKLB",
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };

// --- COLLECTION HELPERS ---

// 1. REGISTERED INTERNS (users collection)
export async function createOrUpdateInternInFirestore(internData: {
  name: string;
  email: string;
  password?: string;
  domain?: string;
  batch?: string;
}) {
  try {
    const cleanEmail = internData.email.trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await updateDoc(userRef, {
        name: internData.name.trim(),
        password: internData.password?.trim() || docSnap.data().password || "devtech123",
        domain: internData.domain || docSnap.data().domain || "Full Stack Web Development",
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, {
        id: cleanEmail,
        name: internData.name.trim(),
        email: cleanEmail,
        password: internData.password?.trim() || "devtech123",
        domain: internData.domain || "Full Stack Web Development",
        batch: internData.batch || "DEV-2026-FS04",
        role: "INTERN",
        createdAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error writing intern to Firestore:", error);
    return { success: false, error: error.message };
  }
}

export async function resetInternPasswordInFirestore(email: string, newPassword: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);
    await updateDoc(userRef, {
      password: newPassword.trim(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error resetting password in Firestore:", error);
    return { success: false, error: error.message };
  }
}

// 2. ASSIGNED TASKS (tasks collection)
export async function addTaskToFirestore(taskData: any) {
  try {
    const tasksCol = collection(db, "tasks");
    const docRef = await addDoc(tasksCol, {
      ...taskData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding task to Firestore:", error);
    return { success: false, error: error.message };
  }
}

// 3. ATTENDANCE & SELFIES (attendance collection)
export async function addAttendanceToFirestore(attendanceData: any) {
  try {
    const attCol = collection(db, "attendance");
    const docRef = await addDoc(attCol, {
      ...attendanceData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding attendance to Firestore:", error);
    return { success: false, error: error.message };
  }
}

// 4. SUBMISSIONS (submissions collection)
export async function addSubmissionToFirestore(submissionData: any) {
  try {
    const subCol = collection(db, "submissions");
    const docRef = await addDoc(subCol, {
      ...submissionData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding submission to Firestore:", error);
    return { success: false, error: error.message };
  }
}

// 5. LEAVE REQUESTS (leaves collection)
export async function addLeaveRequestToFirestore(leaveData: any) {
  try {
    const leavesCol = collection(db, "leaves");
    const docRef = await addDoc(leavesCol, {
      ...leaveData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding leave request to Firestore:", error);
    return { success: false, error: error.message };
  }
}

// 6. CALENDAR HOLIDAYS (holidays collection)
export async function addHolidayToFirestore(holidayData: any) {
  try {
    const holCol = collection(db, "holidays");
    const docRef = await addDoc(holCol, {
      ...holidayData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding holiday to Firestore:", error);
    return { success: false, error: error.message };
  }
}
