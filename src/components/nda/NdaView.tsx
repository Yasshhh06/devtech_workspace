"use client";

import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function NdaView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <span>Non-Disclosure Agreement (NDA)</span>
      </h1>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <span className="font-bold text-gray-900 dark:text-white">Devtech IT Solution Confidentiality Terms</span>
          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-[10px] flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Digitally Signed</span>
          </span>
        </div>

        <p>
          This Non-Disclosure Agreement ("Agreement") is entered into by and between <strong>Devtech IT Solution</strong> and the undersigned Intern <strong>Mohite Yash</strong>.
        </p>

        <p>
          1. <strong>Confidential Information:</strong> Includes all proprietary source code, algorithms, database schemas, customer data, and internal documentation shared during the workspace tenure.
        </p>
        <p>
          2. <strong>Non-Disclosure Obligations:</strong> The Intern agrees not to publish, reproduce, or share internal repository contents publicly without written authorization.
        </p>
      </div>
    </div>
  );
}
