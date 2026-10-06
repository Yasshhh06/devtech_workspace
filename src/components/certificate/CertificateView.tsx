"use client";

import React from "react";
import { Award, CheckCircle2, Download, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function CertificateView() {
  const { currentIntern, certificates } = useWorkspaceStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold">DevTech Verified Internship Certificate</h1>
        <p className="text-xs text-blue-100 max-w-md mx-auto">
          Official completion certificate for {currentIntern?.name || "Mohite Yash"} ({currentIntern?.domain}).
        </p>
      </div>

      {/* Certificate Status Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-gray-900 dark:text-white pb-2 border-b">
          Internship Completion Requirements Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center space-x-2 font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Training Requirements Completed ✓</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center space-x-2 font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ability Assessments Passed ✓</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center space-x-2 font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Capstone Project Drive Link Approved ✓</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center space-x-2 font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Attendance Criteria Met (90%+) ✓</span>
          </div>
        </div>
      </div>

      {/* Certificate Box Mockup */}
      <div className="bg-white dark:bg-slate-900 border-4 border-amber-400 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">DevTech IT Solution</span>
          <h2 className="text-3xl font-serif font-extrabold text-gray-900 dark:text-white">CERTIFICATE OF INTERNSHIP</h2>
          <p className="text-xs text-gray-500 italic">This certificate is proudly presented to</p>
        </div>

        <div className="py-2">
          <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 underline decoration-amber-400 underline-offset-8">
            {currentIntern?.name || "Mohite Yash"}
          </h3>
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-2">
            for successfully completing the internship program in <strong>{currentIntern?.domain || "Full Stack Web Development"}</strong>.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs border-t pt-4 text-gray-500">
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">Certificate ID</p>
            <p className="font-mono text-[11px] text-blue-600">DTS-CERT-2026-00001</p>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">Issued On</p>
            <p className="font-medium text-[11px]">15 October 2026</p>
          </div>
        </div>

        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Verified PDF Certificate</span>
        </button>
      </div>
    </div>
  );
}
