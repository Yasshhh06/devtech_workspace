import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc } from "firebase/firestore";

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

  // Registered Interns Database (Synced with Firebase)
  registeredInterns: InternUser[];
  setRegisteredInterns: (interns: InternUser[]) => void;
  addNewIntern: (intern: Omit<InternUser, "id">) => InternUser;

  // Attendance state
  isCheckedIn: boolean;
  checkinTime: string | null;
  attendanceHistory: AttendanceRecord[];
  setAttendanceHistory: (history: AttendanceRecord[]) => void;
  markAttendance: (selfieUrl?: string) => void;

  // Projects store
  projects: ProjectItem[];
  
  // Tasks store
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
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
  setSubmissions: (subs: ProjectSubmission[]) => void;
  addSubmission: (projectTitle: string, driveLink: string, adminNote: string) => void;
  evaluateSubmission: (id: string, score: number, status: "Approved" | "Needs Revision", remarks: string) => void;

  // Leave Requests Store
  leaveRequests: LeaveRequest[];
  setLeaveRequests: (leaves: LeaveRequest[]) => void;
  addLeaveRequest: (req: Omit<LeaveRequest, "id" | "status">) => void;
  updateLeaveStatus: (id: string, status: "Approved" | "Rejected", remark?: string) => void;

  // Calendar Holidays Store
  holidays: CalendarHoliday[];
  setHolidays: (holidays: CalendarHoliday[]) => void;
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

  // Realtime Sync Listener Setup
  initFirebaseRealtimeSync: () => () => void;
}

