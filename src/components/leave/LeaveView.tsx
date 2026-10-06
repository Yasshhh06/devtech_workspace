"use client";

import React, { useState } from "react";
import { UserX, Clock, CheckCircle, Plus } from "lucide-react";

export default function LeaveView() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <UserX className="w-5 h-5 text-blue-600" />
          <span>Leave / Work From Home (WFH)</span>
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply Leave / WFH</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Leave Application History</h3>

        <div className="space-y-3">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-800">Work From Home (WFH) Request</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Oct 14, 2026 – Oct 15, 2026 • Reason: Exam Prep</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full text-[10px]">
              Approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
