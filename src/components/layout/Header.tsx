"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, Sun, ChevronDown, CheckCircle, AlertTriangle, LogOut } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function Header() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, currentUser, internLogout, adminLogout } = useWorkspaceStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSignOut = () => {
    internLogout();
    adminLogout();
    setShowProfileMenu(false);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          title="Toggle Light/Dark Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700 mb-3">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifications</h4>
                <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer">Mark all as read</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-2 bg-blue-50 dark:bg-slate-700/50 rounded-lg text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Mark attendance</p>
                    <p className="text-gray-500 dark:text-gray-400">Please mark your attendance for today.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/30 rounded-lg text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Task Approved</p>
                    <p className="text-gray-500 dark:text-gray-400">Advanced Analytics + Risk Metrics completed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 pl-2 pr-3 py-1 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
              {currentUser.username ? currentUser.username.slice(0, 2) : "IN"}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {currentUser.username}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-2 text-xs">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                <p className="font-bold text-gray-800 dark:text-gray-100">{currentUser.name}</p>
                <p className="text-gray-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium px-2 py-0.5 rounded text-[10px]">
                  {currentUser.role}
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold flex items-center space-x-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
