"use client";

import React from "react";
import { FileText, CalendarCheck, MessageSquareText, ShieldCheck, Mail } from "lucide-react";

export default function TermsView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Terms & Conditions</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Please read these terms carefully. By using the Devtech 22A22J Internship Platform, you agree to be bound by these Terms & Conditions.
        </p>
      </div>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800/60 p-3 rounded-xl font-medium">
        <span>Last updated: <strong>6 October 2026</strong></span>
        <span>•</span>
        <span>Effective immediately</span>
        <span>•</span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">Devtech 22A22J</span>
      </div>

      {/* Navigation Index Pills */}
      <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
        {[
          "1. Acceptance", "2. Platform Use", "3. User Responsibilities", "4. Prohibited Activities",
          "5. Attendance & Standup", "6. Intellectual Property", "7. Privacy", "8. Confidentiality",
          "9. Termination", "10. Liability", "11. Governing Law", "12. Updates"
        ].map((tag, idx) => (
          <span key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg">
            {tag}
          </span>
        ))}
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            1. Acceptance of Terms
          </h3>
          <p>
            By accessing or using the Devtech 22A22J internship management platform ("Platform"), you confirm that you have read, understood, and agree to be bound by these Terms & Conditions ("Terms").
          </p>
          <p>
            These Terms apply to all users including interns, administrators, and any other person accessing the Platform.
          </p>
          <p>
            If you do not agree with any part of these Terms, you must immediately stop using the Platform and notify your administrator.
          </p>
          <p>
            Devtech IT Solution reserves the right to modify these Terms at any time. Continued use of the Platform after changes are published constitutes your acceptance of the revised Terms.
          </p>
          <p>
            You must be at least 18 years of age, or have appropriate guardian consent, to use this Platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            2. About the Platform
          </h3>
          <p>
            The Platform is an internship management system operated by Devtech IT Solution (Devtech 22A22J) that provides tools for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
            <li>Daily attendance tracking via photo check-in</li>
            <li>Project and task management</li>
            <li>Daily standup submissions</li>
            <li>Leave and Work-From-Home requests</li>
            <li>Project document sharing</li>
            <li>Standup and progress reporting</li>
            <li>Final project submission</li>
            <li>Digital NDA & agreement signing</li>
            <li>Internship notices and announcements</li>
          </ul>
          <p>
            The Platform is provided exclusively for use during your internship engagement with Devtech 22A22J and may not be used for any other purpose.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            3. User Responsibilities
          </h3>
          <p>As a Platform user, you are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Credentials:</strong> Maintaining the confidentiality of your login credentials. Never share your password with anyone. The Company is not liable for any harm resulting from your failure to keep credentials secure.</li>
            <li><strong>Accuracy:</strong> Ensuring that all information you provide on the Platform — including attendance photos, standup reports, leave requests, and project submissions — is accurate, honest, and complete.</li>
            <li><strong>Security:</strong> Promptly reporting any security breach, unauthorised access to your account, or suspicious activity to the Platform administrator.</li>
            <li><strong>Profile:</strong> Keeping your profile information up to date, including your mobile number and email address, to receive important notifications.</li>
            <li><strong>Compliance:</strong> Complying with all attendance and standup requirements set out in the Internship Agreement and NDA. Refer to the NDA Agreement page for minimum thresholds.</li>
            <li><strong>Device Security:</strong> Using the Platform only on devices that are reasonably secure and free of malware. The Company is not responsible for data loss resulting from use on compromised devices.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            4. Prohibited Activities
          </h3>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Violation of any of the following rules may result in immediate termination of your internship and, where applicable, legal action.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <strong className="text-gray-900 dark:text-white">Impersonation:</strong> You must not impersonate another user, mark attendance on behalf of another intern, or falsify any records on the Platform.
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <strong className="text-gray-900 dark:text-white">Cheating & Plagiarism:</strong> Submitting plagiarised code, copied standup entries, or AI-generated content passed off as original work without disclosure is strictly prohibited.
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <strong className="text-gray-900 dark:text-white">Unauthorised Access:</strong> You must not attempt to access accounts, data, or system areas beyond your authorised permissions.
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <strong className="text-gray-900 dark:text-white">Data Extraction:</strong> Scraping, bulk-downloading, or exporting Platform data — including attendance records, project data, or user information — is strictly prohibited.
            </div>
          </div>
        </section>

        {/* Section 5 (With 35 & 30 Stat Pills matching text!) */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            5. Attendance & Standup Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-center space-y-1">
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">35</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs">Minimum Attendance Days</div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Required for certificate eligibility</p>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-center space-y-1">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">30</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs">Minimum Daily Standups</div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Required for certificate eligibility</p>
            </div>
          </div>

          <p>
            Attendance must be marked daily via the photo check-in feature before 11:59 PM IST.
          </p>
          <p>
            Standup reports must be meaningful, accurate descriptions of your daily work. Blank, copy-pasted, or AI-generated standups without context will not be counted.
          </p>
          <p>
            Leave approved through the Leave / WFH module will not count as an absent day towards the 35-day minimum.
          </p>
          <p className="font-semibold text-red-600 dark:text-red-400">
            Failure to meet either the attendance or standup requirement renders you ineligible for a completion certificate, regardless of project quality.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            6. Intellectual Property
          </h3>
          <p>
            All content on this Platform — including design, code, logos, text, and graphics — is the exclusive property of Devtech IT Solution (Devtech 22A22J) and is protected by applicable intellectual property laws.
          </p>
          <p>
            Work products, code, analyses, and deliverables created by you during your internship are the sole property of the Company as described in the NDA Agreement.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            7. Privacy & Data Collection
          </h3>
          <p>By using the Platform, you consent to the following data collection and processing:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Profile Data:</strong> Name, email, mobile number, and profile picture stored for account management.</li>
            <li><strong>Attendance Photos:</strong> Facial photos captured during check-in, stored on Cloudinary for attendance verification.</li>
            <li><strong>Activity Logs:</strong> Task updates, standup submissions, leave requests, project actions, and login activity.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            8. Confidentiality Summary
          </h3>
          <p>
            All non-public information about Devtech IT Solution products, processes, clients, code, and strategies is confidential. Confidentiality obligations survive the end of your internship for 3 years.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            9. Suspension & Termination
          </h3>
          <p>
            The Company may suspend or terminate your Platform access at any time for breach of Terms, failure to meet attendance/standup thresholds, or gross misconduct.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            10. Limitation of Liability
          </h3>
          <p>
            Devtech IT Solution provides the Platform on an "as-is" and "as-available" basis.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            11. Governing Law & Disputes
          </h3>
          <p>
            These Terms are governed by and construed in accordance with applicable laws in India.
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            12. Updates to These Terms
          </h3>
          <p>
            The Company may update these Terms at any time. Continued use of the Platform after changes constitutes acceptance.
          </p>
        </section>

        {/* Support Footer */}
        <div className="bg-gray-50 dark:bg-slate-800/60 p-5 rounded-xl border border-gray-200 dark:border-slate-800 text-center space-y-2">
          <h4 className="font-bold text-gray-900 dark:text-white">Questions about these Terms?</h4>
          <p className="text-gray-500 dark:text-gray-400">
            If you have any questions or concerns about these Terms & Conditions, please contact your workspace administrator or the Devtech IT Solution team directly.
          </p>
        </div>

      </div>
    </div>
  );
}
