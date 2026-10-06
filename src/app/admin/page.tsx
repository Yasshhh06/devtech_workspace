"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useWorkspaceStore, InternUser } from "@/lib/store";
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

  // Sub Tab Navigation State
  const [adminSubTab, setAdminSubTab] = useState<
    "assign-task" | "add-intern" | "interns-list" | "attendance-monitor" | "leave-approvals" | "submissions-grader" | "calendar-manager" | "audit-logs"
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
    if (isAdminLoggedIn) {
      fetchInternsFromMongo();
    }
  }, [isAdminLoggedIn]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(adminUser, adminPass);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

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

  // --- 2. Add New Intern Form State (SIMPLIFIED: Full Name, Email, Password, Domain Track) ---
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
      // 1. Save to MongoDB Atlas DB
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
        // 2. Add to client store
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
      // Fallback local save
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

  // --- Submission Evaluation State ---
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

  // Selfie Modal Preview State
  const [previewSelfieUrl, setPreviewSelfieUrl] = useState<string | null>(null);

  // --- EXPORT HANDLERS ---
  const exportTasksExcel = () => {
    const data = tasks.map((t) => ({
      Task_ID: t.id,
      Task_Title: t.title,
      Assigned_Intern_Name: t.assignedToName,
      Assigned_Intern_Email: t.assignedToEmail,
      Domain_Track: t.domain || "N/A",
      Priority: t.priority,
      Status: t.status,
      Due_Date: t.dueDate || "N/A",
    }));
    exportToCSV("DevTech_Assigned_Tasks", data);
  };

  const exportTasksPDF = () => {
    const headers = ["Task Title", "Assigned To Email", "Domain", "Priority", "Status", "Due Date"];
    const rows = tasks.map((t) => [t.title, t.assignedToEmail, t.domain || "FSD", t.priority, t.status, t.dueDate || "N/A"]);
    exportToPDF("Assigned Project Tasks Report", headers, rows);
  };

  const exportInternsExcel = () => {
    const data = registeredInterns.map((i) => ({
      Intern_ID: i.id,
      Full_Name: i.name,
      Email_Address: i.email,
      Login_Password: i.password || "devtech123",
      Domain_Track: i.domain,
    }));
    exportToCSV("DevTech_Interns_Directory", data);
  };

  const exportInternsPDF = () => {
    const headers = ["ID", "Full Name", "Email Address", "Domain Track", "Password"];
    const rows = registeredInterns.map((i) => [i.id, i.name, i.email, i.domain, i.password || "devtech123"]);
    exportToPDF("Registered Interns Directory", headers, rows);
  };

  const exportAttendanceExcel = () => {
    const data = attendanceHistory.map((a) => ({
      Intern_Name: a.internName,
      Intern_Email: a.internEmail,
      Date: a.date,
      Time: a.time || "09:15 AM",
      Status: a.status,
    }));
    exportToCSV("DevTech_Attendance_Logs", data);
  };

  const exportAttendancePDF = () => {
    const headers = ["Intern Name", "Email", "Date", "Check-in Time", "Status"];
    const rows = attendanceHistory.map((a) => [a.internName, a.internEmail, a.date, a.time || "N/A", a.status]);
    exportToPDF("Attendance Logs Report", headers, rows);
  };

  const exportSubmissionsExcel = () => {
    const data = submissions.map((s) => ({
      Submission_ID: s.id,
      Intern_Name: s.internName,
      Intern_Email: s.internEmail,
      Project_Title: s.projectTitle,
      Google_Drive_Folder_Link: s.driveLink,
      Submitted_At: s.submittedAt,
      Evaluation_Status: s.status,
      Score: s.score !== null ? `${s.score}/100` : "Unrated",
    }));
    exportToCSV("DevTech_Project_Submissions_Grades", data);
  };

  const exportSubmissionsPDF = () => {
    const headers = ["Intern Name", "Email", "Project Title", "Submitted At", "Status", "Score"];
    const rows = submissions.map((s) => [s.internName, s.internEmail, s.projectTitle, s.submittedAt, s.status, `${s.score || "Unrated"}/100`]);
    exportToPDF("Project Submissions & Admin Grades Report", headers, rows);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="bg-white border border-blue-100 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">DevTech Admin Portal</h2>
            <p className="text-xs text-gray-500 font-medium">
              Enter Administrator credentials to access workspace controls
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold text-center border border-red-200">
              Invalid Username or Password! (Default: admin / devtechadmin123)
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Admin Username</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Admin Password</label>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setAdminUser("admin");
                setAdminPass("devtechadmin123");
              }}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              Auto-fill Credentials (admin / devtechadmin123)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-16">
      {/* Top Admin Header */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-4">
          <img
            src="/devtech-logo.png"
            alt="DevTech IT Solution Pvt Ltd"
            className="h-11 w-auto object-contain"
          />
          <div className="border-l border-gray-200 pl-4">
            <h1 className="font-black text-gray-900 text-base leading-none">DevTech Admin Command Center</h1>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              Super Admin Mode • MongoDB Persistent DB
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {dbStatusMsg && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {dbStatusMsg}
            </span>
          )}

          <button
            onClick={fetchInternsFromMongo}
            disabled={isLoadingInterns}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            title="Sync latest intern accounts from MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInterns ? "animate-spin" : ""}`} />
            <span>MongoDB Sync</span>
          </button>

          <a
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center space-x-1.5"
          >
            <span>View Intern Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs text-xs font-semibold">
          <button
            onClick={() => setAdminSubTab("assign-task")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "assign-task"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Assign Task (Email Chips & Domains)</span>
          </button>

          <button
            onClick={() => setAdminSubTab("interns-list")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "interns-list"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Interns ({registeredInterns.length})</span>
          </button>

          <button
            onClick={() => setAdminSubTab("add-intern")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "add-intern"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Intern</span>
          </button>

          <button
            onClick={() => setAdminSubTab("attendance-monitor")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "attendance-monitor"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Attendance & Selfies</span>
          </button>

          <button
            onClick={() => setAdminSubTab("submissions-grader")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "submissions-grader"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Grade Submissions</span>
          </button>

          <button
            onClick={() => setAdminSubTab("leave-approvals")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "leave-approvals"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Leave Approvals</span>
          </button>

          <button
            onClick={() => setAdminSubTab("calendar-manager")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "calendar-manager"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setAdminSubTab("audit-logs")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
              adminSubTab === "audit-logs"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* SUB-TAB 1: ASSIGN TASK */}
        {adminSubTab === "assign-task" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span>Assign Task to Multi-Domain Interns</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Filter by domain, type or paste email addresses, tag multiple interns as chips, and attach specification documents!
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={exportTasksExcel}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Excel Export</span>
                  </button>
                  <button
                    onClick={exportTasksPDF}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF Export</span>
                  </button>
                </div>
              </div>

              {taskAssignSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Task assigned successfully to {selectedEmails.length} target intern email(s)!</span>
                </div>
              )}

              {/* Domain Filter Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
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
                            : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                        }`}
                      >
                        <span>{dom}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isActive ? "bg-white text-blue-700 font-bold" : "bg-gray-200 text-gray-700"
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
                  <label className="text-xs font-bold text-gray-700">
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

                <div className="p-3 bg-gray-50 border border-gray-300 rounded-2xl space-y-2 focus-within:ring-2 focus-within:ring-blue-600 transition">
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
                      className="flex-1 min-w-[200px] bg-transparent text-xs text-gray-900 focus:outline-none py-1 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Pick Catalog */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Quick Pick Interns ({filteredInterns.length} available)
                  </span>
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
                    <input
                      type="text"
                      value={emailSearchQuery}
                      onChange={(e) => setEmailSearchQuery(e.target.value)}
                      placeholder="Search intern..."
                      className="w-full pl-8 pr-3 py-1 bg-gray-50 border rounded-lg text-[11px] font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border rounded-xl bg-gray-50">
                  {filteredInterns.slice(0, 24).map((intern) => {
                    const isSelected = selectedEmails.includes(intern.email.toLowerCase());
                    return (
                      <div
                        key={intern.email}
                        onClick={() => toggleInternSelection(intern.email)}
                        className={`p-2 rounded-xl cursor-pointer border transition flex items-center justify-between text-xs ${
                          isSelected
                            ? "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-bold truncate text-gray-900">{intern.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{intern.email}</p>
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

              {/* Task Form */}
              <form onSubmit={handleAssignTaskMulti} className="space-y-4 text-xs pt-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Task Title *</label>
                  <input
                    required
                    type="text"
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    placeholder="e.g. Build Payment Gateway Webhook Integration & Unit Tests"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Task Instructions</label>
                  <textarea
                    rows={3}
                    value={assignDescription}
                    onChange={(e) => setAssignDescription(e.target.value)}
                    placeholder="Detailed steps..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>

                {/* PRD Document Attachment */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-blue-700 font-bold">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span>Attach Task PRD / Specification Document</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">Document Title</label>
                      <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="e.g. PRD_Spec.pdf"
                        className="w-full p-2 bg-white border rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">Document URL</label>
                      <input
                        type="url"
                        value={documentUrl}
                        onChange={(e) => setDocumentUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-2 bg-white border rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Priority</label>
                    <select
                      value={assignPriority}
                      onChange={(e) => setAssignPriority(e.target.value as any)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                    >
                      <option value="HIGH Priority">HIGH Priority</option>
                      <option value="MEDIUM Priority">MEDIUM Priority</option>
                      <option value="LOW Priority">LOW Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={assignDueDate}
                      onChange={(e) => setAssignDueDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedEmails.length === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Assign Task to {selectedEmails.length} Tagged Intern Email(s)</span>
                </button>
              </form>
            </div>

            {/* Assigned Tasks Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-gray-900 pb-2 border-b flex items-center justify-between">
                <span>Assigned Tasks & Specs</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{tasks.length}</span>
              </h4>

              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 text-xs">
                {tasks.map((t) => (
                  <div key={t.id} className="p-3.5 bg-gray-50 rounded-xl space-y-1.5 border border-gray-100">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="truncate">{t.title}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                        {t.priority}
                      </span>
                    </div>

                    <p className="text-gray-500 text-[11px]">
                      Assigned to: <strong>{t.assignedToName}</strong> ({t.assignedToEmail})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: INTERNS DIRECTORY (WITH MONGODB PASSWORD RESET) */}
        {adminSubTab === "interns-list" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">
                  DevTech Registered Intern Directory ({registeredInterns.length} Total Interns)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time list synced with MongoDB Atlas database (`devtech_workspace`).
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

            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-700">Filter Domain:</span>
                <select
                  value={selectedDomainFilter}
                  onChange={(e) => setSelectedDomainFilter(e.target.value)}
                  className="p-1.5 bg-white border rounded-lg font-semibold text-xs text-gray-900"
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
                  placeholder="Search name, email..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border rounded-lg text-xs font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Intern Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Domain Track</th>
                    <th className="py-3 px-4">Login Password</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredInterns.map((intern) => (
                    <tr key={intern.email} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{intern.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600">{intern.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
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

        {/* SUB-TAB 3: SIMPLIFIED ADD NEW INTERN ACCOUNT FORM */}
        {adminSubTab === "add-intern" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Add New Intern Account (MongoDB Atlas Sync)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Create a new intern account with Email & Password. Saved directly to MongoDB database!
                  </p>
                </div>
              </div>

              {internCreatedSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    New intern account registered in MongoDB Atlas! Mobile phone & laptop can both log in immediately with these credentials.
                  </span>
                </div>
              )}

              {/* SIMPLIFIED FORM AS REQUESTED BY USER */}
              <form onSubmit={handleCreateIntern} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Intern Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={newInternName}
                      onChange={(e) => setNewInternName(e.target.value)}
                      placeholder="e.g. Rahul Patil"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Intern Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={newInternEmail}
                      onChange={(e) => setNewInternEmail(e.target.value)}
                      placeholder="rahul.patil@devtechitsolution.com"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Login Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={newInternPassword}
                      onChange={(e) => setNewInternPassword(e.target.value)}
                      placeholder="e.g. devtech123"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Domain Track</label>
                    <select
                      value={newInternDomain}
                      onChange={(e) => setNewInternDomain(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Python & AI/ML">Python & AI/ML</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
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

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-gray-900 border-b pb-2 flex items-center justify-between">
                <span>MongoDB Registered Accounts</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {registeredInterns.length}
                </span>
              </h4>
              <div className="space-y-3 max-h-[380px] overflow-y-auto text-xs">
                {registeredInterns.map((intern) => (
                  <div key={intern.email} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-0.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-gray-900">{intern.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        MongoDB
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] truncate">{intern.email}</p>
                    <p className="text-[10px] font-mono text-slate-700">Password: {intern.password || "devtech123"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: ATTENDANCE */}
        {adminSubTab === "attendance-monitor" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Attendance & Selfie Photo Monitor</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review check-in timestamps, status, and WebRTC photo selfies captured by interns.
                </p>
              </div>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {attendanceHistory.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{att.internName}</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 5: SUBMISSIONS GRADER */}
        {adminSubTab === "submissions-grader" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Project Submissions Grader</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review Google Drive folder submissions, assign score (0-100), and write code review remarks.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                  <div className="flex justify-between gap-2 border-b border-gray-200 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{sub.projectTitle}</h4>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 6: LEAVE APPROVALS */}
        {adminSubTab === "leave-approvals" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Leave & WFH Applications</h3>
              <p className="text-xs text-gray-500 mt-0.5">Approve or reject intern leave requests.</p>
            </div>

            <div className="space-y-4">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center gap-4 text-xs">
                  <div>
                    <span className="font-bold text-sm text-gray-900">{req.internName}</span> ({req.internEmail})
                    <p className="text-gray-600 mt-1">Dates: <strong>{req.startDate}</strong> to <strong>{req.endDate}</strong></p>
                    <p className="text-gray-500 italic">"Reason: {req.reason}"</p>
                  </div>
                  <div className="flex space-x-2">
                    {req.status === "Pending" ? (
                      <>
                        <button onClick={() => updateLeaveStatus(req.id, "Approved", "Approved by Admin.")} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">Approve</button>
                        <button onClick={() => updateLeaveStatus(req.id, "Rejected", "Rejected.")} className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs">Reject</button>
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
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-gray-900">Add Calendar Event</h3>
              <form onSubmit={handleAddHoliday} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-gray-700">Date</label>
                  <input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-gray-700">Title</label>
                  <input required type="text" value={holidayTitle} onChange={(e) => setHolidayTitle(e.target.value)} placeholder="Event title..." className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium text-gray-900" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center space-x-1 shadow-xs">
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-gray-900 border-b pb-3">Active Calendar Events</h3>
              <div className="space-y-3">
                {holidays.map((h) => (
                  <div key={h.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-gray-900">{h.title}</h4>
                      <p className="text-gray-400">Date: {h.date}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full text-[10px]">{h.type}</span>
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
      </main>
    </div>
  );
}
