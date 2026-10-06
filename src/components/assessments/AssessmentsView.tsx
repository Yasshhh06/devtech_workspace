"use client";

import React from "react";
import { Award, Clock, FileText, CheckCircle2, AlertCircle, ArrowRight, HelpCircle } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function AssessmentsView() {
  const { assessments, currentIntern } = useWorkspaceStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Assessments & Skill Tests</h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Complete your domain ability assessments to earn certification milestones for {currentIntern?.domain || "Full Stack Web Development"}.
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((ass) => (
          <div
            key={ass.id}
            className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                {ass.domain}
              </span>
              <span className="text-xs font-semibold text-amber-600 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {ass.deadline}</span>
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{ass.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ass.description}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-semibold">{ass.questionsCount} Questions / Deliverables</span>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5">
                <span>Start Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
