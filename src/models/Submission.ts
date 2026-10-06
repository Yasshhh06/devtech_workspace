import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  internName: string;
  internEmail: string;
  projectTitle: string;
  driveLink: string;
  adminNote?: string;
  submittedAt: string;
  status: "Awaiting Evaluation" | "Approved" | "Needs Revision";
  score?: number | null;
  mentorRemarks?: string;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  internName: { type: String, required: true },
  internEmail: { type: String, required: true, lowercase: true },
  projectTitle: { type: String, required: true },
  driveLink: { type: String, required: true },
  adminNote: { type: String },
  submittedAt: { type: String, required: true },
  status: { type: String, enum: ["Awaiting Evaluation", "Approved", "Needs Revision"], default: "Awaiting Evaluation" },
  score: { type: Number, default: null },
  mentorRemarks: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
