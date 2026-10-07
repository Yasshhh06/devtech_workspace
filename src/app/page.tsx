"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DashboardView from "@/components/dashboard/DashboardView";
import ProjectsView from "@/components/projects/ProjectsView";
import AttendanceView from "@/components/attendance/AttendanceView";
import CalendarView from "@/components/calendar/CalendarView";
import LeaveView from "@/components/leave/LeaveView";
import SubmissionView from "@/components/submission/SubmissionView";
import TermsView from "@/components/terms/TermsView";
import SettingsView from "@/components/settings/SettingsView";
import AdminView from "@/components/admin/AdminView";
import NotificationsView from "@/components/notifications/NotificationsView";
import { useWorkspaceStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { activeTab, activeRole, isInternLoggedIn, isAdminLoggedIn } = useWorkspaceStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const cleanup = useWorkspaceStore.getState().initFirebaseRealtimeSync();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isMounted && !isInternLoggedIn && !isAdminLoggedIn) {
      router.push("/login");
    }
  }, [isMounted, isInternLoggedIn, isAdminLoggedIn, router]);

  if (!isMounted) {
    return null;
  }

  if (!isInternLoggedIn && !isAdminLoggedIn) {
    return null;
  }

  const renderActiveView = () => {
    // If in Admin Mode or active tab is admin
    if ((activeTab as string) === "admin" || (activeRole === "admin" && activeTab === "dashboard")) {
      return <AdminView />;
    }

    switch (activeTab as string) {
      case "dashboard":
        return <DashboardView />;
      case "projects":
        return <ProjectsView />;
      case "attendance":
        return <AttendanceView />;
      case "calendar":
        return <CalendarView />;
      case "notifications":
        return <NotificationsView />;
      case "leave":
        return <LeaveView />;
      case "submission":
        return <SubmissionView />;
      case "terms":
        return <TermsView />;
      case "settings":
        return <SettingsView />;
      case "admin":
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Sticky Header */}
        <Header />

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
