import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NavTab = 
  | "dashboard"
  | "projects"
  | "attendance"
  | "calendar"
  | "standup"
  | "leave"
  | "submission"
  | "terms"
  | "nda"
  | "settings"
  | "assessments"
  | "resources"
  | "documents"
  | "team"
  | "meetings"
  | "performance"
  | "announcements"
  | "notifications"
  | "certificate"
  | "profile";

export interface InternUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  batch: string;
  domain: string;
  college?: string;
  mentor?: string;
  avatarUrl?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  assignedToEmail: string;
  assignedToName: string;
  domain?: string;
  status: "done" | "in progress" | "pending";
  priority: "HIGH Priority" | "MEDIUM Priority" | "LOW Priority";
  dueDate?: string;
  documentUrl?: string;
  documentName?: string;
  score?: number | null;
  remarks?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  priority: "HIGH Priority" | "MEDIUM Priority" | "LOW Priority";
  progress: number;
  dueDate: string;
}

export interface AttendanceRecord {
  id: string;
  internName: string;
  internEmail: string;
  domain?: string;
  date: string;
  day: number;
  status: "Present" | "Absent" | "Upcoming" | "Weekend";
  time?: string;
  selfieUrl?: string;
  ipAddress?: string;
}

export interface LeaveRequest {
  id: string;
  internName: string;
  internEmail: string;
  type: "Work From Home (WFH)" | "Casual Leave" | "Sick Leave";
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  adminRemark?: string;
}

export interface ProjectSubmission {
  id: string;
  internName: string;
  internEmail: string;
  projectTitle: string;
  driveLink: string;
  adminNote?: string;
  submittedAt: string;
  status: "Awaiting Evaluation" | "Approved" | "Needs Revision";
  score?: number | null;
  mentorRemarks?: string;
}

export interface CalendarHoliday {
  id: string;
  date: string;
  title: string;
  type: "Holiday" | "Flexible Workday" | "Announcement";
}

export interface AssessmentItem {
  id: string;
  title: string;
  domain: string;
  description: string;
  deadline: string;
  status: "Pending" | "Completed" | "Submitted";
  questionsCount: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: "General" | "Internship" | "Assessment" | "Project" | "HR" | "Urgent";
  date: string;
  author: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: "Full Stack Development" | "AI & ML" | "Data Analytics" | "Cloud & DevOps" | "Git & GitHub" | "Soft Skills";
  type: "PDF" | "Video" | "Link" | "Documentation";
  url: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "Offer Letter" | "Joining Letter" | "Internship Guidelines" | "Company Policies" | "Project Specs";
  url: string;
  uploadedAt: string;
}

export interface CertificateItem {
  id: string;
  certificateId: string;
  internName: string;
  internId: string;
  domain: string;
  issueDate: string;
  status: "Issued" | "Pending Approval";
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
}

interface WorkspaceState {
  // Admin Session
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;

  activeRole: "intern" | "admin";
  setActiveRole: (role: "intern" | "admin") => void;

  // Intern Session
  isInternLoggedIn: boolean;
  currentIntern: InternUser | null;
  currentUser: {
    name: string;
    username: string;
    email: string;
    role: string;
    mobile: string;
    workspaceName: string;
    workspaceCount: number;
  };
  internLogin: (email: string, password: string) => boolean;
  internLogout: () => void;

  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Registered Interns Database (50+ Multi-domain interns)
  registeredInterns: InternUser[];
  addNewIntern: (intern: Omit<InternUser, "id">) => InternUser;

  // Attendance state
  isCheckedIn: boolean;
  checkinTime: string | null;
  attendanceHistory: AttendanceRecord[];
  markAttendance: (selfieUrl?: string) => void;

  // Projects store
  projects: ProjectItem[];
  
  // Tasks store
  tasks: TaskItem[];
  assignTaskToIntern: (task: Omit<TaskItem, "id">) => void;
  assignTaskToMultipleInterns: (
    targetEmails: string[],
    title: string,
    description: string,
    priority: "HIGH Priority" | "MEDIUM Priority" | "LOW Priority",
    dueDate: string,
    documentUrl?: string,
    documentName?: string,
    targetDomain?: string
  ) => void;

  // Submissions Store
  submissions: ProjectSubmission[];
  addSubmission: (projectTitle: string, driveLink: string, adminNote: string) => void;
  evaluateSubmission: (id: string, score: number, status: "Approved" | "Needs Revision", remarks: string) => void;

