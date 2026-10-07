"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Key, ArrowRight, Loader2 } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { internLogin, addNewIntern } = useWorkspaceStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. First check local state for instant response if user already present
    const localOk = internLogin(cleanEmail, cleanPassword);
    if (localOk) {
      router.push("/");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Query Firebase Firestore via auth API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const userObj = {
          id: data.data.id || cleanEmail,
          name: data.data.name,
          email: data.data.email,
          password: cleanPassword,
          domain: data.data.domain || "Full Stack Web Development",
          batch: data.data.batch || "DEV-2026-FS04",
          mobile: data.data.mobile || "",
        };

        const ok = internLogin(data.data.email, cleanPassword, userObj);
        if (ok) {
          router.push("/");
          return;
        }
      } else {
        setErrorMsg(data.error || "Invalid Intern Email or Password! Please verify your login credentials or ask Admin to register your account.");
      }
    } catch (err: any) {
      console.warn("API check exception:", err);
      const ok = internLogin(cleanEmail, cleanPassword);
      if (ok) {
        router.push("/");
        return;
      } else {
        setErrorMsg("Invalid Intern Email or Password! Please verify your login credentials or ask Admin to register your account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white border border-blue-100 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
        {/* DevTech Company Logo & Header */}
        <div className="text-center space-y-3">
          <img
            src="/devtech-logo.png"
            alt="DevTech IT Solution Pvt Ltd"
            className="h-14 w-auto object-contain mx-auto"
          />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">DevTech Intern Workspace Portal</h2>
          <p className="text-xs text-gray-500 font-medium">
            Enter your Intern Login Credentials created by DevTech Admin
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold text-center leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Intern Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. support@devtechitsolution.com"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-semibold text-gray-600">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-blue-600 font-bold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO INTERN PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 text-center space-y-1">
          <p className="text-[11px] text-gray-400">DevTech IT Solution Pvt Ltd • Platform Workspace</p>
        </div>
      </div>
    </div>
  );
}
