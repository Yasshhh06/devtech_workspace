"use client";

import React from "react";
import { Folder, CheckCircle, Users, AlertTriangle, ArrowRight, FileText, ExternalLink } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function DashboardView() {
  const { currentUser, currentIntern, projects, tasks, notifications, isCheckedIn, setActiveTab } = useWorkspaceStore();

  const currentEmail = (currentIntern?.email || currentUser?.email || "").trim().toLowerCase();

  // Filter tasks for current intern email or show all assigned tasks
  const internTasks = currentEmail
    ? tasks.filter((t) => (t.assignedToEmail || "").trim().toLowerCase() === currentEmail)
    : tasks;

  return (
    <div className="space-y-6">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="text-gray-900">{currentUser.username}</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Attendance Alert Banner */}
      {!isCheckedIn && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-red-700">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">No attendance on record.</span> You haven't marked attendance yet.{" "}
            <button
              onClick={() => setActiveTab("attendance")}
              className="font-bold underline hover:text-red-800"
            >
              Head to the Attendance page to get started.
            </button>
          </div>
        </div>
      )}

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-semibold text-gray-500">Total Projects</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">{projects.length}</div>
            <span className="text-[11px] text-gray-400">projects in DevTech Workspace</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-semibold text-gray-500">Completed Projects</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">
              {projects.filter((p) => p.status === "COMPLETED").length}
            </div>
            <span className="text-[11px] text-gray-400">of {projects.length} total</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-semibold text-gray-500">My Tasks</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">{internTasks.length}</div>
            <span className="text-[11px] text-gray-400">assigned to me</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-semibold text-gray-500">Pending Tasks</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">
              {internTasks.filter((t) => t.status !== "done").length}
            </div>
            <span className="text-[11px] text-gray-400">need attention</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Project Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Project Overview</h3>
              <button
                onClick={() => setActiveTab("projects")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {projects.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 font-medium">
                  No active projects assigned yet.
                </div>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 hover:text-blue-600 transition cursor-pointer">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {proj.description}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          proj.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                      <span>Due: {proj.dueDate}</span>
                      <span className="font-semibold text-gray-600">
                        Progress: {proj.progress}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & Assigned Tasks */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Notifications & Announcements</h3>
              <button
                onClick={() => setActiveTab("notifications")}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                View all ({notifications.filter((n) => n.targetEmails.includes("ALL") || (currentEmail && n.targetEmails.map(e => e.toLowerCase()).includes(currentEmail))).length})
              </button>
            </div>

            <div className="space-y-2.5">
              {!isCheckedIn && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-amber-900">Mark Today's Attendance</p>
                  <p className="text-amber-800 text-[11px]">
                    Please mark your check-in attendance for today with selfie verification.
                  </p>
                  <button
                    onClick={() => setActiveTab("attendance")}
                    className="text-blue-600 font-bold text-[11px] underline block pt-0.5"
                  >
                    Mark now →
                  </button>
                </div>
              )}

              {notifications
                .filter((n) => {
                  if (!currentEmail) return true;
                  if (n.targetEmails.includes("ALL")) return true;
                  if (n.targetEmails.map((e) => e.toLowerCase()).includes(currentEmail)) return true;
                  if (currentIntern?.domain && n.targetEmails.includes(`domain:${currentIntern.domain}`)) return true;
                  return false;
                })
                .slice(0, 3)
                .map((n) => (
                  <div key={n.id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900">{n.title}</p>
                      <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                        {n.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-2">{n.content}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Assigned Tasks Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-gray-800 text-sm">My Assigned Tasks</h3>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {internTasks.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {internTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 font-medium">
                  No tasks assigned to you yet.
                </div>
              ) : (
                internTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-gray-50 rounded-xl text-xs space-y-1.5 border border-gray-100 hover:border-blue-500 transition"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <p className="text-gray-800">{t.title}</p>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {t.priority}
                      </span>
                    </div>

                    {t.description && (
                      <p className="text-gray-500 text-[11px] line-clamp-2">
                        {t.description}
                      </p>
                    )}

                    {t.documentUrl && (
                      <div className="pt-1 border-t border-gray-200/60">
                        <a
                          href={t.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 text-blue-600 font-bold hover:underline text-[11px] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>📄 Download {t.documentName || "Task Specification.pdf"}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
