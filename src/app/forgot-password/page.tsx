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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6 text-center">
        <img
          src="/devtech-logo.png"
          alt="DevTech IT Solution Pvt Ltd"
          className="h-12 w-auto object-contain mx-auto"
        />
        <h2 className="text-xl font-black tracking-tight text-slate-900">Forgot Password</h2>
        <p className="text-xs text-slate-600 font-medium">
          Enter your registered email address to receive password reset instructions.
        </p>

        {sentSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-semibold space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p>Password reset link has been sent to <strong>{email}</strong>!</p>
            <a href="/login" className="text-blue-600 font-bold block pt-2 hover:underline">
              Return to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs text-left">
            <div>
              <label className="block font-bold mb-1 text-slate-700">Your Registered Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. support@devtechitsolution.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
