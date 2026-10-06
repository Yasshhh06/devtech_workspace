"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  PlusCircle,
  Camera,
  CalendarCheck,
  Send,
  UserCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  Award,
  Users,
  Search,
  Check,
  Clock,
  Plus,
  Mail,
  X,
  Filter,
  Paperclip,
  FileText,
  UserPlus,
  Sparkles,
  Download,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";

export default function AdminView() {
  const {
    registeredInterns,
    addNewIntern,
    tasks,
    assignTaskToMultipleInterns,
    attendanceHistory,
    leaveRequests,
    updateLeaveStatus,
    submissions,
    evaluateSubmission,
    holidays,
    addHoliday,
    auditLogs,
  } = useWorkspaceStore();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    "assign-task" | "interns-catalog" | "attendance-monitor" | "leave-approvals" | "submissions-grader" | "calendar-manager"
  >("assign-task");

  // --- 1. Domain Filter & Email Chip Task Assignment State ---
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("All Domains");
  const [emailSearchQuery, setEmailSearchQuery] = useState<string>("");
  const [chipInputEmail, setChipInputEmail] = useState<string>("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>(["mohiteyash940@gmail.com"]);

  const [assignTitle, setAssignTitle] = useState("");
  const [assignDescription, setAssignDescription] = useState("");
  const [assignPriority, setAssignPriority] = useState<"HIGH Priority" | "MEDIUM Priority" | "LOW Priority">("HIGH Priority");
  const [assignDueDate, setAssignDueDate] = useState("2026-10-15");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [taskAssignSuccess, setTaskAssignSuccess] = useState(false);
  const domainsList = [
    "All Domains",
    "Full Stack Web Development",
    "Python & AI/ML",
    "Data Analytics",
    "Cloud & DevOps",
    "Cyber Security",
    "UI/UX Design",
  ];

  const filteredInterns = registeredInterns.filter((intern) => {
    const matchesDomain = selectedDomainFilter === "All Domains" || intern.domain === selectedDomainFilter;
    const matchesSearch =
      intern.name.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
      intern.email.toLowerCase().includes(emailSearchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleAddChipEmail = (emailToAdd: string) => {
    const cleaned = emailToAdd.trim().toLowerCase();
    if (!cleaned) return;
    if (!selectedEmails.includes(cleaned)) {
      setSelectedEmails([...selectedEmails, cleaned]);
    }
    setChipInputEmail("");
  };

  const handleChipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddChipEmail(chipInputEmail);
    }
  };

  const removeEmailChip = (emailToRemove: string) => {
    setSelectedEmails(selectedEmails.filter((e) => e !== emailToRemove));
  };

  const toggleInternSelection = (email: string) => {
    const cleaned = email.toLowerCase();
    if (selectedEmails.includes(cleaned)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== cleaned));
    } else {
      setSelectedEmails([...selectedEmails, cleaned]);
    }
  };

  const selectAllInDomain = () => {
    const visibleEmails = filteredInterns.map((i) => i.email.toLowerCase());
    const allSelected = visibleEmails.every((e) => selectedEmails.includes(e));

    if (allSelected) {
      setSelectedEmails(selectedEmails.filter((e) => !visibleEmails.includes(e)));
    } else {
      const combined = Array.from(new Set([...selectedEmails, ...visibleEmails]));
      setSelectedEmails(combined);
    }
  };

  const handleAssignTaskMulti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || selectedEmails.length === 0) return;

    assignTaskToMultipleInterns(
      selectedEmails,
      assignTitle,
      assignDescription,
      assignPriority,
      assignDueDate,
      documentUrl,
      documentName,
      selectedDomainFilter !== "All Domains" ? selectedDomainFilter : "Full Stack Web Development"
    );

    setAssignTitle("");
    setAssignDescription("");
    setDocumentUrl("");
    setDocumentName("");
    setTaskAssignSuccess(true);
    setTimeout(() => setTaskAssignSuccess(false), 4000);
  };

  // --- 2. Submission Evaluation Modal / Inline State ---
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState<number>(95);
  const [evalStatus, setEvalStatus] = useState<"Approved" | "Needs Revision">("Approved");
  const [evalRemarks, setEvalRemarks] = useState<string>("");

  const handleSaveEvaluation = (subId: string) => {
    evaluateSubmission(subId, evalScore, evalStatus, evalRemarks);
    setEvaluatingSubId(null);
    setEvalRemarks("");
  };

  // --- 3. Holiday Manager Form State ---
  const [holidayDate, setHolidayDate] = useState("2026-10-20");
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayType, setHolidayType] = useState<"Holiday" | "Flexible Workday" | "Announcement">("Holiday");

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle.trim()) return;
    addHoliday({ date: holidayDate, title: holidayTitle, type: holidayType });
    setHolidayTitle("");
  };

  // --- 4. Photo Selfie Modal Preview State ---
  const [previewSelfieUrl, setPreviewSelfieUrl] = useState<string | null>(null);

  // Counters
  const pendingSubmissionsCount = submissions.filter((s) => s.status === "Awaiting Evaluation").length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === "Pending").length;

  // --- 5. Export Handlers for Excel (.csv) and PDF ---
  const exportInternsExcel = () => {
    const data = registeredInterns.map((i) => ({
      ID: i.id,
      Name: i.name,
      Email: i.email,
      Batch: i.batch,
      Domain: i.domain,
      College: i.college || "N/A",
      Mentor: i.mentor || "N/A",
    }));
    exportToCSV("DevTech_Interns_Roster", data);
  };

  const exportInternsPDF = () => {
    const headers = ["ID", "Name", "Email", "Batch", "Domain Track", "Mentor"];
    const rows = registeredInterns.map((i) => [i.id, i.name, i.email, i.batch, i.domain, i.mentor || "Rahul Sharma"]);
    exportToPDF("Intern Roster & Credentials", headers, rows);
  };

  const exportAttendanceExcel = () => {
    const data = attendanceHistory.map((a) => ({
      Intern_Name: a.internName,
      Intern_Email: a.internEmail,
      Date: a.date,
      Time: a.time || "N/A",
      Status: a.status,
      IP_Address: a.ipAddress || "103.21.124.5",
    }));
    exportToCSV("DevTech_Attendance_Logs", data);
  };

  const exportSubmissionsExcel = () => {
    const data = submissions.map((s) => ({
      ID: s.id,
      Intern_Name: s.internName,
      Intern_Email: s.internEmail,
      Project_Title: s.projectTitle,
      Google_Drive_Link: s.driveLink,
      Submitted_At: s.submittedAt,
      Status: s.status,
      Score: s.score !== null && s.score !== undefined ? `${s.score}/100` : "Unrated",
      Mentor_Remarks: s.mentorRemarks || "",
    }));
    exportToCSV("DevTech_Project_Submissions_Grades", data);
  };

  const exportSubmissionsPDF = () => {
    const headers = ["Intern Name", "Email", "Project Title", "Submitted At", "Status", "Score", "Remarks"];
    const rows = submissions.map((s) => [
      s.internName,
      s.internEmail,
      s.projectTitle,
      s.submittedAt,
      s.status,
      s.score !== null && s.score !== undefined ? `${s.score}/100` : "Pending",
      s.mentorRemarks || "-",
    ]);
    exportToPDF("Project Deliverable Submissions & Grades", headers, rows);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>Admin & Mentor Control Portal</span>
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Full Management Mode
              </span>
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Assign tasks by email, review check-in selfies, approve leaves, grade submissions, and export PDF/Excel reports.
            </p>
          </div>
        </div>

        {/* EXPORT ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportSubmissionsExcel}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5"
            title="Download Excel / CSV of all Submissions & Grades"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>

          <button
            onClick={exportSubmissionsPDF}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5"
            title="Download PDF Report of Submissions & Grades"
          >
            <Printer className="w-4 h-4" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Total Interns</span>
            <span className="text-lg font-bold text-slate-900">{registeredInterns.length} Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Pending Reviews</span>
            <span className="text-lg font-bold text-slate-900">{pendingSubmissionsCount} Submissions</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Pending Leaves</span>
            <span className="text-lg font-bold text-slate-900">{pendingLeavesCount} Requests</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Today's Check-ins</span>
            <span className="text-lg font-bold text-slate-900">
              {attendanceHistory.filter((a) => a.status === "Present" && a.date === "2026-10-06").length} / {registeredInterns.length}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveAdminSubTab("assign-task")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "assign-task"
              ? "bg-white text-blue-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Assign Task by Email</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("attendance-monitor")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "attendance-monitor"
              ? "bg-white text-blue-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Attendance & Selfies</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("submissions-grader")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition relative ${
            activeAdminSubTab === "submissions-grader"
              ? "bg-white text-blue-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Grade Submissions</span>
          {pendingSubmissionsCount > 0 && (
            <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              {pendingSubmissionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminSubTab("leave-approvals")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition relative ${
            activeAdminSubTab === "leave-approvals"
              ? "bg-white text-blue-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Leave Approvals</span>
          {pendingLeavesCount > 0 && (
            <span className="bg-purple-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              {pendingLeavesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminSubTab("calendar-manager")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "calendar-manager"
              ? "bg-white text-blue-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Calendar Manager</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: GMAIL-STYLE EMAIL CHIP TASK ASSIGNMENT ================= */}
      {activeAdminSubTab === "assign-task" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Assign Task to 50+ Multi-Domain Interns</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Filter by domain, type or paste email addresses, tag multiple interns as chips, and attach specification documents!
              </p>
            </div>

            {taskAssignSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Task assigned successfully to {selectedEmails.length} target intern email(s)!</span>
              </div>
            )}

            {/* DOMAIN FILTER TABS */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Step 1: Filter Interns by Domain Track
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {domainsList.map((dom) => {
                  const count =
                    dom === "All Domains"
                      ? registeredInterns.length
                      : registeredInterns.filter((i) => i.domain === dom).length;
                  const isActive = selectedDomainFilter === dom;
                  return (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => setSelectedDomainFilter(dom)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>{dom}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive ? "bg-white text-blue-700 font-bold" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GMAIL-STYLE EMAIL CHIP TAG INPUT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Step 2: Selected Intern Emails ({selectedEmails.length} Tagged) *
                </label>
                <button
                  type="button"
                  onClick={selectAllInDomain}
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    {filteredInterns.every((i) => selectedEmails.includes(i.email.toLowerCase()))
                      ? `Deselect All in ${selectedDomainFilter}`
                      : `Select All ${filteredInterns.length} in ${selectedDomainFilter}`}
                  </span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-300 rounded-2xl space-y-2 focus-within:ring-2 focus-within:ring-blue-600 transition">
                <div className="flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto">
                  {selectedEmails.map((email) => {
                    const internObj = registeredInterns.find((i) => i.email.toLowerCase() === email);
                    return (
                      <span
                        key={email}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        <Mail className="w-3 h-3 text-blue-200" />
                        <span>{internObj ? `${internObj.name} (${email})` : email}</span>
                        <button
                          type="button"
                          onClick={() => removeEmailChip(email)}
                          className="hover:bg-blue-700 p-0.5 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  <input
                    type="email"
                    value={chipInputEmail}
                    onChange={(e) => setChipInputEmail(e.target.value)}
                    onKeyDown={handleChipKeyDown}
                    placeholder={
                      selectedEmails.length === 0
                        ? "Type intern email and press Enter..."
                        : "Type more emails..."
                    }
                    className="flex-1 min-w-[200px] bg-transparent text-xs text-slate-900 focus:outline-none py-1 font-medium placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* QUICK SELECTION CATALOG */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Quick Pick Interns ({filteredInterns.length} available)
                </span>
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                  <input
                    type="text"
                    value={emailSearchQuery}
                    onChange={(e) => setEmailSearchQuery(e.target.value)}
                    placeholder="Search intern..."
                    className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-[11px] text-slate-900 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                {filteredInterns.slice(0, 20).map((intern) => {
                  const isSelected = selectedEmails.includes(intern.email.toLowerCase());
                  return (
                    <div
                      key={intern.email}
                      onClick={() => toggleInternSelection(intern.email)}
                      className={`p-2 rounded-xl cursor-pointer border transition flex items-center justify-between text-xs ${
                        isSelected
                          ? "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                          : "bg-white border-slate-200 hover:border-blue-300 text-slate-800"
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-bold truncate text-slate-900">{intern.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{intern.email}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleAssignTaskMulti} className="space-y-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  required
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Build Payment Gateway Webhook Integration & Unit Tests"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Task Instructions
                </label>
                <textarea
                  rows={3}
                  value={assignDescription}
                  onChange={(e) => setAssignDescription(e.target.value)}
                  placeholder="Detailed steps, API specs..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Document Attachment */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center space-x-2 text-blue-800 font-bold">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  <span>Attach Specification Document Link</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[11px] mb-1 text-slate-700">Document Title</label>
                    <input
                      type="text"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="e.g. PRD_Spec.pdf"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[11px] mb-1 text-slate-700">Document URL</label>
                    <input
                      type="url"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  >
                    <option value="HIGH Priority">HIGH Priority</option>
                    <option value="MEDIUM Priority">MEDIUM Priority</option>
                    <option value="LOW Priority">LOW Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={selectedEmails.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign Task to {selectedEmails.length} Tagged Intern Email(s)</span>
              </button>
            </form>
          </div>

          {/* Assigned Tasks Summary Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Recently Assigned Tasks ({tasks.length})
            </h4>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {tasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="truncate">{t.title}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Assigned to: <strong>{t.assignedToName}</strong> ({t.assignedToEmail})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: ATTENDANCE & SELFIE MONITOR ================= */}
      {activeAdminSubTab === "attendance-monitor" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Intern Attendance & Selfie Verification</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review check-in timestamps, status, and WebRTC selfie photos submitted by interns.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Date: Oct 06, 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Intern Name & Email</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Captured Selfie</th>
                  <th className="py-3 px-4">IP Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {attendanceHistory.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{att.internName}</p>
                      <p className="text-[11px] text-slate-500">{att.internEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {att.date} {att.time ? `• ${att.time}` : ""}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          att.status === "Present"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {att.selfieUrl ? (
                        <button
                          onClick={() => setPreviewSelfieUrl(att.selfieUrl!)}
                          className="flex items-center space-x-1.5 text-blue-600 hover:underline font-semibold"
                        >
                          <img src={att.selfieUrl} alt="Selfie" className="w-8 h-8 rounded-full object-cover border border-blue-400" />
                          <span>View Photo</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Selfie</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{att.ipAddress || "103.21.124.5"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: LEAVE & WFH APPROVALS ================= */}
      {activeAdminSubTab === "leave-approvals" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Leave & WFH Applications</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approve or reject intern leave requests. Approved leaves will not count as absent days.
            </p>
          </div>

          <div className="space-y-4">
            {leaveRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{req.internName}</span>
                    <span className="text-[11px] text-slate-500">({req.internEmail})</span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {req.type}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    Dates: <strong>{req.startDate}</strong> to <strong>{req.endDate}</strong>
                  </p>
                  <p className="text-slate-600 italic">"Reason: {req.reason}"</p>
                  {req.adminRemark && (
                    <p className="text-blue-600 font-medium">Admin Remark: {req.adminRemark}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {req.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => updateLeaveStatus(req.id, "Approved", "Approved by Admin.")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-xs transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => updateLeaveStatus(req.id, "Rejected", "Rejected due to upcoming project milestone.")}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-xs transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: SUBMISSIONS EVALUATION & SCORING ================= */}
      {activeAdminSubTab === "submissions-grader" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Project Submissions Grader</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review Google Drive folder submissions, test datasets, assign score (0-100), and write code remarks.
            </p>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{sub.projectTitle}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Submitted by: <strong>{sub.internName}</strong> ({sub.internEmail}) • {sub.submittedAt}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold w-fit ${
                      sub.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : sub.status === "Needs Revision"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {sub.status} {sub.score !== null && sub.score !== undefined ? `(${sub.score}/100)` : ""}
                  </span>
                </div>

                {/* Google Drive Link */}
                <div className="flex items-center space-x-2 text-blue-600 font-bold">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <a href={sub.driveLink} target="_blank" rel="noreferrer" className="hover:underline truncate">
                    {sub.driveLink}
                  </a>
                </div>

                {sub.adminNote && (
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    "Intern Note: {sub.adminNote}"
                  </p>
                )}

                {/* Evaluation Form / Display */}
                {evaluatingSubId === sub.id ? (
                  <div className="mt-3 p-4 bg-white rounded-xl border border-blue-300 space-y-3 shadow-xs">
                    <h5 className="font-bold text-slate-900">Grade Submission</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Score (0-100)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={evalScore}
                          onChange={(e) => setEvalScore(Number(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Evaluation Decision</label>
                        <select
                          value={evalStatus}
                          onChange={(e) => setEvalStatus(e.target.value as any)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold"
                        >
                          <option value="Approved">Approved - Pass</option>
                          <option value="Needs Revision">Needs Revision</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Mentor Code Remarks & Feedback</label>
                      <textarea
                        rows={2}
                        value={evalRemarks}
                        onChange={(e) => setEvalRemarks(e.target.value)}
                        placeholder="Excellent folder structure. Source code clean and documentation complete..."
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveEvaluation(sub.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition"
                      >
                        Save Evaluation
                      </button>
                      <button onClick={() => setEvaluatingSubId(null)} className="px-4 py-2 text-slate-500 font-medium text-xs hover:underline">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    {sub.mentorRemarks ? (
                      <p className="text-slate-700 text-[11px]">
                        <strong>Mentor Remarks:</strong> {sub.mentorRemarks}
                      </p>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Not evaluated yet.</span>
                    )}

                    <button
                      onClick={() => {
                        setEvaluatingSubId(sub.id);
                        setEvalScore(sub.score || 95);
                        setEvalRemarks(sub.mentorRemarks || "");
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1 shadow-xs transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{sub.status === "Awaiting Evaluation" ? "Evaluate & Score" : "Edit Score"}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 5: CALENDAR MANAGER ================= */}
      {activeAdminSubTab === "calendar-manager" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Holiday Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Add Company Calendar Event</h3>

            <form onSubmit={handleAddHoliday} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Event Name</label>
                <input
                  required
                  type="text"
                  value={holidayTitle}
                  onChange={(e) => setHolidayTitle(e.target.value)}
                  placeholder="e.g. Diwali Festival Public Holiday"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Type</label>
                <select
                  value={holidayType}
                  onChange={(e) => setHolidayType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                >
                  <option value="Holiday">Company Holiday</option>
                  <option value="Flexible Workday">Flexible Workday</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1 shadow-xs transition">
                <Plus className="w-4 h-4" />
                <span>Add Event to Calendar</span>
              </button>
            </form>
          </div>

          {/* Active Calendar Holidays List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Active Workspace Calendar Events</h3>

            <div className="space-y-3">
              {holidays.map((h) => (
                <div key={h.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{h.title}</h4>
                    <p className="text-slate-500 font-medium text-[11px]">Date: {h.date}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-1 rounded-full text-[10px]">
                    {h.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selfie Preview Modal */}
      {previewSelfieUrl && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-2xl max-w-md w-full space-y-3 relative text-center shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900">Captured Check-in Selfie</h4>
            <img src={previewSelfieUrl} alt="Selfie" className="w-full h-72 object-cover rounded-xl border border-slate-200" />
            <button
              onClick={() => setPreviewSelfieUrl(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
