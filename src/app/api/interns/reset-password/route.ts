import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

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

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable." },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Intern account not found with this email." },
        { status: 404 }
      );
    }

    user.password = newPassword.trim();
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Password for ${user.email} updated successfully!`,
      data: { email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Error resetting intern password in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
