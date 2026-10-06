"use client";

import React, { useState } from "react";
import { UserX, Clock, CheckCircle, Plus } from "lucide-react";

export default function LeaveView() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <UserX className="w-5 h-5 text-blue-600" />
          <span>Leave / Work From Home (WFH)</span>
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Apply Leave / WFH</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Leave Application History</h3>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Work From Home (WFH) Request</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Oct 14, 2026 – Oct 15, 2026 • Reason: Exam Prep</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full text-[10px]">
              Approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
