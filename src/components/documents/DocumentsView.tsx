"use client";

import React from "react";
import { FolderCheck, FileText, Download, ShieldCheck, ExternalLink } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function DocumentsView() {
  const { documents } = useWorkspaceStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0">
          <FolderCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Company Documents & Offer Letters</h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Official DevTech IT Solution documentation, offer letters, NDA agreements, and policy guidelines.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white pb-2 border-b">Official Documents List</h3>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs border border-gray-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{doc.title}</h4>
                  <p className="text-gray-400 text-[11px]">Category: {doc.category} • Uploaded {doc.uploadedAt}</p>
                </div>
              </div>

              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center space-x-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
