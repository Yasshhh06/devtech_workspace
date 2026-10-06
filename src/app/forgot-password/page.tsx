"use client";

import React, { useState } from "react";
import { Layers, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSentSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 font-sans text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
        <img
          src="/devtech-logo.png"
          alt="DevTech IT Solution Pvt Ltd"
          className="h-12 w-auto object-contain mx-auto"
        />
        <h2 className="text-xl font-black tracking-tight">Forgot Password</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Enter your registered email address to receive password reset instructions.
        </p>

        {sentSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 rounded-2xl text-xs font-semibold space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <p>Password reset link has been sent to <strong>{email}</strong>!</p>
            <a href="/login" className="text-blue-600 font-bold block pt-2 hover:underline">
              Return to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs text-left">
            <div>
              <label className="block font-bold mb-1">Your Registered Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mohiteyash940@gmail.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
