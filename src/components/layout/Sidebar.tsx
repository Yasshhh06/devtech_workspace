"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  Calendar,
  UserX,
  Send,
  FileText,
  ShieldCheck,
  Settings,
  ChevronDown,
  Clock,
  LogOut,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore, NavTab } from "@/lib/store";

export default function Sidebar() {
  const router = useRouter();
  const { activeTab, setActiveTab, tasks, currentIntern, currentUser, internLogout, adminLogout } = useWorkspaceStore();
  const [showTasksAccordion, setShowTasksAccordion] = useState(true);

  const currentEmail = (currentIntern?.email || currentUser?.email || "").trim().toLowerCase();
  const myTasks = currentEmail
    ? tasks.filter((t) => (t.assignedToEmail || "").trim().toLowerCase() === currentEmail)
    : [];

  const handleLogout = () => {
    internLogout();
    adminLogout();
    router.push("/login");
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" /> },
    { id: "attendance", label: "Attendance", icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "leave", label: "Leave / WFH", icon: <UserX className="w-4 h-4" /> },
    { id: "submission", label: "Submission", icon: <Send className="w-4 h-4" /> },
    { id: "terms", label: "Terms & Conditions", icon: <FileText className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-blue-100 flex flex-col justify-between h-screen sticky top-0 text-sm overflow-y-auto shrink-0 select-none shadow-sm">
      <div>
        {/* DevTech Company Logo Header */}
        <div className="p-4 border-b border-blue-100 bg-white">
          <img
            src="/devtech-logo.png"
            alt="DevTech IT Solution Pvt Ltd"
            className="h-10 w-auto object-contain mx-auto"
          />
          <div className="mt-2 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              DevTech Workspace
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Accordion: My Tasks */}
        <div className="p-2 mt-2 border-t border-gray-100">
          <button
            onClick={() => setShowTasksAccordion(!showTasksAccordion)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>My Tasks</span>
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {myTasks.length}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTasksAccordion ? "rotate-180" : ""}`} />
          </button>

          {showTasksAccordion && (
            <div className="mt-1 space-y-0.5 pl-2">
              {myTasks.length === 0 ? (
                <p className="text-[10px] text-gray-400 px-2 py-1">No tasks assigned.</p>
              ) : (
                myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-2 px-2 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50 rounded cursor-pointer transition"
                  >
                    <span className="mt-1 shrink-0">
                      {task.status === "done" ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      )}
                    </span>
                    <div className="truncate">
                      <p className="truncate text-gray-700 leading-snug">{task.title}</p>
                      <span className="text-[9px] text-gray-400">{task.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Last updated 1 hr ago</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-bold hover:underline transition"
          title="Sign Out"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
