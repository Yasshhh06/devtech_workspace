"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  PlusCircle,
  Camera,
  CalendarCheck,
  Send,
  UserCheck,
  User,
  Key,
  CheckCircle,
  XCircle,
  ExternalLink,
  Award,
  Users,
  LogOut,
  Plus,
  ArrowRight,
  Layers,
  FileText,
  Paperclip,
  Check,
  Search,
  Filter,
  X,
  Mail,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Printer,
  Download,
} from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";

export default function AdminPage() {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
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

  // Admin Auth State
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("devtechadmin123");
  const [loginError, setLoginError] = useState(false);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(adminUser, adminPass);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  // Sub Tab Navigation State
  const [adminSubTab, setAdminSubTab] = useState<
    "assign-task" | "add-intern" | "interns-list" | "attendance-monitor" | "leave-approvals" | "submissions-grader" | "calendar-manager" | "audit-logs"
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
      intern.email.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
      intern.batch.toLowerCase().includes(emailSearchQuery.toLowerCase());
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

  // --- 2. Add New Intern Form State ---
  const [newInternName, setNewInternName] = useState("");
  const [newInternEmail, setNewInternEmail] = useState("");
  const [newInternPassword, setNewInternPassword] = useState("devtech123");
  const [newInternBatch, setNewInternBatch] = useState("DEV-2026-FS04");
  const [newInternDomain, setNewInternDomain] = useState("Full Stack Web Development");
  const [newInternCollege, setNewInternCollege] = useState("COEP Pune");
  const [internCreatedSuccess, setInternCreatedSuccess] = useState(false);

  const handleCreateIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternName.trim() || !newInternEmail.trim()) return;

    addNewIntern({
      name: newInternName,
      email: newInternEmail,
      password: newInternPassword || "devtech123",
      batch: newInternBatch,
      domain: newInternDomain,
      college: newInternCollege,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    });

    setNewInternName("");
    setNewInternEmail("");
    setNewInternPassword("devtech123");
    setInternCreatedSuccess(true);
    setTimeout(() => setInternCreatedSuccess(false), 4000);
  };

  // --- 3. Submission Evaluation State ---
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState<number>(95);
  const [evalStatus, setEvalStatus] = useState<"Approved" | "Needs Revision">("Approved");
  const [evalRemarks, setEvalRemarks] = useState<string>("");

  const handleSaveEvaluation = (subId: string) => {
    evaluateSubmission(subId, evalScore, evalStatus, evalRemarks);
    setEvaluatingSubId(null);
    setEvalRemarks("");
  };

  // --- 4. Holiday Manager Form State ---
  const [holidayDate, setHolidayDate] = useState("2026-10-20");
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayType, setHolidayType] = useState<"Holiday" | "Flexible Workday" | "Announcement">("Holiday");

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle.trim()) return;
    addHoliday({ date: holidayDate, title: holidayTitle, type: holidayType });
    setHolidayTitle("");
  };

  // Selfie Modal Preview State
  const [previewSelfieUrl, setPreviewSelfieUrl] = useState<string | null>(null);

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-gray-900 dark:text-white">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">DevTech Admin Portal</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter Administrator credentials to access workspace controls
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-xl text-xs font-semibold text-center border border-red-200">
              Invalid Username or Password! (Default: admin / devtechadmin123)
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Admin Username</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Admin Password</label>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
            >
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 dark:border-slate-800 text-center">
            <button
              onClick={() => {
                setAdminUser("admin");
                setAdminPass("devtechadmin123");
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Auto-fill Credentials (admin / devtechadmin123)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Export Handlers ---
  const exportSubmissionsExcel = () => {
    const data =
      submissions.length > 0
        ? submissions.map((s) => ({
            ID: s.id,
            Intern_Name: s.internName,
            Intern_Email: s.internEmail,
            Project_Title: s.projectTitle,
            Google_Drive_Link: s.driveLink,
            Submitted_At: s.submittedAt,
            Status: s.status,
            Score: s.score !== null && s.score !== undefined ? `${s.score}/100` : "Unrated",
            Mentor_Remarks: s.mentorRemarks || "",
          }))
        : registeredInterns.map((i) => ({
            ID: i.id,
            Intern_Name: i.name,
            Intern_Email: i.email,
            Batch: i.batch,
            Domain: i.domain,
            College: i.college || "DevTech Academy",
            Mentor: i.mentor || "DevTech Mentor",
            Tasks_Assigned: tasks.filter((t) => t.assignedToEmail.toLowerCase() === i.email.toLowerCase()).length,
          }));

    exportToCSV("DevTech_Workspace_Report", data, ["ID", "Intern_Name", "Intern_Email", "Status"]);
  };

  const exportSubmissionsPDF = () => {
    const headers = ["Intern Name", "Email", "Domain Track", "Batch / Status", "Assigned Tasks"];
    const rows =
      submissions.length > 0
        ? submissions.map((s) => [s.internName, s.internEmail, s.projectTitle, s.status, `${s.score || "Pending"}/100`])
        : registeredInterns.map((i) => [
            i.name,
            i.email,
            i.domain,
            i.batch,
            `${tasks.filter((t) => t.assignedToEmail.toLowerCase() === i.email.toLowerCase()).length} Task(s)`,
          ]);
    exportToPDF("DevTech Workspace Admin Report", headers, rows);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 pb-16">
      {/* Top Admin Header */}
      <header className="h-20 bg-white dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src="/devtech-logo.png"
            alt="DevTech IT Solution Pvt Ltd"
            className="h-11 w-auto object-contain"
          />
          <div className="border-l border-blue-200 dark:border-slate-800 pl-4">
            <h1 className="font-black text-gray-900 dark:text-white text-base leading-none">DevTech Admin Command Center</h1>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Super Admin Mode • workspace.devtechitsolution.com</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* EXPORT ACTION BUTTONS */}
          <button
            onClick={exportSubmissionsExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center space-x-1.5"
            title="Export All Submissions and Grades to Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>

          <button
            onClick={exportSubmissionsPDF}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center space-x-1.5"
            title="Export Printable PDF Report"
          >
            <Printer className="w-4 h-4" />
            <span>PDF Export</span>
          </button>

          <a
            href="/"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center space-x-1.5"
          >
            <span>View Intern Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-bold transition flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-sm text-xs font-semibold">
          <button
            onClick={() => setAdminSubTab("assign-task")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "assign-task"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <Mail className="w-4 h-4" />
            <span>Assign Task (Email Chips & Domains)</span>
          </button>

          <button
            onClick={() => setAdminSubTab("interns-list")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "interns-list"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Interns ({registeredInterns.length})</span>
          </button>

          <button
            onClick={() => setAdminSubTab("add-intern")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "add-intern"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Intern</span>
          </button>

          <button
            onClick={() => setAdminSubTab("attendance-monitor")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "attendance-monitor"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <Camera className="w-4 h-4" />
            <span>Attendance & Selfies</span>
          </button>

          <button
            onClick={() => setAdminSubTab("submissions-grader")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "submissions-grader"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <Send className="w-4 h-4" />
            <span>Grade Submissions</span>
          </button>

          <button
            onClick={() => setAdminSubTab("leave-approvals")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "leave-approvals"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Leave Approvals</span>
          </button>

          <button
            onClick={() => setAdminSubTab("calendar-manager")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "calendar-manager"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setAdminSubTab("audit-logs")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${adminSubTab === "audit-logs"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
          >
            <Clock className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* SUB-TAB 1: ASSIGN TASK */}
        {adminSubTab === "assign-task" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Assign Task to 50+ Multi-Domain Interns</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Filter by domain, type or paste email addresses, tag multiple interns as chips, and attach specification documents!
                </p>
              </div>

              {taskAssignSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Task assigned successfully to {selectedEmails.length} target intern email(s)!</span>
                </div>
              )}

              {/* Domain Filter Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${isActive
                            ? "bg-blue-600 text-white shadow"
                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700"
                          }`}
                      >
                        <span>{dom}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? "bg-white text-blue-700" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
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
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Step 2: Selected Intern Emails ({selectedEmails.length} Tagged) *
                  </label>
                  <button
                    type="button"
                    onClick={selectAllInDomain}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>
                      {filteredInterns.every((i) => selectedEmails.includes(i.email.toLowerCase()))
                        ? `Deselect All in ${selectedDomainFilter}`
                        : `Select All ${filteredInterns.length} in ${selectedDomainFilter}`}
                    </span>
                  </button>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-2xl space-y-2 focus-within:ring-2 focus-within:ring-blue-600 transition">
                  <div className="flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto">
                    {selectedEmails.map((email) => {
                      const internObj = registeredInterns.find((i) => i.email.toLowerCase() === email);
                      return (
                        <span
                          key={email}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
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
                          ? "Type intern email and press Enter, or pick below..."
                          : "Type more emails..."
                      }
                      className="flex-1 min-w-[200px] bg-transparent text-xs text-gray-900 dark:text-white focus:outline-none py-1"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Pick Catalog */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Quick Pick Interns ({filteredInterns.length} available)
                  </span>
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
                    <input
                      type="text"
                      value={emailSearchQuery}
                      onChange={(e) => setEmailSearchQuery(e.target.value)}
                      placeholder="Search intern..."
                      className="w-full pl-8 pr-3 py-1 bg-gray-50 dark:bg-slate-800 border rounded-lg text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border rounded-xl bg-gray-50/50 dark:bg-slate-800/40">
                  {filteredInterns.slice(0, 24).map((intern) => {
                    const isSelected = selectedEmails.includes(intern.email.toLowerCase());
                    return (
                      <div
                        key={intern.email}
                        onClick={() => toggleInternSelection(intern.email)}
                        className={`p-2 rounded-xl cursor-pointer border transition flex items-center justify-between text-xs ${isSelected
                            ? "bg-blue-100/80 dark:bg-blue-900/50 border-blue-400 text-blue-900 dark:text-blue-100 font-bold"
                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-blue-300"
                          }`}
                      >
                        <div className="truncate">
                          <p className="font-bold truncate">{intern.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{intern.email}</p>
                          <span className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold">{intern.domain}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => { }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Task Form */}
              <form onSubmit={handleAssignTaskMulti} className="space-y-4 text-xs pt-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Task Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    placeholder="e.g. Build Payment Gateway Webhook Integration & Unit Tests"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Task Description & Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={assignDescription}
                    onChange={(e) => setAssignDescription(e.target.value)}
                    placeholder="Detailed steps, API endpoint definitions, test coverage requirements..."
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* PRD Document Attachment */}
                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-bold">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span>Attach Task PRD / Specification Document</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1 text-[11px]">
                        Document Title
                      </label>
                      <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="e.g. Payment_Gateway_PRD_Spec.pdf"
                        className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1 text-[11px]">
                        Document URL / PDF Link
                      </label>
                      <input
                        type="url"
                        value={documentUrl}
                        onChange={(e) => setDocumentUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select
                      value={assignPriority}
                      onChange={(e) => setAssignPriority(e.target.value as any)}
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-medium"
                    >
                      <option value="HIGH Priority">HIGH Priority</option>
                      <option value="MEDIUM Priority">MEDIUM Priority</option>
                      <option value="LOW Priority">LOW Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={assignDueDate}
                      onChange={(e) => setAssignDueDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedEmails.length === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Assign Task to {selectedEmails.length} Tagged Intern Email(s)</span>
                </button>
              </form>
            </div>

            {/* Assigned Tasks Box */}
            <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white pb-2 border-b flex items-center justify-between">
                <span>Assigned Tasks & Specs</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{tasks.length}</span>
              </h4>

              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 text-xs">
                {tasks.map((t) => (
                  <div key={t.id} className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                      <span className="truncate">{t.title}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                        {t.priority}
                      </span>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                      Assigned to: <strong>{t.assignedToName}</strong> ({t.assignedToEmail})
                    </p>

                    {t.documentUrl && (
                      <div className="pt-1">
                        <a
                          href={t.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline text-[11px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>{t.documentName || "Task_Specification.pdf"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: INTERNS DIRECTORY */}
        {adminSubTab === "interns-list" && (
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                  DevTech Registered Intern Directory ({registeredInterns.length} Total Interns)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Complete directory across all 6 domains. Filter by domain or search by name/email.
                </p>
              </div>

              <button
                onClick={() => setAdminSubTab("add-intern")}
                className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New Intern</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-700 dark:text-gray-300">Filter Domain:</span>
                <select
                  value={selectedDomainFilter}
                  onChange={(e) => setSelectedDomainFilter(e.target.value)}
                  className="p-1.5 bg-white dark:bg-slate-900 border rounded-lg font-semibold text-xs"
                >
                  {domainsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  placeholder="Search name, email, batch..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Intern ID & Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Domain Track</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Mentor</th>
                    <th className="py-3 px-4">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-gray-300">
                  {filteredInterns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                        {intern.name}
                        <span className="block text-[10px] text-gray-400 font-normal">{intern.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600 dark:text-blue-400">{intern.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {intern.domain}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{intern.batch}</td>
                      <td className="py-3.5 px-4 text-gray-500">{intern.college || "Pune University"}</td>
                      <td className="py-3.5 px-4 font-medium">{intern.mentor || "Rahul Sharma"}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            setSelectedEmails([intern.email.toLowerCase()]);
                            setAdminSubTab("assign-task");
                          }}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded-lg font-bold text-[11px] hover:bg-blue-600 hover:text-white transition"
                        >
                          Assign Task
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: ADD NEW INTERN */}
        {adminSubTab === "add-intern" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Add New Intern Account</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Register a new intern into DevTech Workspace. Once added, they will immediately show up in task assignment tags!
                </p>
              </div>

              {internCreatedSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>New intern account registered successfully! They can now receive assigned tasks.</span>
                </div>
              )}

              <form onSubmit={handleCreateIntern} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Intern Full Name *</label>
                    <input
                      required
                      type="text"
                      value={newInternName}
                      onChange={(e) => setNewInternName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Intern Email Address *</label>
                    <input
                      required
                      type="email"
                      value={newInternEmail}
                      onChange={(e) => setNewInternEmail(e.target.value)}
                      placeholder="priya.sharma@college.edu"
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Login Password *</label>
                    <input
                      required
                      type="text"
                      value={newInternPassword}
                      onChange={(e) => setNewInternPassword(e.target.value)}
                      placeholder="e.g. devtech123"
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Domain Track</label>
                    <select
                      value={newInternDomain}
                      onChange={(e) => setNewInternDomain(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-medium"
                    >
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Python & AI/ML">Python & AI/ML</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Batch Identifier</label>
                    <input
                      type="text"
                      value={newInternBatch}
                      onChange={(e) => setNewInternBatch(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">College / University</label>
                  <input
                    type="text"
                    value={newInternCollege}
                    onChange={(e) => setNewInternCollege(e.target.value)}
                    placeholder="e.g. COEP Technological University"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Save Intern Account</span>
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white pb-2 border-b">
                Registered Interns ({registeredInterns.length})
              </h4>
              <div className="space-y-3 max-h-[380px] overflow-y-auto text-xs">
                {registeredInterns.slice(0, 10).map((intern) => (
                  <div key={intern.email} className="p-3 bg-blue-50/40 dark:bg-slate-800/60 rounded-xl space-y-1 border">
                    <div className="flex items-center justify-between font-bold">
                      <span>{intern.name}</span>
                      <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">{intern.batch}</span>
                    </div>
                    <p className="text-gray-500 text-[11px] truncate">{intern.email}</p>
                    <p className="text-[10px] font-semibold text-blue-600">{intern.domain}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: ATTENDANCE */}
        {adminSubTab === "attendance-monitor" && (
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Attendance & Selfie Photo Monitor</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Review check-in timestamps, status, and WebRTC photo selfies captured by interns.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border px-3 py-1 rounded-full">
                Date: Oct 06, 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Intern Name & Email</th>
                    <th className="py-3 px-4">Domain Track</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Captured Selfie</th>
                    <th className="py-3 px-4">IP Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {attendanceHistory.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold">{att.internName}</p>
                        <p className="text-[11px] text-gray-400">{att.internEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600">{att.domain || "Full Stack Web Development"}</td>
                      <td className="py-3.5 px-4 font-medium">{att.date} {att.time ? `• ${att.time}` : ""}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${att.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {att.selfieUrl ? (
                          <button onClick={() => setPreviewSelfieUrl(att.selfieUrl!)} className="flex items-center space-x-1.5 text-blue-600 hover:underline font-semibold">
                            <img src={att.selfieUrl} alt="Selfie" className="w-8 h-8 rounded-full object-cover border border-blue-400" />
                            <span>View Photo</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">No Selfie</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 text-[11px]">{att.ipAddress || "103.21.124.5"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 5: SUBMISSIONS GRADER */}
        {adminSubTab === "submissions-grader" && (
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Project Submissions Grader</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Review Google Drive folder submissions, assign score (0-100), and write code review remarks.
              </p>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-5 bg-blue-50/30 dark:bg-slate-800/50 rounded-2xl border space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row justify-between gap-2 border-b pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{sub.projectTitle}</h4>
                      <p className="text-gray-500 text-[11px]">Submitted by: <strong>{sub.internName}</strong> ({sub.internEmail}) • {sub.submittedAt}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 w-fit">
                      {sub.status} {sub.score !== null ? `(${sub.score}/100)` : ""}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-blue-600 font-bold">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <a href={sub.driveLink} target="_blank" rel="noreferrer" className="hover:underline truncate">{sub.driveLink}</a>
                  </div>

                  {evaluatingSubId === sub.id ? (
                    <div className="mt-3 p-4 bg-white dark:bg-slate-900 rounded-xl border space-y-3">
                      <h5 className="font-bold">Grade Submission</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold mb-1">Score (0-100)</label>
                          <input type="number" min={0} max={100} value={evalScore} onChange={(e) => setEvalScore(Number(e.target.value))} className="w-full p-2 bg-gray-50 border rounded-lg text-xs font-bold" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold mb-1">Decision</label>
                          <select value={evalStatus} onChange={(e) => setEvalStatus(e.target.value as any)} className="w-full p-2 bg-gray-50 border rounded-lg text-xs">
                            <option value="Approved">Approved - Pass</option>
                            <option value="Needs Revision">Needs Revision</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1">Mentor Remarks</label>
                        <textarea rows={2} value={evalRemarks} onChange={(e) => setEvalRemarks(e.target.value)} placeholder="Code review notes..." className="w-full p-2 bg-gray-50 border rounded-lg text-xs" />
                      </div>

                      <div className="flex space-x-2">
                        <button onClick={() => handleSaveEvaluation(sub.id)} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs">Save Grade</button>
                        <button onClick={() => setEvaluatingSubId(null)} className="px-4 py-2 text-gray-400 text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-gray-600 text-[11px]"><strong>Mentor Remarks:</strong> {sub.mentorRemarks || "Not evaluated yet."}</p>
                      <button onClick={() => { setEvaluatingSubId(sub.id); setEvalScore(sub.score || 95); setEvalRemarks(sub.mentorRemarks || ""); }} className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Evaluate & Score</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 6: LEAVE APPROVALS */}
        {adminSubTab === "leave-approvals" && (
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Leave & WFH Applications</h3>
              <p className="text-xs text-gray-500 mt-0.5">Approve or reject intern leave requests.</p>
            </div>

            <div className="space-y-4">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                  <div>
                    <span className="font-bold text-sm">{req.internName}</span> ({req.internEmail})
                    <p className="text-gray-600 mt-1">Dates: <strong>{req.startDate}</strong> to <strong>{req.endDate}</strong></p>
                    <p className="text-gray-500 italic">"Reason: {req.reason}"</p>
                  </div>
                  <div className="flex space-x-2">
                    {req.status === "Pending" ? (
                      <>
                        <button onClick={() => updateLeaveStatus(req.id, "Approved", "Approved by Admin.")} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">Approve</button>
                        <button onClick={() => updateLeaveStatus(req.id, "Rejected", "Rejected.")} className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl">Reject</button>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{req.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 7: CALENDAR */}
        {adminSubTab === "calendar-manager" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base">Add Calendar Event</h3>
              <form onSubmit={handleAddHoliday} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Date</label>
                  <input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Title</label>
                  <input required type="text" value={holidayTitle} onChange={(e) => setHolidayTitle(e.target.value)} placeholder="Event title..." className="w-full p-2.5 bg-gray-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Event Type</label>
                  <select value={holidayType} onChange={(e) => setHolidayType(e.target.value as any)} className="w-full p-2.5 bg-gray-50 border rounded-xl">
                    <option value="Holiday">Company Holiday</option>
                    <option value="Flexible Workday">Flexible Workday</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base">Active Workspace Calendar Events</h3>
              <div className="space-y-3">
                {holidays.map((h) => (
                  <div key={h.id} className="p-3.5 bg-gray-50 rounded-xl border flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold">{h.title}</h4>
                      <p className="text-gray-400">Date: {h.date}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full text-[10px]">{h.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 8: AUDIT LOGS */}
        {adminSubTab === "audit-logs" && (
          <div className="bg-white dark:bg-slate-900 border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base">System Audit Activity Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Action Description</th>
                    <th className="py-2.5 px-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700 dark:text-gray-300">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-400">{log.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold">{log.user}</td>
                      <td className="py-2.5 px-3 font-semibold text-blue-600">{log.module}</td>
                      <td className="py-2.5 px-3">{log.action}</td>
                      <td className="py-2.5 px-3 text-gray-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selfie Modal */}
        {previewSelfieUrl && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl max-w-md w-full space-y-3 text-center">
              <h4 className="font-bold">Captured Check-in Selfie</h4>
              <img src={previewSelfieUrl} alt="Selfie" className="w-full h-72 object-cover rounded-xl border" />
              <button onClick={() => setPreviewSelfieUrl(null)} className="px-4 py-2 bg-gray-200 font-bold text-xs rounded-xl">Close Preview</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
