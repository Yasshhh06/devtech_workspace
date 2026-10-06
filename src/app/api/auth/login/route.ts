import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find intern in MongoDB devtech_workspace DB
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid intern email or password! Please ask Admin to register your account." },
        { status: 401 }
      );
    }

    // Check password match
    if (user.password && user.password !== password.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid password! Please double check your credentials or request password reset from Admin." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        domain: user.domain || "Full Stack Web Development",
        batch: user.batch || "DEV-2026-FS04",
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error during MongoDB login authentication:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
