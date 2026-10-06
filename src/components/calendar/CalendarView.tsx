"use client";

import React from "react";
import { Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarView() {
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        <span>Calendar</span>
      </h1>

      {/* Information Blue Notice Banner (Exact match to Screenshot 2) */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-800 dark:text-blue-300 leading-relaxed shadow-sm">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">You've been allocated 3 flexible work days.</p>
          <p>
            On these days you can work on your assigned project on a working-day basis — around 3 hours per day, within your own flexible free time. No daily code submission is required on flexible days, but you must still complete your standup every day. Project submission is only needed once the project is fully completed.
          </p>
        </div>
      </div>

      {/* Holiday Calendar Card (Exact match to Screenshot 2) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Holiday Calendar</h3>
          <div className="flex items-center space-x-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <ChevronLeft className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600" />
            <span>October 2026</span>
            <ChevronRight className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600" />
          </div>
        </div>

        {/* Calendar Monthly Grid */}
        <div className="grid grid-cols-7 gap-3 text-center text-xs">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d} className="font-semibold text-gray-400 text-xs py-1">
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
                className={`h-10 flex flex-col items-center justify-center rounded-xl text-xs font-medium relative transition ${
                  isToday
                    ? "border-2 border-blue-500 font-bold text-blue-600 bg-blue-50/30 dark:bg-blue-950/20"
                    : isWeekend
                    ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <span>{day}</span>
                {isWeekend && <span className="w-1 h-1 rounded-full bg-red-500 absolute bottom-1"></span>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-200 border border-red-500"></span>
            <span>Weekend (Sat / Sun) — holiday</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-md border-2 border-blue-500 bg-blue-50"></span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
