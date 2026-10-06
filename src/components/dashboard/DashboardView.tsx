"use client";

import React from "react";
import { Folder, CheckCircle, Users, AlertTriangle, ArrowRight, FileText, ExternalLink } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function DashboardView() {
  const { currentUser, currentIntern, projects, tasks, isCheckedIn, setActiveTab } = useWorkspaceStore();

  const currentEmail = (currentIntern?.email || currentUser?.email || "mohiteyash940@gmail.com").trim().toLowerCase();

  // Filter tasks for current intern email or show all assigned tasks
  const internTasks = tasks.length > 0
    ? tasks
    : tasks.filter((t) => {
        const assigned = (t.assignedToEmail || "").trim().toLowerCase();
        return assigned === currentEmail || assigned === "mohiteyash940@gmail.com";
      });

  return (
    <div className="space-y-6">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-gray-900 dark:text-white">{currentUser.username}</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Attendance Alert Banner */}
      {!isCheckedIn && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-red-700 dark:text-red-400">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">No attendance on record.</span> You haven't marked attendance yet.{" "}
            <button
              onClick={() => setActiveTab("attendance")}
              className="font-bold underline hover:text-red-800 dark:hover:text-red-300"
            >
              Head to the Attendance page to get started.
            </button>
          </div>
        </div>
      )}

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Projects</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{projects.length}</div>
            <span className="text-[11px] text-gray-400">projects in DevTech Workspace</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Completed Projects</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {projects.filter((p) => p.status === "COMPLETED").length}
            </div>
            <span className="text-[11px] text-gray-400">of {projects.length} total</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">My Tasks</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{internTasks.length}</div>
            <span className="text-[11px] text-gray-400">assigned to me</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pending Tasks</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {internTasks.filter((t) => t.status !== "done").length}
            </div>
            <span className="text-[11px] text-gray-400">need attention</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Project Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Project Overview</h3>
              <button
                onClick={() => setActiveTab("projects")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {projects.map((proj) => (
                <div key={proj.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 transition cursor-pointer">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        proj.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span>Jun 20, 2026</span>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Progress: {proj.progress}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & Assigned Tasks with Attached Documents */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Notifications</h3>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">View all</span>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs space-y-1">
                <p className="font-bold text-gray-800 dark:text-gray-200">Mark attendance</p>
                <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                  Please mark your attendance for today.
                </p>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] underline block pt-1"
                >
                  Mark now
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs space-y-1">
                <p className="font-bold text-gray-800 dark:text-gray-200">Dear Devtech Intern</p>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                  As part of our analysis of your completed project, we require a Serper API key to proceed with the analysis...
                </p>
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] cursor-pointer block pt-1">
                  Fill Now
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Tasks Card (With Document Attachments!) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">My Assigned Tasks</h3>
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {internTasks.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {internTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 border border-gray-100 dark:border-slate-800 hover:border-blue-500 transition"
                >
                  <div className="flex items-center justify-between font-bold">
                    <p className="text-gray-800 dark:text-gray-200">{t.title}</p>
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                      {t.priority}
                    </span>
                  </div>

                  {t.description && (
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] line-clamp-2">
                      {t.description}
                    </p>
                  )}

                  {/* Attached Specification Document */}
                  {t.documentUrl && (
                    <div className="pt-1 border-t border-gray-200/60 dark:border-slate-700/60">
                      <a
                        href={t.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline text-[11px] bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>📄 Download {t.documentName || "Task Specification.pdf"}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
