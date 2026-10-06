import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch all registered intern users from MongoDB Atlas
    let interns = await User.find({}).sort({ createdAt: -1 });

    if (interns.length === 0) {
      const defaultIntern = await User.findOneAndUpdate(
        { email: "mohiteyash940@gmail.com" },
        {
          name: "Mohite Yash",
          email: "mohiteyash940@gmail.com",
          password: "devtech123",
          role: "INTERN",
          domain: "Full Stack Web Development",
          batch: "DEV-2026-FS04",
          isActive: true,
        },
        { upsert: true, new: true }
      );
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

    // Create or update intern document in MongoDB Atlas devtech_workspace DB
    const intern = await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name: name.trim(),
        email: cleanEmail,
        password: password.trim(),
        domain: domain || "Full Stack Web Development",
        role: "INTERN",
        batch: "DEV-2026-FS04",
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, data: intern });
  } catch (error: any) {
    console.error("Error creating intern in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
