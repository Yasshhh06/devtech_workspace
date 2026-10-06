"use client";

import React, { useState } from "react";
import { FolderKanban, Search, ChevronDown, FileText, ExternalLink, Award, CheckCircle2, Clock, Send, Sparkles, MessageSquare } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function ProjectsView() {
  const { projects, tasks, submissions, currentIntern, currentUser, setActiveTab } = useWorkspaceStore();
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  const currentEmail = (currentIntern?.email || currentUser?.email || "mohiteyash940@gmail.com").trim().toLowerCase();

  // Filter tasks assigned to current intern or include all tasks assigned by admin so none are hidden
  const myAssignedTasks = tasks.length > 0
    ? tasks
    : tasks.filter((t) => {
      const assigned = (t.assignedToEmail || "").trim().toLowerCase();
      return assigned === currentEmail || assigned === "mohiteyash940@gmail.com";
    });

  // Combined project items including default projects + tasks assigned by Admin
  const allInternProjects = [
    ...myAssignedTasks.map((task) => {
      // Find submission and evaluation for this task if present
      const sub = submissions.find(
        (s) => s.internEmail.toLowerCase() === currentEmail.toLowerCase() && s.projectTitle.toLowerCase() === task.title.toLowerCase()
      );

      return {
        id: task.id,
        title: task.title,
        description: task.description || "Project task assigned by DevTech Admin",
        domain: task.domain || currentIntern?.domain || "Full Stack Web Development",
        status: sub ? (sub.status === "Approved" ? "COMPLETED" : "SUBMITTED") : "ACTIVE",
        priority: task.priority,
        dueDate: task.dueDate || "Oct 20, 2026",
        documentUrl: task.documentUrl,
        documentName: task.documentName,
        submission: sub || null,
        isTaskItem: true,
      };
    }),
    ...projects.map((p) => {
      const sub = submissions.find(
        (s) => s.internEmail.toLowerCase() === currentEmail.toLowerCase() && s.projectTitle.toLowerCase() === p.title.toLowerCase()
      );
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        domain: p.domain || "Full Stack Web Development",
        status: p.status,
        priority: p.priority,
        dueDate: p.dueDate,
        documentUrl: undefined,
        documentName: undefined,
        submission: sub || null,
        isTaskItem: false,
      };
    }),
  ];

  const filteredProjects = allInternProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(filterSearch.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchesPriority = filterPriority === "ALL" || p.priority.includes(filterPriority);
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>My Assigned Projects & Tasks</span>
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Real-Time Admin Sync
              </span>
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Tasks assigned by Admin appear here automatically. Submit deliverables and view your Admin grades and remarks!
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("submission")}
          className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-extrabold shadow transition flex items-center space-x-1.5 shrink-0"
        >
          <Send className="w-4 h-4 text-blue-600" />
          <span>Submit Project Folder</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search projects & assigned tasks..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="COMPLETED">COMPLETED / GRADED</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="ALL">All Priority</option>
              <option value="HIGH">HIGH Priority</option>
              <option value="MEDIUM">MEDIUM Priority</option>
              <option value="LOW">LOW Priority</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const sub = proj.submission;
          const isGraded = sub && sub.score !== null && sub.score !== undefined;

          return (
            <div
              key={proj.id}
              className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition"
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-snug">
                    {proj.title}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0 ml-2">
                    {proj.priority}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {proj.description}
                </p>

                {/* Attached Specification Document */}
                {proj.documentUrl && (
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="truncate">{proj.documentName || "Task_Specification_Document.pdf"}</span>
                    </div>
                    <a
                      href={proj.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1 shrink-0"
                    >
                      <span>Download Spec</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* ADMIN EVALUATION & GRADE SECTION (If Graded by Admin) */}
              {isGraded ? (
                <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>ADMIN EVALUATION & GRADE</span>
                    </span>
                    <span className="px-3 py-1 bg-emerald-600 text-white font-black rounded-full text-xs shadow">
                      SCORE: {sub.score} / 100
                    </span>
                  </div>

                  {sub.mentorRemarks && (
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900 text-gray-700 dark:text-gray-200 space-y-1">
                      <p className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Mentor Remarks & Feedback:</span>
                      </p>
                      <p className="italic text-[11px] font-medium leading-relaxed">{sub.mentorRemarks}</p>
                    </div>
                  )}
                </div>
              ) : sub ? (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs flex items-center space-x-2 text-amber-800 dark:text-amber-300">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Submitted on {sub.submittedAt}. Awaiting Admin evaluation & grade.</span>
                </div>
              ) : null}

              {/* Footer Controls */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px]">Due: {proj.dueDate}</span>

                {!sub && (
                  <button
                    onClick={() => setActiveTab("submission")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Deliverables</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