  // Leave Requests Store
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, "id" | "status">) => void;
  updateLeaveStatus: (id: string, status: "Approved" | "Rejected", remark?: string) => void;

  // Calendar Holidays Store
  holidays: CalendarHoliday[];
  addHoliday: (holiday: Omit<CalendarHoliday, "id">) => void;

  // Additional Modules Store
  assessments: AssessmentItem[];
  announcements: AnnouncementItem[];
  resources: ResourceItem[];
  documents: DocumentItem[];
  certificates: CertificateItem[];
  auditLogs: AuditLogItem[];

  addAnnouncement: (announcement: Omit<AnnouncementItem, "id">) => void;
  addAuditLog: (action: string, module: string) => void;
  updateUserProfile: (displayName: string, mobile: string) => void;
}

// Clean Slate Initial State for Production Ready Setup
const initialInternsList: InternUser[] = [
  {
    id: "int-1",
    name: "Mohite Yash",
    email: "mohiteyash940@gmail.com",
    batch: "DEV-2026-FS04",
    domain: "Full Stack Web Development",
    college: "COEP Pune",
    mentor: "Rahul Sharma",
  },
];

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      isAdminLoggedIn: true,
      activeRole: "intern",
      setActiveRole: (role) => set({ activeRole: role }),

      adminLogin: (username, password) => {
        if (username === "admin" && (password === "devtechadmin123" || password === "admin")) {
          set({ isAdminLoggedIn: true });
          get().addAuditLog("Admin Logged In", "Authentication");
          return true;
        }
        return false;
      },
      adminLogout: () => set({ isAdminLoggedIn: false }),

      isInternLoggedIn: true,
      currentIntern: initialInternsList[0],
      currentUser: {
        name: "Mohite Yash",
        username: "mohiteyash940",
        email: "mohiteyash940@gmail.com",
        role: "Devtech Software Intern",
        mobile: "+91 9967053816",
        workspaceName: "DevTech Workspace",
        workspaceCount: 1,
      },

      internLogin: (email) => {
        const found = get().registeredInterns.find((i) => i.email.toLowerCase() === email.toLowerCase());
        if (found) {
          set({
            isInternLoggedIn: true,
            currentIntern: found,
            currentUser: {
              name: found.name,
              username: found.email.split("@")[0],
              email: found.email,
              role: `${found.domain} Intern`,
              mobile: "+91 9967053816",
              workspaceName: "DevTech Workspace",
              workspaceCount: 1,
            },
          });
          get().addAuditLog(`Intern Logged In: ${found.email}`, "Authentication");
          return true;
        }
        return false;
      },
      internLogout: () => set({ isInternLoggedIn: false, currentIntern: null }),

      activeTab: "dashboard",
      setActiveTab: (tab) => set({ activeTab: tab }),

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      registeredInterns: initialInternsList,

      addNewIntern: (newIntern) => {
        const created: InternUser = {
          id: `intern-${Date.now()}`,
          ...newIntern,
        };
        set((state) => ({
          registeredInterns: [created, ...state.registeredInterns],
        }));
        get().addAuditLog(`Added Intern ${created.name} (${created.email})`, "Intern Management");
        return created;
      },

      isCheckedIn: false,
      checkinTime: null,
      attendanceHistory: [],

      markAttendance: (selfieUrl) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const todayStr = "2026-10-06";
        const currentEmail = get().currentIntern?.email || "mohiteyash940@gmail.com";
        const currentName = get().currentIntern?.name || "Mohite Yash";

        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}`,
          internName: currentName,
          internEmail: currentEmail,
          domain: get().currentIntern?.domain || "Full Stack Web Development",
          date: todayStr,
          day: 6,
          status: "Present",
          time: timeStr,
          selfieUrl,
          ipAddress: "103.21.124.5 (Pune)",
        };

        set((state) => ({
          isCheckedIn: true,
          checkinTime: timeStr,
          attendanceHistory: [newRecord, ...state.attendanceHistory],
        }));
        get().addAuditLog(`Marked attendance for ${currentEmail}`, "Attendance");
      },

      updateUserProfile: (displayName, mobile) =>
        set((state) => ({
          currentIntern: state.currentIntern ? { ...state.currentIntern, name: displayName } : null,
          currentUser: { ...state.currentUser, username: displayName, name: displayName, mobile },
        })),

      projects: [],

      tasks: [],

      assignTaskToIntern: (taskData) => {
        const newTask: TaskItem = {
          id: `t-${Date.now()}`,
          ...taskData,
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
        get().addAuditLog(`Assigned task "${taskData.title}" to ${taskData.assignedToEmail}`, "Task Management");
      },

      assignTaskToMultipleInterns: (targetEmails, title, description, priority, dueDate, documentUrl, documentName, targetDomain) => {
        const state = get();
        const newTasks: TaskItem[] = targetEmails.map((email) => {
          let intern = state.registeredInterns.find((i) => i.email.toLowerCase() === email.toLowerCase());
          
          // Auto-register email chip if it doesn't exist yet!
          if (!intern) {
            const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            intern = get().addNewIntern({
              name: nameFromEmail,
              email: email.toLowerCase(),
              batch: "DEV-2026-AUTO",
              domain: targetDomain || "Full Stack Web Development",
              college: "DevTech Academy",
              mentor: "DevTech Admin",
            });
          }

          return {
            id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title,
            description,
            assignedToEmail: email.toLowerCase().trim(),
            assignedToName: intern.name,
            domain: intern.domain,
            status: "in progress",
            priority,
            dueDate,
            documentUrl,
            documentName: documentName || (documentUrl ? "Task_Specification_Document.pdf" : undefined),
          };
        });

        set((prevState) => ({
          tasks: [...newTasks, ...prevState.tasks],
        }));
        get().addAuditLog(`Multi-assigned task "${title}" to ${targetEmails.length} intern email(s)`, "Task Management");
      },

      submissions: [],

      addSubmission: (projectTitle, driveLink, adminNote) => {
        const internName = get().currentIntern?.name || "Mohite Yash";
        const internEmail = get().currentIntern?.email || "mohiteyash940@gmail.com";
        set((state) => ({
          submissions: [
            {
              id: `sub-${Date.now()}`,
              internName,
              internEmail,
              projectTitle,
              driveLink,
              adminNote,
              submittedAt: new Date().toLocaleString(),
              status: "Awaiting Evaluation",
            },
            ...state.submissions,
          ],
        }));
        get().addAuditLog(`Submitted project "${projectTitle}"`, "Submissions");
      },

      evaluateSubmission: (id, score, status, remarks) => {
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === id ? { ...sub, score, status, mentorRemarks: remarks } : sub
          ),
        }));
        get().addAuditLog(`Evaluated submission ${id}: Score ${score}`, "Submissions Evaluation");
      },

      leaveRequests: [],

      addLeaveRequest: (req) => {
        set((state) => ({
          leaveRequests: [
            {
              id: `leave-${Date.now()}`,
              ...req,
              status: "Pending",
            },
            ...state.leaveRequests,
          ],
        }));
        get().addAuditLog(`Submitted leave request for ${req.startDate}`, "Leave");
      },

      updateLeaveStatus: (id, status, remark) => {
        set((state) => ({
          leaveRequests: state.leaveRequests.map((req) =>
            req.id === id ? { ...req, status, adminRemark: remark } : req
          ),
        }));
        get().addAuditLog(`Updated leave request ${id} to ${status}`, "Leave Management");
      },

      holidays: [],

      addHoliday: (holidayData) => {
        set((state) => ({
          holidays: [
            {
              id: `h-${Date.now()}`,
              ...holidayData,
            },
            ...state.holidays,
          ],
        }));
        get().addAuditLog(`Added holiday: ${holidayData.title}`, "Calendar");
      },

      assessments: [],

      announcements: [],

      resources: [],

      documents: [],

      certificates: [],

      auditLogs: [],

      addAnnouncement: (announcement) => set((state) => ({
        announcements: [{ id: `ann-${Date.now()}`, ...announcement }, ...state.announcements],
      })),

      addAuditLog: (action, module) => set((state) => ({
        auditLogs: [{
          id: `log-${Date.now()}`,
          user: state.currentUser.name || "System",
          action,
          module,
          timestamp: new Date().toLocaleString(),
          ip: "103.21.124.5",
        }, ...state.auditLogs],
      })),
    }),
    {
      name: "devtech-workspace-store-v4",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
