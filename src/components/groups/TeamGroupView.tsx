"use client";

import React, { useState } from "react";
import { Users, Search, MessageSquare, Send } from "lucide-react";

export default function TeamGroupView() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "Vikram Lead Mentor", time: "10:15 AM", text: "Welcome team to Batch 73FMBF! Please check your assigned tasks on the dashboard." },
    { sender: "Neha Kulkarni", time: "10:20 AM", text: "Thanks Vikram! Working on the Fund Analytics module." },
    { sender: "Mohite Yash", time: "10:30 AM", text: "Hello everyone! Ready for today's standup." },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages([...messages, { sender: "Mohite Yash", time: "Just now", text: chatMessage }]);
    setChatMessage("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
        <Users className="w-5 h-5 text-blue-600" />
        <span>Team Group</span>
      </h1>

      {/* Filter and Search Bar (Exact match to Screenshot 4) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="text-gray-400">Sort by:</span>
          <button className="bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-full">
            Latest Created
          </button>
          <button className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50">
            Conversations
          </button>
        </div>
      </div>

      {/* Team Group Card (Exact match to Screenshot 4) */}
      <div className="space-y-4">
        <div
          onClick={() => setSelectedGroup("73FMBF")}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm hover:border-blue-500 transition cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
            7
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">73FMBF</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">5 members</p>
          </div>
        </div>
      </div>

      {/* Interactive Chat Modal / Drawer when group selected */}
      {selectedGroup && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                7
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Batch 73FMBF Workspace Chat</h4>
                <p className="text-[11px] text-gray-400">5 active members</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {messages.map((m, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-800 dark:text-gray-200">
                  <span>{m.sender}</span>
                  <span className="text-[10px] text-gray-400 font-normal">{m.time}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message to team 73FMBF..."
              className="flex-1 px-4 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
