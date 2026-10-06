"use client";

import React, { useState } from "react";
import { User, Mail, Phone, School, Briefcase, Calendar, ShieldCheck, Check } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function ProfileView() {
  const { currentIntern, updateUserProfile } = useWorkspaceStore();

  const [name, setName] = useState(currentIntern?.name || "Mohite Yash");
  const [mobile, setMobile] = useState("+91 9967053816");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, mobile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
          {currentIntern?.name?.charAt(0) || "M"}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">{currentIntern?.name || "Mohite Yash"}</h1>
          <p className="text-xs text-blue-100 mt-0.5">
            {currentIntern?.domain || "Full Stack Web Development"} Intern • ID: DTS-FSD-INT-000265
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-gray-900 dark:text-white pb-2 border-b">Intern Information Profile</h3>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 text-gray-700 dark:text-gray-300">Full Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-gray-700 dark:text-gray-300">Email Address (Read-only)</label>
              <input
                type="email"
                readOnly
                value={currentIntern?.email || "mohiteyash940@gmail.com"}
                className="w-full p-2.5 bg-gray-100 dark:bg-slate-800/60 border rounded-xl text-gray-500 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 text-gray-700 dark:text-gray-300">Mobile Phone Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-gray-700 dark:text-gray-300">Domain Track</label>
              <input
                type="text"
                readOnly
                value={currentIntern?.domain || "Full Stack Web Development"}
                className="w-full p-2.5 bg-gray-100 dark:bg-slate-800/60 border rounded-xl text-gray-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 text-gray-700 dark:text-gray-300">Batch Code</label>
              <input
                type="text"
                readOnly
                value={currentIntern?.batch || "DEV-2026-FS04"}
                className="w-full p-2.5 bg-gray-100 dark:bg-slate-800/60 border rounded-xl text-gray-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-gray-700 dark:text-gray-300">Assigned Mentor</label>
              <input
                type="text"
                readOnly
                value={currentIntern?.mentor || "Rahul Sharma"}
                className="w-full p-2.5 bg-gray-100 dark:bg-slate-800/60 border rounded-xl text-gray-500 font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            Update Profile Information
          </button>
        </form>
      </div>
    </div>
  );
}
