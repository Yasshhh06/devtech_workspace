import mongoose, { Schema, Document } from "mongoose";

// 1. User Schema
export interface IUser extends Document {
  username: string;
  email: string;
  role: "admin" | "hr" | "manager" | "mentor" | "employee" | "intern";
  workspaceId: string;
  avatarUrl: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, default: "intern" },
  workspaceId: { type: String, default: "Devtech 22A22J" },
  avatarUrl: { type: String, default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  createdAt: { type: Date, default: Date.now },
});

// 2. Project Schema
export interface IProject extends Document {
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  priority: "HIGH Priority" | "MEDIUM Priority" | "LOW Priority";
  progress: number;
  dueDate: string;
  workspaceId: string;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "ACTIVE" },
  priority: { type: String, default: "MEDIUM Priority" },
  progress: { type: Number, default: 0 },
  dueDate: { type: String, default: "Jun 20, 2026" },
  workspaceId: { type: String, default: "Devtech 22A22J" },
});

// 3. Task Schema
export interface ITask extends Document {
  title: string;
  projectId?: string;
  status: "done" | "in progress" | "pending";
  priority: "HIGH Priority" | "MEDIUM Priority" | "LOW Priority";
  assignedTo: string;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  projectId: { type: String },
  status: { type: String, default: "in progress" },
  priority: { type: String, default: "MEDIUM Priority" },
  assignedTo: { type: String, default: "" },
});

// 4. Attendance Schema
export interface IAttendance extends Document {
  username: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: "Present" | "Absent" | "Weekend";
  selfieImgUrl?: string;
}

const AttendanceSchema = new Schema<IAttendance>({
  username: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Present" },
  selfieImgUrl: { type: String },
});

// Export Models
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
