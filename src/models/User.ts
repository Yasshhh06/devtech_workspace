import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  domain?: string;
  batch?: string;
  college?: string;
  mentor?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false, default: "devtech123" },
  role: {
    type: String,
    default: "INTERN",
  },
  domain: { type: String, default: "Full Stack Web Development" },
  batch: { type: String, default: "DEV-2026-FS04" },
  college: { type: String },
  mentor: { type: String },
  avatarUrl: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
