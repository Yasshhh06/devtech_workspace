import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  assignedToEmail: string;
  assignedToName: string;
  domain?: string;
  status: "done" | "in progress" | "pending";
  priority: "HIGH Priority" | "MEDIUM Priority" | "LOW Priority";
  dueDate?: string;
  documentUrl?: string;
  documentName?: string;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  assignedToEmail: { type: String, required: true, lowercase: true },
  assignedToName: { type: String, required: true },
  domain: { type: String },
  status: { type: String, enum: ["done", "in progress", "pending"], default: "in progress" },
  priority: { type: String, enum: ["HIGH Priority", "MEDIUM Priority", "LOW Priority"], default: "HIGH Priority" },
  dueDate: { type: String },
  documentUrl: { type: String },
  documentName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
