"use client";

import React, { useState } from "react";
import { MessageSquareText, Send, CheckCircle2 } from "lucide-react";

export default function StandupView() {
  const [submitted, setSubmitted] = useState(false);
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
        <MessageSquareText className="w-5 h-5 text-blue-600" />
        <span>Daily Standup Report</span>
      </h1>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Standup Submitted!</h3>
          <p className="text-xs text-slate-600">
            Your daily standup report for today has been logged and shared with your Devtech team lead.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Submit Another Update
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              1. What did you accomplish yesterday? *
            </label>
            <textarea
              required
              rows={3}
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
              placeholder="e.g. Implemented WebRTC camera selfie attendance flow and SQLite REST API schemas..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              2. What will you work on today? *
            </label>
            <textarea
              required
              rows={3}
              value={today}
              onChange={(e) => setToday(e.target.value)}
              placeholder="e.g. Build team group chat component and complete Next.js 16 App router integration..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              3. Are there any blockers or issues?
            </label>
            <textarea
              rows={2}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="None / No blockers currently."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Today's Standup</span>
          </button>
        </form>
      )}
    </div>
  );
}
