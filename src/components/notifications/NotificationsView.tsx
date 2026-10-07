"use client";

import React, { useState } from "react";
import { Bell, CheckCircle, Info, Filter, Trash2, Megaphone } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function NotificationsView() {
  const { notifications, currentIntern, currentUser, markNotificationAsRead } = useWorkspaceStore();
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const userEmail = (currentIntern?.email || currentUser?.email || "").toLowerCase().trim();
  const userDomain = currentIntern?.domain || "";

  const myNotifications = notifications.filter((n) => {
    if (!userEmail) return true;
    if (n.targetEmails.includes("ALL")) return true;
    if (n.targetEmails.map((e) => e.toLowerCase()).includes(userEmail)) return true;
    if (userDomain && n.targetEmails.includes(`domain:${userDomain}`)) return true;
    return false;
  });

  const filtered = myNotifications.filter((n) => {
    if (filterCategory === "ALL") return true;
    return n.category === filterCategory;
  });

  const unreadCount = myNotifications.filter(
    (n) => !(n.readByEmails || []).map((e) => e.toLowerCase()).includes(userEmail)
  ).length;

  const markAllRead = () => {
    if (!userEmail) return;
    myNotifications.forEach((n) => markNotificationAsRead(n.id, userEmail));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Admin Notifications & Workspace Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time announcements, task updates, and official broadcasts from DevTech Admin.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All ({unreadCount}) as Read</span>
          </button>
        )}
      </div>

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {["ALL", "Announcement", "Task Assignment", "Deadline", "General", "Urgent"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl border transition ${
              filterCategory === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat === "ALL" ? `All (${myNotifications.length})` : cat}
          </button>
        ))}
      </div>

      {/* Notifications List Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold">No notifications found in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const isRead = (n.readByEmails || []).map((e) => e.toLowerCase()).includes(userEmail);
              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isRead
                      ? "bg-slate-50/50 border-slate-200"
                      : "bg-blue-50/60 border-blue-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {!isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                      )}
                      <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        n.category === "Urgent"
                          ? "bg-red-100 text-red-800"
                          : n.category === "Task Assignment"
                          ? "bg-indigo-100 text-indigo-800"
                          : n.category === "Deadline"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {n.category}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed font-medium">{n.content}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sender: {n.sender || "Admin"} • {n.createdAt}</span>
                    </span>

                    {!isRead && (
                      <button
                        onClick={() => markNotificationAsRead(n.id, userEmail)}
                        className="text-blue-600 font-bold hover:underline flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark as Read</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
