import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Query Firestore users collection
    const userRef = doc(db, "users", cleanEmail);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Invalid intern email or password! Please verify your login credentials or ask Admin to register your account." },
        { status: 401 }
      );
    }

    const userData = userSnap.data();

    // Verify Password
    if (userData.password && userData.password !== cleanPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid intern email or password! Please verify your login credentials or ask Admin to register your account." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userData.id || cleanEmail,
        name: userData.name,
        email: userData.email,
        domain: userData.domain || "Full Stack Web Development",
        batch: userData.batch || "DEV-2026-FS04",
        role: userData.role || "INTERN",
      },
    });
  } catch (error: any) {
    console.error("Error during Firebase login authentication:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please verify credentials." },
      { status: 500 }
    );
  }
}
