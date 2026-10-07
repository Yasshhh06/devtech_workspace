"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, CheckCircle, AlertTriangle, LogOut } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function Header() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    currentUser,
    currentIntern,
    notifications,
    markNotificationAsRead,
    setActiveTab,
    internLogout,
    adminLogout,
  } = useWorkspaceStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userEmail = (currentIntern?.email || currentUser?.email || "").toLowerCase().trim();
  const userDomain = currentIntern?.domain || "";

  const myNotifications = notifications.filter((n) => {
    if (!userEmail) return true; // Show all if admin or no email
    if (n.targetEmails.includes("ALL")) return true;
    if (n.targetEmails.map((e) => e.toLowerCase()).includes(userEmail)) return true;
    if (userDomain && n.targetEmails.includes(`domain:${userDomain}`)) return true;
    return false;
  });

  const unreadCount = myNotifications.filter(
    (n) => !(n.readByEmails || []).map((e) => e.toLowerCase()).includes(userEmail)
  ).length;

  const markAllAsRead = () => {
    if (!userEmail) return;
    myNotifications.forEach((n) => {
      markNotificationAsRead(n.id, userEmail);
    });
  };

  const handleSignOut = () => {
    internLogout();
    adminLogout();
    setShowProfileMenu(false);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-xs">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 placeholder-gray-400 font-medium"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border-2 border-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Admin Notifications ({myNotifications.length})</span>
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {myNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No new notifications from Admin.
                  </div>
                ) : (
                  myNotifications.slice(0, 6).map((n) => {
                    const isRead = (n.readByEmails || []).map((e) => e.toLowerCase()).includes(userEmail);
                    return (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border transition space-y-1 ${
                          isRead ? "bg-gray-50/70 border-gray-200" : "bg-blue-50/70 border-blue-200 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900 flex items-center space-x-1">
                            {!isRead && <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>}
                            <span>{n.title}</span>
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase">
                            {n.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">{n.content}</p>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400 font-mono">
                          <span>{n.createdAt}</span>
                          {!isRead && (
                            <button
                              onClick={() => markNotificationAsRead(n.id, userEmail)}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 mt-2 text-center">
                <button
                  onClick={() => {
                    setActiveTab("notifications");
                    setShowNotifications(false);
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  View All Notifications →
                </button>
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
            className="flex items-center space-x-2 pl-2 pr-3 py-1 border border-gray-200 rounded-full hover:bg-gray-50 transition"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
              {currentUser.username ? currentUser.username.slice(0, 2) : "IN"}
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {currentUser.username}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 text-xs">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-gray-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded text-[10px]">
                  {currentUser.role}
                </span>
              </div>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center space-x-2 transition"
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
