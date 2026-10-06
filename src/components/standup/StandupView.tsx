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
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
        <MessageSquareText className="w-5 h-5 text-blue-600" />
        <span>Daily Standup Report</span>
      </h1>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Standup Submitted!</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Your daily standup report for today has been logged and shared with your Devtech team lead.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            Submit Another Update
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              1. What did you accomplish yesterday? *
            </label>
            <textarea
              required
              rows={3}
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
              placeholder="e.g. Implemented WebRTC camera selfie attendance flow and SQLite REST API schemas..."
              className="w-full p-3 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              2. What will you work on today? *
            </label>
            <textarea
              required
              rows={3}
              value={today}
              onChange={(e) => setToday(e.target.value)}
              placeholder="e.g. Build team group chat component and complete Next.js 16 App router integration..."
              className="w-full p-3 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              3. Are there any blockers or issues?
            </label>
            <textarea
              rows={2}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="None / No blockers currently."
              className="w-full p-3 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Today's Standup</span>
          </button>
        </form>
      )}
    </div>
  );
}
