"use client";

import React from "react";
import { Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from "lucide-react";

import { useWorkspaceStore } from "@/lib/store";

export default function CalendarView() {
  const { holidays } = useWorkspaceStore();
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Title */}
      <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        <span>Calendar</span>
      </h1>

      {/* Information Blue Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-900 leading-relaxed shadow-sm">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900 mb-1">You've been allocated 3 flexible work days.</p>
          <p className="text-blue-800">
            On these days you can work on your assigned project on a working-day basis — around 3 hours per day, within your own flexible free time. No daily code submission is required on flexible days, but you must still complete your standup every day. Project submission is only needed once the project is fully completed.
          </p>
        </div>
      </div>

      {/* Holiday Calendar Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-sm">Holiday Calendar</h3>
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
            <ChevronLeft className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-600" />
            <span className="text-slate-800 font-bold">October 2026</span>
            <ChevronRight className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-600" />
          </div>
        </div>

        {/* Calendar Monthly Grid */}
        <div className="grid grid-cols-7 gap-3 text-center text-xs">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d} className="font-bold text-slate-500 text-xs py-1">
              {d}
            </span>
          ))}

          {/* Empty padding before Thursday Oct 1 */}
          <div className="h-10"></div>
          <div className="h-10"></div>
          <div className="h-10"></div>
          <div className="h-10"></div>

          {days.map((day) => {
            const isToday = day === 6;
            const isWeekend = [3, 4, 10, 11, 17, 18, 24, 25, 31].includes(day);

            return (
              <div
                key={day}
                className={`h-10 flex flex-col items-center justify-center rounded-xl text-xs font-semibold relative transition ${
                  isToday
                    ? "border-2 border-blue-600 font-extrabold text-blue-700 bg-blue-50/80 shadow-xs"
                    : isWeekend
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "text-slate-700 bg-slate-50/60 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                <span>{day}</span>
                {isWeekend && <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute bottom-1"></span>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-400"></span>
            <span className="font-medium">Weekend (Sat / Sun) — holiday</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-md border-2 border-blue-600 bg-blue-50"></span>
            <span className="font-medium">Today</span>
          </div>
        </div>
      </div>

      {/* Admin Published Events & Holidays List */}
      {holidays.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 text-xs">
          <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Upcoming Holidays & Workspace Events ({holidays.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {holidays.map((h) => (
              <div key={h.id} className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <span>{h.title}</span>
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-mono">
                    {h.type}
                  </span>
                </div>
                <p className="text-slate-600 font-mono text-[11px]">Date: {h.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
