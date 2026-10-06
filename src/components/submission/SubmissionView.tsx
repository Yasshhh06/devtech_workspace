"use client";

import React, { useState } from "react";
import { Folder, Link2, AlertTriangle, CheckCircle2, Code2, Database, FileText, Presentation, Video, Award, MessageSquare, ExternalLink } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function SubmissionView() {
  const { tasks, projects, submissions, addSubmission, currentIntern } = useWorkspaceStore();

  const currentEmail = currentIntern?.email || "mohiteyash940@gmail.com";

  // Build dynamic list of assigned project & task titles for this intern
  const myAssignedTasks = tasks.filter((t) => t.assignedToEmail.toLowerCase() === currentEmail.toLowerCase());
  const projectOptions = Array.from(
    new Set([
      ...myAssignedTasks.map((t) => t.title),
      ...projects.map((p) => p.title),
    ])
  );

  const [projectTitle, setProjectTitle] = useState(projectOptions[0] || "Default Project Task");
  const [linkInput, setLinkInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Submissions submitted by the currently logged-in intern
  const mySubmissions = submissions.filter((s) => s.internEmail.toLowerCase() === currentEmail.toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;
    addSubmission(projectTitle, linkInput, noteInput);
    setSubmittedSuccess(true);
    setLinkInput("");
    setNoteInput("");
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Project Deliverable Submission</h1>
          <p className="text-xs text-slate-600">
            Submit your Google Drive project folder. Reviewers will grade your submission and post feedback here.
          </p>
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Submit Your Google Drive Folder Link</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your assigned task/project, make your Google Drive folder public, and paste the link below.
          </p>
        </div>

        {submittedSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Google Drive Link submitted successfully! Admin will grade your submission and post feedback.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Assigned Project or Task Title *
            </label>
            <select
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900"
            >
              {projectOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Google Drive Folder Public Link <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  required
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-sm transition shrink-0"
              >
                Submit Project
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Note to Reviewer / Admin (Optional)
            </label>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. 'Demo video is in the Demo Video folder. Backend is Node.js + Express.'"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium placeholder-slate-400"
            />
          </div>
        </form>
      </div>

      {/* MY RECENT SUBMISSIONS & ADMIN GRADES SECTION */}
      {mySubmissions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100">
            My Submissions & Admin Grades ({mySubmissions.length})
          </h3>

          <div className="space-y-4">
            {mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{sub.projectTitle}</h4>
                    <p className="text-[11px] text-slate-500">Submitted at {sub.submittedAt}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold w-fit ${
                      sub.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : sub.status === "Needs Revision"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {sub.status} {sub.score !== null && sub.score !== undefined ? `(${sub.score}/100)` : ""}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-blue-600 font-bold">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <a href={sub.driveLink} target="_blank" rel="noreferrer" className="hover:underline truncate">
                    {sub.driveLink}
                  </a>
                </div>

                {/* DISPLAY MENTOR REMARKS IF GRADED BY ADMIN */}
                {sub.score !== null && sub.score !== undefined && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <p className="font-extrabold text-emerald-900 flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Admin Grade Score: {sub.score} / 100</span>
                    </p>
                    {sub.mentorRemarks && (
                      <p className="text-[11px] text-slate-700 italic">
                        <strong>Mentor Remarks:</strong> "{sub.mentorRemarks}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOW TO SUBMIT Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase">HOW TO SUBMIT</h3>
          <span className="text-[11px] text-slate-500 font-medium">4 steps • ~2 min</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
            <h4 className="font-bold text-slate-900 pt-1">Create master folder</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Create a folder in Google Drive named <strong>YourName_Submission</strong>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
            <h4 className="font-bold text-slate-900 pt-1">Add 5 sub-folders</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Source Code, Datasets, Documentation, PPT, Demo Video
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
            <h4 className="font-bold text-slate-900 pt-1">Make public</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Set sharing to <strong>"Anyone with the link → Viewer"</strong>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">4</span>
            <h4 className="font-bold text-slate-900 pt-1">Paste link & submit</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Paste your link in the form above and hit Submit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
