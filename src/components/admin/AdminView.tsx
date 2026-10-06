"use client";

import React, { useState } from "react";
import {
  Users,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  CheckCircle,
  X,
  Mail,
  UserPlus,
  Loader2,
  Key,
  ShieldAlert,
  Send,
  UserCheck,
  Calendar as CalendarIcon,
  Activity,
  Check,
  Camera,
  ExternalLink,
  Award,
} from "lucide-react";
import { useWorkspaceStore, InternUser, TaskItem, ProjectSubmission, LeaveRequest } from "@/lib/store";
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
    "assign-task" | "add-intern" | "interns-catalog" | "attendance-monitor" | "leave-approvals" | "submissions-grader" | "calendar-manager" | "audit-logs"
  >("assign-task");

  const [isLoadingInterns, setIsLoadingInterns] = useState(false);
  const [dbStatusMsg, setDbStatusMsg] = useState("");

  const fetchInternsFromFirebase = async () => {
    setIsLoadingInterns(true);
    try {
      const res = await fetch("/api/interns");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        data.data.forEach((intern: any) => {
          addNewIntern({
            name: intern.name,
            email: intern.email,
            password: intern.password || "devtech123",
            domain: intern.domain || "Full Stack Web Development",
            batch: intern.batch || "DEV-2026-FS04",
          });
        });
        setDbStatusMsg("Synced with Firebase Firestore!");
        setTimeout(() => setDbStatusMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to fetch interns from Firebase:", err);
    } finally {
      setIsLoadingInterns(false);
    }
  };

  // --- 1. Domain Filter & Email Chip Task Assignment State ---
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("All Domains");
  const [emailSearchQuery, setEmailSearchQuery] = useState<string>("");
  const [chipInputEmail, setChipInputEmail] = useState<string>("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

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
    let currentEmails = [...selectedEmails];

    if (chipInputEmail.trim() && !currentEmails.includes(chipInputEmail.trim().toLowerCase())) {
      currentEmails.push(chipInputEmail.trim().toLowerCase());
      setSelectedEmails(currentEmails);
      setChipInputEmail("");
    }

    if (!assignTitle.trim() || currentEmails.length === 0) return;

    assignTaskToMultipleInterns(
      currentEmails,
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

  // --- 2. Add New Intern Form State ---
  const [newInternName, setNewInternName] = useState("");
  const [newInternEmail, setNewInternEmail] = useState("");
  const [newInternPassword, setNewInternPassword] = useState("devtech123");
  const [newInternDomain, setNewInternDomain] = useState("Full Stack Web Development");
  const [isSubmittingIntern, setIsSubmittingIntern] = useState(false);
  const [internCreatedSuccess, setInternCreatedSuccess] = useState(false);

  // --- 3. Password Reset State ---
  const [resetModalEmail, setResetModalEmail] = useState<string | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetStatusMsg, setResetStatusMsg] = useState("");
  const [isResettingPass, setIsResettingPass] = useState(false);

  const handleCreateIntern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternName.trim() || !newInternEmail.trim() || !newInternPassword.trim()) return;

    setIsSubmittingIntern(true);
    try {
      const res = await fetch("/api/interns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newInternName.trim(),
          email: newInternEmail.trim(),
          password: newInternPassword.trim(),
          domain: newInternDomain,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addNewIntern({
          name: newInternName.trim(),
          email: newInternEmail.trim(),
          password: newInternPassword.trim(),
          domain: newInternDomain,
          batch: "DEV-2026-FS04",
        });

        setNewInternName("");
        setNewInternEmail("");
        setNewInternPassword("devtech123");
        setInternCreatedSuccess(true);
        setTimeout(() => setInternCreatedSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting intern:", err);
    } finally {
      setIsSubmittingIntern(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalEmail || !resetNewPassword.trim()) return;

    setIsResettingPass(true);
    try {
      const res = await fetch("/api/interns/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetModalEmail,
          newPassword: resetNewPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetStatusMsg(`Password for ${resetModalEmail} successfully updated in Firebase!`);
        setTimeout(() => {
          setResetStatusMsg("");
          setResetModalEmail(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    } finally {
      setIsResettingPass(false);
    }
  };

  // --- Submission Evaluation State ---
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState<number>(90);
  const [evalStatus, setEvalStatus] = useState<"Approved" | "Needs Revision">("Approved");
  const [evalRemarks, setEvalRemarks] = useState<string>("");

  const handleSaveEvaluation = (subId: string) => {
    evaluateSubmission(subId, evalScore, evalStatus, evalRemarks);
    setEvaluatingSubId(null);
    setEvalRemarks("");
  };

  // --- Holiday Manager Form State ---
  const [holidayDate, setHolidayDate] = useState("2026-10-20");
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayType, setHolidayType] = useState<"Holiday" | "Flexible Workday" | "Announcement">("Holiday");

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle.trim()) return;
    addHoliday({ date: holidayDate, title: holidayTitle, type: holidayType });
    setHolidayTitle("");
  };

  const [previewSelfieUrl, setPreviewSelfieUrl] = useState<string | null>(null);

  // EXPORT HANDLERS
  const exportInternsExcel = () => {
    const data = registeredInterns.map((i) => ({
      ID: i.id,
      Name: i.name,
      Email: i.email,
      Domain: i.domain,
      Password: i.password || "devtech123",
    }));
    exportToCSV("DevTech_Interns_Roster", data);
  };

  const exportInternsPDF = () => {
    const headers = ["ID", "Name", "Email", "Domain Track", "Password"];
    const rows = registeredInterns.map((i) => [i.id, i.name, i.email, i.domain, i.password || "devtech123"]);
    exportToPDF("Intern Roster & Credentials", headers, rows);
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
    }));
    exportToCSV("DevTech_Project_Submissions_Grades", data);
  };

  const exportSubmissionsPDF = () => {
    const headers = ["Intern Name", "Email", "Project Title", "Submitted At", "Status", "Score"];
    const rows = submissions.map((s) => [
      s.internName,
      s.internEmail,
      s.projectTitle,
      s.submittedAt,
      s.status,
      s.score !== null && s.score !== undefined ? `${s.score}/100` : "Pending",
    ]);
    exportToPDF("Project Deliverable Submissions & Grades", headers, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
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
                Firebase Realtime Firestore DB
              </span>
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Synced across all mobile phones and laptops in real-time!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {dbStatusMsg && (
            <span className="text-xs font-bold text-emerald-200 bg-emerald-900/60 border border-emerald-400/30 px-3 py-1 rounded-full">
              {dbStatusMsg}
            </span>
          )}

          <button
            onClick={fetchInternsFromFirebase}
            disabled={isLoadingInterns}
            className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 border border-blue-500/30"
          >
            <Loader2 className={`w-3.5 h-3.5 ${isLoadingInterns ? "animate-spin" : ""}`} />
            <span>Firebase Sync</span>
          </button>

          <button
            onClick={exportSubmissionsExcel}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>

          <button
            onClick={exportSubmissionsPDF}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
        <button
          onClick={() => setActiveAdminSubTab("assign-task")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "assign-task"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Assign Task</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("interns-catalog")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "interns-catalog"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Interns ({registeredInterns.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("add-intern")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "add-intern"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Intern</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("attendance-monitor")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "attendance-monitor"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Attendance & Selfies ({attendanceHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("submissions-grader")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "submissions-grader"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Grade Submissions ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("leave-approvals")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "leave-approvals"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Leave Approvals ({leaveRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("calendar-manager")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "calendar-manager"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("audit-logs")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeAdminSubTab === "audit-logs"
              ? "bg-blue-600 text-white shadow-md font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: ASSIGN TASK ================= */}
      {activeAdminSubTab === "assign-task" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  <span>Assign Task to Multi-Domain Interns</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter by domain, type or paste email addresses, tag multiple interns as chips, and attach specification documents!
                </p>
              </div>
            </div>

            {taskAssignSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Task assigned successfully to {selectedEmails.length} target intern email(s)!</span>
              </div>
            )}

            {/* Domain Filter Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Step 1: Filter Interns by Domain Track</label>
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
                          : "bg-slate-100 text-slate-600 hover:bg-blue-50"
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

            {/* Gmail Chip Input Box */}
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
                    className="flex-1 min-w-[200px] bg-transparent text-xs text-slate-900 focus:outline-none py-1 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleAssignTaskMulti} className="space-y-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Task Instructions</label>
                <textarea
                  rows={3}
                  value={assignDescription}
                  onChange={(e) => setAssignDescription(e.target.value)}
                  placeholder="Detailed steps, API specs..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
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
                disabled={selectedEmails.length === 0 && !chipInputEmail.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign Task to {selectedEmails.length || (chipInputEmail.trim() ? 1 : 0)} Tagged Intern Email(s)</span>
              </button>
            </form>
          </div>

          {/* Assigned Tasks Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center justify-between">
              <span>Assigned Tasks ({tasks.length})</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{tasks.length}</span>
            </h4>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 text-xs">
              {tasks.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">No tasks assigned yet.</p>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate">{t.title}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                        {t.priority}
                      </span>
                    </div>

                    <p className="text-slate-500 text-[11px]">
                      Assigned to: <strong>{t.assignedToName}</strong> ({t.assignedToEmail})
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: INTERNS CATALOG WITH PASSWORD RESET ================= */}
      {activeAdminSubTab === "interns-catalog" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                DevTech Registered Intern Directory ({registeredInterns.length} Total Interns)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time Firebase Firestore synced accounts. Use Change Password button to set new passwords.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportInternsExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel Export</span>
              </button>
              <button
                onClick={exportInternsPDF}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Intern Full Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Domain Track</th>
                  <th className="py-3 px-4">Login Password</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {registeredInterns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No interns registered yet. Go to "Add New Intern" tab to create intern accounts.
                    </td>
                  </tr>
                ) : (
                  registeredInterns.map((intern) => (
                    <tr key={intern.email} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{intern.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600">{intern.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {intern.domain}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {intern.password || "devtech123"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setResetModalEmail(intern.email);
                            setResetNewPassword(intern.password || "devtech123");
                          }}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-lg text-[11px] inline-flex items-center space-x-1 transition"
                        >
                          <Key className="w-3 h-3 text-amber-600" />
                          <span>Change Password</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: ADD NEW INTERN ACCOUNT ================= */}
      {activeAdminSubTab === "add-intern" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Intern Account (Firebase Sync)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Register a new intern account with Email & Password. Saved directly to Firebase Firestore!
              </p>
            </div>

            {internCreatedSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  New intern account registered in Firebase Firestore! Mobile phone & laptop can both log in immediately with these credentials.
                </span>
              </div>
            )}

            <form onSubmit={handleCreateIntern} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Intern Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={newInternName}
                    onChange={(e) => setNewInternName(e.target.value)}
                    placeholder="e.g. Rahul Patil"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Intern Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={newInternEmail}
                    onChange={(e) => setNewInternEmail(e.target.value)}
                    placeholder="rahul.patil@devtechitsolution.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={newInternPassword}
                    onChange={(e) => setNewInternPassword(e.target.value)}
                    placeholder="e.g. devtech123"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Domain Track</label>
                  <input
                    type="text"
                    required
                    value={newInternDomain}
                    onChange={(e) => setNewInternDomain(e.target.value)}
                    placeholder="e.g. Full Stack Web Development"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingIntern}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                {isSubmittingIntern ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>SAVING TO FIREBASE FIRESTORE...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>CREATE & REGISTER INTERN ACCOUNT IN FIREBASE</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center justify-between">
              <span>Firebase Registered Accounts</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {registeredInterns.length}
              </span>
            </h4>
            <div className="space-y-3 max-h-[380px] overflow-y-auto text-xs">
              {registeredInterns.map((intern) => (
                <div key={intern.email} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{intern.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Firebase Realtime
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] truncate">{intern.email}</p>
                  <p className="text-[10px] font-mono text-slate-700">Password: {intern.password || "devtech123"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: ATTENDANCE & SELFIES MONITOR ================= */}
      {activeAdminSubTab === "attendance-monitor" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <span>Attendance Log & WebRTC Photo Verification ({attendanceHistory.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time Firestore check-in logs with web selfie images and IP address verification.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Intern Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check-in Time</th>
                  <th className="py-3 px-4">Selfie Photo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {attendanceHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No attendance marked yet. Interns can mark check-in from their dashboard.
                    </td>
                  </tr>
                ) : (
                  attendanceHistory.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{att.internName}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600">{att.internEmail}</td>
                      <td className="py-3.5 px-4 font-mono">{att.date}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{att.time || "09:30 AM"}</td>
                      <td className="py-3.5 px-4">
                        {att.selfieUrl ? (
                          <button
                            onClick={() => setPreviewSelfieUrl(att.selfieUrl!)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded-lg text-[10px] inline-flex items-center space-x-1"
                          >
                            <Camera className="w-3 h-3 text-blue-600" />
                            <span>View Photo</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">No Photo</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">{att.ipAddress || "103.21.124.5"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 5: SUBMISSIONS GRADER & EVALUATOR ================= */}
      {activeAdminSubTab === "submissions-grader" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Send className="w-5 h-5 text-blue-600" />
                <span>Project Deliverable Submissions Grader ({submissions.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted Google Drive folder links, evaluate quality, and assign marks (0-100).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportSubmissionsExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel Export</span>
              </button>
              <button
                onClick={exportSubmissionsPDF}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Intern Full Name</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Drive Link</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No project deliverables submitted yet. Interns can submit drive links from Submissions view.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sub.internName}
                        <span className="block text-[10px] font-semibold text-blue-600">{sub.internEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{sub.projectTitle}</td>
                      <td className="py-3.5 px-4">
                        <a
                          href={sub.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold hover:underline inline-flex items-center space-x-1"
                        >
                          <span>Drive Folder</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{sub.submittedAt}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            sub.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : sub.status === "Needs Revision"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sub.score !== null && sub.score !== undefined ? (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {sub.score} / 100
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Graded</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setEvaluatingSubId(sub.id);
                            setEvalScore(sub.score || 90);
                            setEvalStatus(sub.status === "Approved" ? "Approved" : "Approved");
                            setEvalRemarks(sub.mentorRemarks || "");
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition"
                        >
                          Grade & Score
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 6: LEAVE & WFH APPROVALS ================= */}
      {activeAdminSubTab === "leave-approvals" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>Leave & Work From Home (WFH) Approvals ({leaveRequests.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review incoming leave applications and update approval status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Intern Name</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No leave applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {req.internName}
                        <span className="block text-[10px] font-semibold text-blue-600">{req.internEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">{req.type}</td>
                      <td className="py-3.5 px-4 font-mono">{req.startDate} → {req.endDate}</td>
                      <td className="py-3.5 px-4 text-slate-600">{req.reason}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            req.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => updateLeaveStatus(req.id, "Approved", "Approved by Admin")}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(req.id, "Rejected", "Rejected by Admin")}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EVALUATION MODAL */}
      {evaluatingSubId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Evaluate Deliverable Submission</span>
              </h3>
              <button onClick={() => setEvaluatingSubId(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Score / Grade (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={evalScore}
                  onChange={(e) => setEvalScore(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Status</label>
                <select
                  value={evalStatus}
                  onChange={(e) => setEvalStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="Approved">Approved</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentor Remarks</label>
                <textarea
                  rows={3}
                  value={evalRemarks}
                  onChange={(e) => setEvalRemarks(e.target.value)}
                  placeholder="Feedback for intern..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluatingSubId(null)}
                  className="px-4 py-2 border border-slate-300 font-bold text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEvaluation(evaluatingSubId)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SELFIE PHOTO MODAL */}
      {previewSelfieUrl && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-slate-900 text-xs">WebRTC Selfie Verification</h4>
              <button onClick={() => setPreviewSelfieUrl(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <img src={previewSelfieUrl} alt="Intern Check-in Selfie" className="w-full h-64 object-cover rounded-xl border" />
            <button
              onClick={() => setPreviewSelfieUrl(null)}
              className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
            >
              Close Photo Preview
            </button>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetModalEmail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Reset Intern Password (Firebase Firestore)</span>
              </div>
              <button onClick={() => setResetModalEmail(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetStatusMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold">
                {resetStatusMsg}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Intern Email</label>
                <input
                  type="text"
                  disabled
                  value={resetModalEmail}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Login Password *</label>
                <input
                  required
                  type="text"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="Enter new password (e.g. devtech2026)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalEmail(null)}
                  className="px-4 py-2 border border-slate-300 font-bold text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPass}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs flex items-center space-x-1.5"
                >
                  {isResettingPass ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Key className="w-4 h-4 text-white" />
                  )}
                  <span>Update Password in Firebase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
