"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Mail, Key, ShieldCheck, ArrowRight, UserCheck, Check } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { internLogin, adminLogin } = useWorkspaceStore();

  const [authRole, setAuthRole] = useState<"intern" | "admin">("intern");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (authRole === "admin") {
      const ok = adminLogin(email || "admin", password || "devtechadmin123");
      if (ok) {
        router.push("/admin");
      } else {
        setErrorMsg("Invalid Admin Credentials. Default: admin / devtechadmin123");
      }
    } else {
      const ok = internLogin(email, password);
      if (ok) {
        router.push("/");
      } else {
        setErrorMsg(`Intern email "${email}" not found. Please register intern account via Admin Panel first.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 font-sans text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* DevTech Company Logo & Header */}
        <div className="text-center space-y-3">
          <img
            src="/devtech-logo.png"
            alt="DevTech IT Solution Pvt Ltd"
            className="h-14 w-auto object-contain mx-auto"
          />
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">DevTech Central Workspace</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Sign in to access your Centralized Project Management Portal
          </p>
        </div>

        {/* Auth Role Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthRole("intern");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl transition ${
              authRole === "intern"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
            }`}
          >
            Intern Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthRole("admin");
              setErrorMsg("");
              setEmail("admin");
              setPassword("devtechadmin123");
            }}
            className={`py-2 rounded-xl transition ${
              authRole === "admin"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
            }`}
          >
            Admin Portal
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 rounded-xl text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {authRole === "admin" ? "Admin Username / Email" : "Intern Email Address *"}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                required
                type={authRole === "admin" ? "text" : "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authRole === "admin" ? "admin" : "e.g. mohiteyash940@gmail.com"}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Password *</label>
            <div className="relative flex items-center">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
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
              <span className="font-semibold text-gray-600 dark:text-gray-400">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
          >
            <span>SIGN IN TO {authRole.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 text-center space-y-1">
          <p className="text-[11px] text-gray-400">DevTech IT Solution • Platform Workspace</p>
          <p className="text-[10px] text-gray-400">workspace.devtechitsolution.com</p>
        </div>
      </div>
    </div>
  );
}