const initialInternsList: InternUser[] = [];

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      isAdminLoggedIn: false,
      activeRole: "intern",
      setActiveRole: (role) => set({ activeRole: role }),

      adminLogin: (username, password) => {
        const cleanUser = username.trim();
        const cleanPass = password.trim();

        if (
          (cleanUser.toLowerCase() === "yasshhh" || cleanUser.toLowerCase() === "admin") &&
          cleanPass === "DevTech@#2004"
        ) {
          set({ isAdminLoggedIn: true });
          get().addAuditLog("Admin Logged In", "Authentication");

          // Save/Update Admin account into Firebase Firestore users collection
          setDoc(
            doc(db, "users", "admin_yasshhh"),
            {
              id: "admin_yasshhh",
              name: "Yasshhh Admin",
              username: "Yasshhh",
              email: "yasshhh@devtechit.com",
              password: "DevTech@#2004",
              role: "ADMIN",
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((err) => console.error("Firebase admin sync error:", err));

          return true;
        }
        return false;
      },
      adminLogout: () => set({ isAdminLoggedIn: false }),

      isInternLoggedIn: false,
      currentIntern: null,
      currentUser: {
        name: "Intern User",
        username: "intern",
        email: "",
        role: "DevTech Software Intern",
        mobile: "+91 9967053816",
        workspaceName: "DevTech Workspace",
        workspaceCount: 1,
      },

      internLogin: (email, password) => {
        const cleanEmail = email.toLowerCase().trim();
        const found = get().registeredInterns.find(
          (i) => i.email.toLowerCase() === cleanEmail
        );
        if (found) {
          if (found.password && password && found.password !== password) {
            return false;
          }
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
      setRegisteredInterns: (interns) => set({ registeredInterns: interns }),

      addNewIntern: (newIntern) => {
        const cleanEmail = newIntern.email.toLowerCase().trim();
        const created: InternUser = {
          id: cleanEmail,
          ...newIntern,
          email: cleanEmail,
        };

        const existingFiltered = get().registeredInterns.filter((i) => i.email.toLowerCase() !== cleanEmail);
        set({ registeredInterns: [created, ...existingFiltered] });

        // Save to Firebase Firestore users collection asynchronously
        setDoc(doc(db, "users", cleanEmail), {
          id: cleanEmail,
          name: created.name,
          email: cleanEmail,
          password: created.password || "devtech123",
          domain: created.domain || "Full Stack Web Development",
          batch: created.batch || "DEV-2026-FS04",
          role: "INTERN",
        }, { merge: true }).catch(err => console.error("Firebase sync error:", err));

        get().addAuditLog(`Added Intern ${created.name} (${cleanEmail})`, "Intern Management");
        return created;
      },

      isCheckedIn: false,
      checkinTime: null,
      attendanceHistory: [],
      setAttendanceHistory: (history) => set({ attendanceHistory: history }),

      markAttendance: (selfieUrl) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const todayStr = "2026-10-06";
        const currentEmail = get().currentIntern?.email || get().currentUser?.email || "";
        const currentName = get().currentIntern?.name || get().currentUser?.name || "Intern";

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

        addDoc(collection(db, "attendance"), newRecord).catch(err => console.error(err));
        get().addAuditLog(`Marked attendance for ${currentEmail}`, "Attendance");
      },

      updateUserProfile: (displayName, mobile) =>
        set((state) => ({
          currentIntern: state.currentIntern ? { ...state.currentIntern, name: displayName } : null,
          currentUser: { ...state.currentUser, username: displayName, name: displayName, mobile },
        })),

      projects: [],

      tasks: [],
      setTasks: (tasks) => set({ tasks }),

      assignTaskToIntern: (taskData) => {
        const taskObj: any = {
          title: taskData.title.trim(),
          description: taskData.description ? taskData.description.trim() : "",
          assignedToEmail: taskData.assignedToEmail.toLowerCase().trim(),
          assignedToName: taskData.assignedToName || "Intern",
          domain: taskData.domain || "Full Stack Web Development",
          status: taskData.status || "in progress",
          priority: taskData.priority || "HIGH Priority",
          dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
        };

        if (taskData.documentUrl && taskData.documentUrl.trim()) {
          taskObj.documentUrl = taskData.documentUrl.trim();
          taskObj.documentName = taskData.documentName || "Task_Specification_Document.pdf";
        }

        const newTask: TaskItem = {
          id: `t-${Date.now()}`,
          ...taskObj,
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));

        addDoc(collection(db, "tasks"), taskObj).catch(err => console.error("Error adding task to Firestore:", err));
        get().addAuditLog(`Assigned task "${taskData.title}" to ${taskData.assignedToEmail}`, "Task Management");
      },

      assignTaskToMultipleInterns: (targetEmails, title, description, priority, dueDate, documentUrl, documentName, targetDomain) => {
        const state = get();
        const newTasks: TaskItem[] = targetEmails.map((email) => {
          let intern = state.registeredInterns.find((i) => i.email.toLowerCase() === email.toLowerCase());
          
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

          const taskObj: any = {
            title: title.trim(),
            description: description ? description.trim() : "",
            assignedToEmail: email.toLowerCase().trim(),
            assignedToName: intern?.name || email.split("@")[0],
            domain: intern?.domain || targetDomain || "Full Stack Web Development",
            status: "in progress",
            priority: priority || "HIGH Priority",
            dueDate: dueDate || new Date().toISOString().split("T")[0],
          };

          if (documentUrl && documentUrl.trim()) {
            taskObj.documentUrl = documentUrl.trim();
            taskObj.documentName = documentName && documentName.trim() ? documentName.trim() : "Task_Specification_Document.pdf";
          }

          addDoc(collection(db, "tasks"), taskObj).catch(err => console.error("Error adding task to Firestore:", err));

          return { id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...taskObj } as TaskItem;
        });

        set((prevState) => ({
          tasks: [...newTasks, ...prevState.tasks],
        }));
        get().addAuditLog(`Multi-assigned task "${title}" to ${targetEmails.length} intern email(s)`, "Task Management");
      },

      submissions: [],
      setSubmissions: (submissions) => set({ submissions }),

      addSubmission: (projectTitle, driveLink, adminNote) => {
        const internName = get().currentIntern?.name || get().currentUser?.name || "Intern";
        const internEmail = get().currentIntern?.email || get().currentUser?.email || "";
        const subRecord: ProjectSubmission = {
          id: `sub-${Date.now()}`,
          internName,
          internEmail,
          projectTitle,
          driveLink,
          adminNote: adminNote || "",
          submittedAt: new Date().toLocaleString(),
          status: "Awaiting Evaluation",
        };
        set((state) => ({
          submissions: [subRecord, ...state.submissions],
        }));

        const payload: any = { ...subRecord };
        Object.keys(payload).forEach((k) => {
          if (payload[k] === undefined) delete payload[k];
        });

        addDoc(collection(db, "submissions"), payload).catch(err => console.error("Error saving submission to Firestore:", err));
        get().addAuditLog(`Submitted project "${projectTitle}"`, "Submissions");
      },

      evaluateSubmission: (id, score, status, remarks) => {
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === id ? { ...sub, score, status, mentorRemarks: remarks } : sub
          ),
        }));

        updateDoc(doc(db, "submissions", id), {
          score,
          status,
          mentorRemarks: remarks || "",
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.error("Error updating submission score in Firestore:", err));

        get().addAuditLog(`Evaluated submission ${id}: Score ${score}`, "Submissions Evaluation");
      },

      leaveRequests: [],
      setLeaveRequests: (leaveRequests) => set({ leaveRequests }),

      addLeaveRequest: (req) => {
        const leaveObj: LeaveRequest = {
          id: `leave-${Date.now()}`,
          ...req,
          status: "Pending",
        };
        set((state) => ({
          leaveRequests: [leaveObj, ...state.leaveRequests],
        }));

        const payload: any = { ...leaveObj };
        Object.keys(payload).forEach((k) => {
          if (payload[k] === undefined) delete payload[k];
        });

        addDoc(collection(db, "leaves"), payload).catch(err => console.error("Error saving leave request to Firestore:", err));
        get().addAuditLog(`Submitted leave request for ${req.startDate}`, "Leave");
      },

      updateLeaveStatus: (id, status, remark) => {
        set((state) => ({
          leaveRequests: state.leaveRequests.map((req) =>
            req.id === id ? { ...req, status, adminRemark: remark } : req
          ),
        }));

        updateDoc(doc(db, "leaves", id), {
          status,
          adminRemark: remark || "",
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.error("Error updating leave status in Firestore:", err));

        get().addAuditLog(`Updated leave request ${id} to ${status}`, "Leave Management");
      },

      holidays: [],
      setHolidays: (holidays) => set({ holidays }),

      addHoliday: (holidayData) => {
        const holObj: CalendarHoliday = {
          id: `h-${Date.now()}`,
          ...holidayData,
        };
        set((state) => ({
          holidays: [holObj, ...state.holidays],
        }));

        const payload: any = { ...holObj };
        Object.keys(payload).forEach((k) => {
          if (payload[k] === undefined) delete payload[k];
        });

        addDoc(collection(db, "holidays"), payload).catch(err => console.error("Error saving holiday to Firestore:", err));
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

      // Realtime Listener across ALL 6 Firebase Firestore collections
      initFirebaseRealtimeSync: () => {
        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
          const fetched: InternUser[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.role !== "ADMIN") {
              fetched.push({
                id: docSnap.id,
                name: data.name,
                email: data.email,
                password: data.password || "devtech123",
                batch: data.batch || "DEV-2026-FS04",
                domain: data.domain || "Full Stack Web Development",
              });
            }
          });
          set({ registeredInterns: fetched });
        });

        const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
          const fetchedTasks: TaskItem[] = [];
          snapshot.forEach((docSnap) => {
            fetchedTasks.push({ id: docSnap.id, ...docSnap.data() } as TaskItem);
          });
          set({ tasks: fetchedTasks });
        });

        const unsubAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
          const fetchedAtt: AttendanceRecord[] = [];
          snapshot.forEach((docSnap) => {
            fetchedAtt.push({ id: docSnap.id, ...docSnap.data() } as AttendanceRecord);
          });
          set({ attendanceHistory: fetchedAtt });
        });

        const unsubSubmissions = onSnapshot(collection(db, "submissions"), (snapshot) => {
          const fetchedSubs: ProjectSubmission[] = [];
          snapshot.forEach((docSnap) => {
            fetchedSubs.push({ id: docSnap.id, ...docSnap.data() } as ProjectSubmission);
          });
          set({ submissions: fetchedSubs });
        });

        const unsubLeaves = onSnapshot(collection(db, "leaves"), (snapshot) => {
          const fetchedLeaves: LeaveRequest[] = [];
          snapshot.forEach((docSnap) => {
            fetchedLeaves.push({ id: docSnap.id, ...docSnap.data() } as LeaveRequest);
          });
          set({ leaveRequests: fetchedLeaves });
        });

        const unsubHolidays = onSnapshot(collection(db, "holidays"), (snapshot) => {
          const fetchedHols: CalendarHoliday[] = [];
          snapshot.forEach((docSnap) => {
            fetchedHols.push({ id: docSnap.id, ...docSnap.data() } as CalendarHoliday);
          });
          set({ holidays: fetchedHols });
        });

        return () => {
          unsubUsers();
          unsubTasks();
          unsubAttendance();
          unsubSubmissions();
          unsubLeaves();
          unsubHolidays();
        };
      },
    }),
    {
      name: "devtech-workspace-store-v6",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
