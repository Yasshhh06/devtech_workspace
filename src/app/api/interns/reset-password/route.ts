import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email and New Password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Intern account not found with this email in Firebase." },
        { status: 404 }
      );
    }

    await updateDoc(userRef, {
      password: newPassword.trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Password for ${cleanEmail} updated successfully in Firebase Firestore!`,
      data: { email: cleanEmail, name: userSnap.data()?.name },
    });
  } catch (error: any) {
    console.error("Error resetting intern password in Firebase Firestore:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
