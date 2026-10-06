import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch all registered interns from MongoDB
    let interns = await User.find({ role: "INTERN" }).sort({ createdAt: -1 });

    // Pre-seed default intern if database has no interns yet
    if (interns.length === 0) {
      const defaultIntern = await User.create({
        name: "Mohite Yash",
        email: "mohiteyash940@gmail.com",
        password: "devtech123",
        role: "INTERN",
        domain: "Full Stack Web Development",
        batch: "DEV-2026-FS04",
        isActive: true,
      });
      interns = [defaultIntern];
    }

    return NextResponse.json({ success: true, data: interns });
  } catch (error: any) {
    console.error("Error fetching interns from MongoDB:", error);
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

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable. Please try again." },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in MongoDB
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      existing.name = name.trim();
      existing.password = password.trim();
      existing.domain = domain || existing.domain || "Full Stack Web Development";
      existing.role = "INTERN";
      await existing.save();
      return NextResponse.json({ success: true, data: existing, updated: true });
    }

    // Create new intern document in MongoDB devtech_workspace DB
    const newIntern = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      domain: domain || "Full Stack Web Development",
      role: "INTERN",
      batch: "DEV-2026-FS04",
      isActive: true,
    });

    return NextResponse.json({ success: true, data: newIntern });
  } catch (error: any) {
    console.error("Error creating intern in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
