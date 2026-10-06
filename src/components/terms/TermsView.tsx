"use client";

import React from "react";
import { FileText, Building2, Calendar, ShieldCheck, Mail, Globe, MapPin, CheckCircle2 } from "lucide-react";

export default function TermsView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Terms & Conditions</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Please read these Terms & Conditions carefully. By accessing or using the DevTech Internship Management Platform, you agree to comply with these Terms, your Internship Agreement, NDA, Offer Letter, and applicable Company policies.
        </p>
      </div>

      {/* Meta Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Last Updated</p>
            <p className="font-bold text-slate-900">6 October 2026</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Effective From</p>
            <p className="font-bold text-slate-900">6 October 2026</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Organization</p>
            <p className="font-bold text-slate-900">DevTech IT Solution</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-sky-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Platform</p>
            <p className="font-bold text-slate-900">DevTech Workspace</p>
          </div>
        </div>
      </div>

      {/* 20 Sections Document Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-xs leading-relaxed text-slate-700">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">1.</span>
            <span>Acceptance of Terms</span>
          </h3>
          <p>By using the Platform, you confirm that you have read and agreed to these Terms.</p>
          <p>These Terms apply to all authorized interns, trainees, administrators, mentors, and Company representatives using the Platform.</p>
          <p>DevTech IT Solution may update these Terms from time to time. Continued use of the Platform after an update means you accept the revised Terms.</p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">2.</span>
            <span>About the Platform</span>
          </h3>
          <p>The DevTech Internship Management Platform is used to manage internship and training activities, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Intern onboarding and profiles</li>
            <li>Attendance</li>
            <li>Training and tasks</li>
            <li>Project management</li>
            <li>Assessments</li>
            <li>Leave and WFH requests</li>
            <li>Notices and announcements</li>
            <li>Document submission</li>
            <li>Project submission</li>
            <li>Performance tracking</li>
            <li>Certificate eligibility</li>
          </ul>
          <p className="font-semibold text-slate-800 pt-1">The Platform must be used only for authorized internship-related purposes.</p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">3.</span>
            <span>Internship Participation</span>
          </h3>
          <p>Interns are expected to actively participate in assigned training, tasks, assessments, projects, meetings, and other internship activities.</p>
          <p>Internship participation does not guarantee permanent employment, a job offer, or a specific stipend/salary unless separately confirmed in writing by DevTech IT Solution.</p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">4.</span>
            <span>Account & User Responsibilities</span>
          </h3>
          <p>Interns must:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Provide accurate information.</li>
            <li>Keep login credentials confidential.</li>
            <li>Never share their account with another person.</li>
            <li>Keep profile information updated.</li>
            <li>Complete assigned work within deadlines.</li>
            <li>Follow Company instructions and policies.</li>
            <li>Report unauthorized access or security issues immediately.</li>
          </ul>
          <p className="text-red-600 font-semibold pt-1">Providing false or misleading information may result in disciplinary action or termination.</p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">5.</span>
            <span>Attendance & Conduct</span>
          </h3>
          <p>Interns must maintain regular attendance, punctuality, discipline, and professional conduct throughout the internship.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div><strong className="text-slate-900">Weekly Holidays:</strong> Saturday and Sunday, unless otherwise communicated by the Company.</div>
            <div><strong className="text-slate-900">Maximum Leaves:</strong> A maximum of 5 leaves are permitted during the training/internship period.</div>
            <div><strong className="text-slate-900">Leave Request:</strong> Must be requested in advance through designated process with a valid reason.</div>
            <div><strong className="text-slate-900">Approval:</strong> Considered approved only after authorization from the designated person.</div>
            <div><strong className="text-slate-900">Attendance:</strong> Interns must personally mark their own attendance following the process.</div>
            <div><strong className="text-slate-900">Professional Conduct:</strong> Respectful communication, discipline, punctuality, and teamwork are mandatory.</div>
          </div>
          <p className="text-slate-600"><strong>Confidentiality:</strong> Company, client, project, technical, and internal information must be kept confidential.</p>
          <p className="text-red-600 font-semibold">Unauthorized absence, attendance manipulation, repeated late reporting, or serious misconduct may affect internship continuation and certificate eligibility.</p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">6.</span>
            <span>Training, Tasks & Assessments</span>
          </h3>
          <p>Interns must complete assigned training activities, tasks, assessments, and projects within the specified deadlines.</p>
          <p>The Company may evaluate interns based on:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Technical understanding</li>
            <li>Practical skills</li>
            <li>Problem-solving ability</li>
            <li>Task completion</li>
            <li>Project quality</li>
            <li>Learning ability</li>
            <li>Professional conduct</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">7.</span>
            <span>AI Use & Original Work</span>
          </h3>
          <p>AI tools may be restricted or prohibited for specific tasks, assessments, or projects.</p>
          <p>Where AI use is prohibited, interns must not use AI-generated work as their own.</p>
          <p className="text-red-600 font-semibold">Plagiarism, cheating, copying another intern's work, or submitting unauthorized work may result in disciplinary action or termination.</p>
          <p>Interns must submit genuine and original work as required by the Company.</p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">8.</span>
            <span>Project & Intellectual Property</span>
          </h3>
          <p>All Company-owned content, including software, source code, designs, documents, logos, training materials, and confidential information, remains the property of DevTech IT Solution or its respective owners.</p>
          <p>Project work and deliverables created during the internship will be governed by the applicable Internship Agreement and NDA.</p>
          <p>Interns must not copy, publish, distribute, sell, or misuse Company-owned materials without authorization.</p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">9.</span>
            <span>Confidentiality</span>
          </h3>
          <p>Interns may have access to confidential Company or client information. Such information must not be:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Shared with unauthorized persons</li>
            <li>Published online</li>
            <li>Used for personal purposes</li>
            <li>Copied or distributed without permission</li>
          </ul>
          <p className="font-semibold text-slate-800 pt-1">Confidentiality obligations continue after the internship as specified in the applicable NDA or agreement.</p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">10.</span>
            <span>Privacy & Data Collection</span>
          </h3>
          <p>The Company may collect and process information required for internship administration, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Name and contact details</li>
            <li>Profile photograph</li>
            <li>Attendance information and photographs</li>
            <li>Internship activity</li>
            <li>Project and assessment records</li>
            <li>Leave/WFH requests</li>
            <li>Documents submitted during onboarding</li>
          </ul>
          <p>Information may be used for internship administration, verification, communication, evaluation, security, and certificate processing.</p>
          <p>Reasonable measures will be taken to protect personal information, subject to applicable law.</p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">11.</span>
            <span>Prohibited Activities</span>
          </h3>
          <p>Users must not:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Impersonate another intern.</li>
            <li>Falsify attendance or records.</li>
            <li>Access another user's account.</li>
            <li>Attempt unauthorized system access.</li>
            <li>Scrape or extract Platform data.</li>
            <li>Upload malicious content.</li>
            <li>Exploit Platform vulnerabilities.</li>
            <li>Misuse Company or client information.</li>
            <li>Engage in harassment, abuse, or serious misconduct.</li>
          </ul>
          <p className="text-red-600 font-semibold pt-1">Violations may result in suspension, termination, or further action where applicable.</p>
        </section>

        {/* Section 12 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">12.</span>
            <span>Leave & Work-From-Home</span>
          </h3>
          <p>Leave and WFH requests must be submitted through the designated process and require approval where applicable.</p>
          <p>Unauthorized absence or repeated failure to follow the leave procedure may affect attendance and internship eligibility.</p>
        </section>

        {/* Section 13 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">13.</span>
            <span>Communication</span>
          </h3>
          <p>Interns are responsible for regularly checking official DevTech communication channels, including the Platform, official email, and designated communication groups.</p>
          <p>Important training schedules, tasks, deadlines, notices, and policy updates may be communicated through these channels.</p>
        </section>

        {/* Section 14 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">14.</span>
            <span>Certificate Eligibility</span>
          </h3>
          <p>A completion certificate may be issued only after the intern successfully completes the applicable internship requirements.</p>
          <p>Certificate eligibility may depend on:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Required attendance</li>
            <li>Training participation</li>
            <li>Task and project completion</li>
            <li>Assessment performance</li>
            <li>Required documentation</li>
            <li>Professional conduct</li>
            <li>Compliance with Company policies</li>
          </ul>
          <p className="font-semibold text-amber-700 pt-1">Meeting one requirement alone does not guarantee a certificate.</p>
        </section>

        {/* Section 15 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">15.</span>
            <span>Suspension & Termination</span>
          </h3>
          <p>DevTech IT Solution may suspend or terminate Platform access or internship participation for serious or repeated violations, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Misconduct</li>
            <li>Fraud or falsification</li>
            <li>Attendance violations</li>
            <li>Plagiarism or cheating</li>
            <li>Unauthorized AI use</li>
            <li>Confidentiality breaches</li>
            <li>Unauthorized system access</li>
            <li>Failure to complete mandatory requirements</li>
            <li>Violation of the Internship Agreement or NDA</li>
          </ul>
        </section>

        {/* Section 16 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">16.</span>
            <span>Platform Availability</span>
          </h3>
          <p>The Company will make reasonable efforts to maintain the Platform but does not guarantee uninterrupted or error-free availability.</p>
          <p>Temporary interruptions may occur due to maintenance, technical issues, third-party services, security incidents, or circumstances beyond the Company's reasonable control.</p>
        </section>

        {/* Section 17 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">17.</span>
            <span>Platform Security</span>
          </h3>
          <p>Users must not attempt to damage, disrupt, bypass, or compromise the Platform or Company systems.</p>
          <p>Any security vulnerability, unauthorized access, or suspicious activity must be reported immediately to the authorized DevTech team.</p>
        </section>

        {/* Section 18 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">18.</span>
            <span>Governing Law</span>
          </h3>
          <p>These Terms are governed by the applicable laws of India.</p>
          <p>Any dispute will be handled in accordance with the applicable Internship Agreement, Company policies, and laws of India.</p>
        </section>

        {/* Section 19 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">19.</span>
            <span>Updates to Terms</span>
          </h3>
          <p>DevTech IT Solution may modify these Terms when required.</p>
          <p>Updated Terms may be communicated through the Platform, official email, or other designated communication channels.</p>
          <p>Continued use of the Platform after an update constitutes acceptance of the revised Terms.</p>
        </section>

        {/* Section 20 */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="text-blue-600">20.</span>
            <span>Contact & Support</span>
          </h3>
          <p>For questions regarding the Platform or internship, contact the authorized DevTech IT Solution team through the official communication channels.</p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-medium">
            <p className="font-bold text-slate-900 text-sm">DevTech IT Solution</p>
            <p className="flex items-center space-x-2 text-slate-600">
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <a href="https://www.devtechitsolution.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                www.devtechitsolution.com
              </a>
            </p>
            <p className="flex items-center space-x-2 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Location: Kalyan, Mumbai, Maharashtra, India</span>
            </p>
          </div>
        </section>

        {/* Intern Acknowledgement Banner */}
        <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>Intern Acknowledgement</span>
          </h4>
          <p className="text-slate-600">By using the DevTech Internship Management Platform, you acknowledge that:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-medium">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You have read and understood these Terms.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You agree to follow Company rules and policies.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You will provide accurate information.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You will complete assigned work honestly and on time.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You will maintain professional conduct and discipline.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You will protect confidential information.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You will follow applicable AI-use restrictions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You understand that violations may affect internship & certificate eligibility.</span>
            </li>
          </ul>
        </div>

        {/* Copyright Footer */}
        <div className="pt-4 text-center border-t border-slate-100 text-slate-400 text-[11px] font-medium">
          © 2026 DevTech IT Solution. All Rights Reserved.
        </div>

      </div>
    </div>
  );
}
