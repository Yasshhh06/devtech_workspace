"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle, Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon, XCircle } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";

export default function AttendanceView() {
  const { isCheckedIn, checkinTime, markAttendance } = useWorkspaceStore();
  
  // WebRTC Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [digitalTime, setDigitalTime] = useState<string>("");
  const [dateFormatted, setDateFormatted] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update live digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateFormatted(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "2-digit", year: "numeric" }).toUpperCase());
      setDigitalTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebRTC Start Camera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setIsCameraActive(true);
    }
  };

  // Capture Photo Selfie
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedSelfie(dataUrl);
        markAttendance(dataUrl);

        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
        setIsCameraActive(false);
      }
    } else {
      const demoSelfie = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
      setCapturedSelfie(demoSelfie);
      markAttendance(demoSelfie);
      setIsCameraActive(false);
    }
  };

  const daysInOctober = 31;
  const days = Array.from({ length: daysInOctober }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Title */}
      <h1 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        <span>Attendance</span>
      </h1>

      {/* Top Royal Blue Gradient Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-widest opacity-90 uppercase">
            {dateFormatted || "TUESDAY, OCTOBER 06, 2026"}
          </p>
          <div className="text-3xl font-black tracking-tight mt-1">
            {digitalTime || "11:40:47 AM"}
          </div>
        </div>

        <div>
          {isCheckedIn ? (
            <div className="bg-white/20 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <div>
                <p className="font-extrabold leading-none">Checked In</p>
                <p className="text-[10px] opacity-80 mt-0.5">{checkinTime || "09:15 AM"}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm">
              <XCircle className="w-4 h-4 text-pink-200" />
              <div>
                <p className="font-extrabold leading-none">Not Checked In</p>
                <p className="text-[10px] opacity-80 mt-0.5">Pending</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Mark Attendance Camera Box */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Mark Attendance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Capture your photo to check in</p>
          </div>

          {/* Camera Viewport Box */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl h-64 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden my-2">
            {capturedSelfie ? (
              <div className="w-full h-full relative">
                <img src={capturedSelfie} alt="Selfie preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 shadow">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Attendance Verified & Recorded</span>
                </div>
              </div>
            ) : isCameraActive ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo & Confirm</span>
                </button>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">
                  Enable your camera to take a selfie for attendance verification
                </p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          {/* Enable Camera Button */}
          {!capturedSelfie && (
            <button
              onClick={isCameraActive ? capturePhoto : startCamera}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>{isCameraActive ? "Take Selfie Now" : "Enable Camera"}</span>
            </button>
          )}
        </div>

        {/* Right Column: Attendance History Heatmap Calendar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-base flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span>Attendance History</span>
            </h3>

            <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
              <ChevronLeft className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-700" />
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold">
                <option value="Oct">Oct</option>
                <option value="Nov">Nov</option>
                <option value="Dec">Dec</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold">
                <option value="2026">2026</option>
              </select>
              <ChevronRight className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-700" />
            </div>
          </div>

          {/* Calendar Day Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
              <span key={d} className="font-bold text-gray-400 text-[11px]">
                {d}
              </span>
            ))}

            {/* Empty slots before Thursday Oct 1, 2026 */}
            <div className="h-9"></div>
            <div className="h-9"></div>
            <div className="h-9"></div>
            <div className="h-9"></div>

            {days.map((day) => {
              const isToday = day === 6;
              const isPresent = [1, 2, 5].includes(day) || (isToday && isCheckedIn);
              const isAbsent = isToday && !isCheckedIn;
              const isWeekend = [3, 4, 10, 11, 17, 18, 24, 25, 31].includes(day);

              return (
                <div
                  key={day}
                  className={`h-9 flex items-center justify-center rounded-xl font-bold text-xs transition ${
                    isAbsent
                      ? "bg-red-500 text-white shadow-md ring-2 ring-red-200"
                      : isPresent
                      ? "bg-emerald-500 text-white shadow-md"
                      : isWeekend
                      ? "text-gray-300"
                      : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-5 pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>Present</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span>Absent</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-gray-200 inline-block"></span>
              <span>Upcoming</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
