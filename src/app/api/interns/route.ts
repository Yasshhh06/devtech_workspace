import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export async function GET() {
  try {
    const usersCol = collection(db, "users");
    const querySnapshot = await getDocs(usersCol);
    const interns: any[] = [];

    querySnapshot.forEach((docSnap) => {
      interns.push(docSnap.data());
    });



    return NextResponse.json({ success: true, data: interns });
  } catch (error: any) {
    console.error("Error fetching interns from Firebase Firestore:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, domain } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);

    const newIntern = {
      id: cleanEmail,
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      domain: domain || "Full Stack Web Development",
      batch: "DEV-2026-FS04",
      role: "INTERN",
    };

    await setDoc(userRef, newIntern, { merge: true });

    return NextResponse.json({ success: true, data: newIntern });
  } catch (error: any) {
    console.error("Error creating intern in Firebase Firestore:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
