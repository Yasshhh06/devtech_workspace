"use client";

import React from "react";
import { BookOpen, Video, ExternalLink, FileText, Download, Code2, Shield, Layers } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function ResourcesView() {
  const { resources } = useWorkspaceStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Learning Resources & Tutorials</h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Curated technical documentations, video guides, and project reference repositories for DevTech Interns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div key={res.id} className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {res.category}
                </span>
                <span className="text-[10px] font-bold text-gray-400">{res.type}</span>
              </div>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug">{res.title}</h3>
            </div>

            <a
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-blue-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-600 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Access Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
