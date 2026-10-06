"use client";

import React, { useState } from "react";
import { UserX, Clock, CheckCircle, Plus, X, Calendar, AlertCircle } from "lucide-react";
import { useWorkspaceStore, LeaveRequest } from "@/lib/store";

export default function LeaveView() {
  const { currentIntern, currentUser, leaveRequests, addLeaveRequest } = useWorkspaceStore();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<"Work From Home (WFH)" | "Casual Leave" | "Sick Leave">("Work From Home (WFH)");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setErrorMsg("Please fill in all required fields (Start Date, End Date, Reason).");
      return;
    }

    addLeaveRequest({
      internName: currentIntern?.name || currentUser.name || "Intern",
      internEmail: currentIntern?.email || currentUser.email || "",
      type,
      startDate,
      endDate,
      reason: reason.trim(),
    });

    setSuccessMsg("Your Leave / WFH application has been submitted successfully for admin review!");
    setShowModal(false);
    setStartDate("");
    setEndDate("");
    setReason("");
    setErrorMsg("");

    setTimeout(() => {
      setSuccessMsg("");
    }, 5000);
  };

  // State leave requests fetched from Firestore
  const displayRequests: LeaveRequest[] = leaveRequests;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <UserX className="w-5 h-5 text-blue-600" />
            <span>Leave / Work From Home (WFH)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit leave requests or WFH applications to workspace administration for approval.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply Leave / WFH</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Leave Application History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Leave Application History</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Total Applications: {displayRequests.length}
          </span>
        </div>

        <div className="space-y-3">
          {displayRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{req.type}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded font-mono">
                    {req.startDate} to {req.endDate}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  <strong>Reason:</strong> {req.reason}
                </p>
                {req.adminRemark && (
                  <p className="text-blue-600 text-[11px]">
                    <strong>Admin Remark:</strong> {req.adminRemark}
                  </p>
                )}
              </div>

              <div>
                {req.status === "Approved" ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1.5 rounded-full text-[10px] flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Approved</span>
                  </span>
                ) : req.status === "Rejected" ? (
                  <span className="bg-red-50 text-red-700 border border-red-200 font-bold px-3 py-1.5 rounded-full text-[10px]">
                    Rejected
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-3 py-1.5 rounded-full text-[10px]">
                    Pending Approval
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Leave / WFH Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <UserX className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Apply for Leave / WFH</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Request Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">Application Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Work From Home (WFH)">Work From Home (WFH)</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                </select>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">Reason for Request *</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason clearly (e.g., College Exam, Medical Emergency, Personal Work)..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
