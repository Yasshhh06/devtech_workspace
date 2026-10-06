"use client";

import React, { useState } from "react";
import { Settings, User, Shield, Bell, Edit3, Check, X } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function SettingsView() {
  const { currentUser, updateUserProfile } = useWorkspaceStore();
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "account" | "notifications">("profile");

  // Edit states for Display Name and Mobile
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);

  const [displayNameInput, setDisplayNameInput] = useState(currentUser.username);
  const [mobileInput, setMobileInput] = useState(currentUser.mobile);

  const handleSaveName = () => {
    updateUserProfile(displayNameInput, mobileInput);
    setIsEditingName(false);
  };

  const handleSaveMobile = () => {
    updateUserProfile(displayNameInput, mobileInput);
    setIsEditingMobile(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Settings</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Sub Tabs Pill Selector (Exact match to Screenshot 2) */}
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit border border-gray-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg transition ${
            activeSubTab === "profile"
              ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm font-bold"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab("account")}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg transition ${
            activeSubTab === "account"
              ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm font-bold"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Account</span>
        </button>

        <button
          onClick={() => setActiveSubTab("notifications")}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg transition ${
            activeSubTab === "notifications"
              ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm font-bold"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Profile Tab Content (Exact match to Screenshot 2) */}
      {activeSubTab === "profile" && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Profile Information</h3>

          {/* User Header Profile Card */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-extrabold text-2xl flex items-center justify-center shrink-0">
              M
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">{currentUser.username}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
              <span className="inline-block mt-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase">
                MEMBER Account
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Field 1: Display Name */}
            <div className="p-4 bg-gray-50/30 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5">Display Name</span>
                {isEditingName ? (
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    className="px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-blue-500 rounded-lg focus:outline-none"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{currentUser.username}</span>
                )}
              </div>

              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <button onClick={handleSaveName} className="text-emerald-600 text-xs font-bold flex items-center space-x-1 hover:underline">
                    <Check className="w-3.5 h-3.5" /> <span>Save</span>
                  </button>
                  <button onClick={() => setIsEditingName(false)} className="text-gray-400 text-xs flex items-center space-x-1 hover:underline">
                    <X className="w-3.5 h-3.5" /> <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center space-x-1 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {/* Field 2: WhatsApp / Mobile Number */}
            <div className="p-4 bg-gray-50/30 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5">WhatsApp / Mobile Number</span>
                {isEditingMobile ? (
                  <input
                    type="text"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-blue-500 rounded-lg focus:outline-none"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{currentUser.mobile}</span>
                )}
              </div>

              {isEditingMobile ? (
                <div className="flex items-center space-x-2">
                  <button onClick={handleSaveMobile} className="text-emerald-600 text-xs font-bold flex items-center space-x-1 hover:underline">
                    <Check className="w-3.5 h-3.5" /> <span>Save</span>
                  </button>
                  <button onClick={() => setIsEditingMobile(false)} className="text-gray-400 text-xs flex items-center space-x-1 hover:underline">
                    <X className="w-3.5 h-3.5" /> <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingMobile(true)}
                  className="text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center space-x-1 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeSubTab === "account" && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Account Credentials & Security</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage password and security options for your Devtech Workspace account.</p>
        </div>
      )}

      {/* Notifications Tab */}
      {activeSubTab === "notifications" && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Notification Preferences</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Configure email and workspace alert settings.</p>
        </div>
      )}
    </div>
  );
}
