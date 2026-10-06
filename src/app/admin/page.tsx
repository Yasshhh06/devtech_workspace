"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Key,
  ArrowRight,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import AdminView from "@/components/admin/AdminView";

export default function AdminPage() {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  } = useWorkspaceStore();

  // Admin Auth State
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const cleanup = useWorkspaceStore.getState().initFirebaseRealtimeSync();
    return () => cleanup();
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(adminUser, adminPass);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="bg-white border border-blue-100 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">DevTech Admin Portal</h2>
            <p className="text-xs text-gray-500 font-medium">
              Enter Administrator credentials to access workspace controls
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold text-center border border-red-200">
              Invalid Admin Username or Password! Please verify your credentials.
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Admin Username</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Enter Username (e.g. Yasshhh)"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Admin Password</label>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Enter Admin Password"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-16">
      {/* Top Sticky Admin Navbar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-4">
          <img
            src="/devtech-logo.png"
            alt="DevTech IT Solution Pvt Ltd"
            className="h-11 w-auto object-contain"
          />
          <div className="border-l border-gray-200 pl-4">
            <h1 className="font-black text-gray-900 text-base leading-none">DevTech Admin Command Center</h1>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              Super Admin Mode • Firebase Realtime Firestore DB
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center space-x-1.5"
          >
            <span>View Intern Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content View */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <AdminView />
      </main>
    </div>
  );
}
