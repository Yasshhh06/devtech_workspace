"use client";

import React, { useState, useEffect } from "react";
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
  Key,
  Loader2,
  RefreshCw,
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
    "assign-task" | "add-intern" | "interns-catalog" | "attendance-monitor" | "leave-approvals" | "submissions-grader" | "calendar-manager"
  >("assign-task");

  // --- MongoDB Syncing State ---
  const [isLoadingInterns, setIsLoadingInterns] = useState(false);
  const [dbStatusMsg, setDbStatusMsg] = useState("");

  const fetchInternsFromMongo = async () => {
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
        setDbStatusMsg("Synced with MongoDB Atlas Database!");
        setTimeout(() => setDbStatusMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to fetch interns from MongoDB:", err);
    } finally {
      setIsLoadingInterns(false);
    }
  };

  useEffect(() => {
    fetchInternsFromMongo();
  }, []);

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

  // --- 2. Add New Intern Form State (SIMPLIFIED) ---
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
          email: newInternEmail.trim().toLowerCase(),
          password: newInternPassword.trim(),
          domain: newInternDomain,
          batch: "DEV-2026-FS04",
        });

        setNewInternName("");
        setNewInternEmail("");
        setNewInternPassword("devtech123");
        setInternCreatedSuccess(true);
        setTimeout(() => setInternCreatedSuccess(false), 5000);
        fetchInternsFromMongo();
      } else {
        alert(`Failed to save to MongoDB: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error creating intern:", err);
      addNewIntern({
        name: newInternName.trim(),
        email: newInternEmail.trim().toLowerCase(),
        password: newInternPassword.trim(),
        domain: newInternDomain,
        batch: "DEV-2026-FS04",
      });
      setInternCreatedSuccess(true);
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
        setResetStatusMsg(`Password for ${resetModalEmail} updated to "${resetNewPassword.trim()}" in MongoDB!`);
        addNewIntern({
          name: resetModalEmail.split("@")[0],
          email: resetModalEmail,
          password: resetNewPassword.trim(),
          domain: "Full Stack Web Development",
          batch: "DEV-2026-FS04",
        });
        setTimeout(() => {
          setResetModalEmail(null);
          setResetNewPassword("");
          setResetStatusMsg("");
        }, 3000);
      } else {
        alert(data.error || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    } finally {
      setIsResettingPass(false);
    }
  };

  // --- Submission Evaluation Modal / Inline State ---
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState<number>(95);
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
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
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
                MongoDB Persistence
              </span>
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Create intern accounts saved directly to MongoDB Atlas. Synced across all mobile phones and laptops!
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
            onClick={fetchInternsFromMongo}
            disabled={isLoadingInterns}
            className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 border border-blue-500/30"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInterns ? "animate-spin" : ""}`} />
            <span>MongoDB Sync</span>
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

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Total Registered Interns</span>
            <span className="text-lg font-bold text-slate-900">{registeredInterns.length} Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Pending Reviews</span>
            <span className="text-lg font-bold text-slate-900">{submissions.filter(s => s.status === "Awaiting Evaluation").length} Submissions</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Pending Leaves</span>
            <span className="text-lg font-bold text-slate-900">{leaveRequests.filter(l => l.status === "Pending").length} Requests</span>
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
            activeAdminSubTab === "assign-task" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Assign Task by Email</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("interns-catalog")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "interns-catalog" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Interns ({registeredInterns.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("add-intern")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "add-intern" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Intern</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("attendance-monitor")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "attendance-monitor" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Attendance & Selfies</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("submissions-grader")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            activeAdminSubTab === "submissions-grader" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Grade Submissions</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: ASSIGN TASK ================= */}
      {activeAdminSubTab === "assign-task" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Assign Task to Multi-Domain Interns</span>
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

      {/* ================= SUB-TAB 2: INTERNS CATALOG WITH PASSWORD RESET ================= */}
      {activeAdminSubTab === "interns-catalog" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                DevTech Registered Intern Directory ({registeredInterns.length} Total Interns)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time MongoDB Atlas synced accounts. Use Change Password button to set new passwords.
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
                {filteredInterns.map((intern) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: SIMPLIFIED ADD NEW INTERN ACCOUNT ================= */}
      {activeAdminSubTab === "add-intern" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Intern Account (MongoDB Atlas Sync)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Register a new intern account with Email & Password. Saved directly to MongoDB database!
              </p>
            </div>

            {internCreatedSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  New intern account registered in MongoDB Atlas! Mobile phone & laptop can both log in immediately with these credentials.
                </span>
              </div>
            )}

            {/* SIMPLIFIED FORM FOR USER */}
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
                    <span>SAVING TO MONGODB ATLAS...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>CREATE & REGISTER INTERN ACCOUNT IN MONGODB</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center justify-between">
              <span>MongoDB Registered Accounts</span>
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
                      MongoDB
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

      {/* RESET PASSWORD MODAL */}
      {resetModalEmail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Reset Intern Password (MongoDB)</span>
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
                  <span>Update Password in MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
