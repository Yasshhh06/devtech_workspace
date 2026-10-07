import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

export type NavTab = 
  | "dashboard"
  | "projects"
  | "attendance"
  | "calendar"
  | "notifications"
  | "leave"
  | "submission"
  | "terms"
  | "settings"
  | "admin";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  category: "Task Assignment" | "Announcement" | "Deadline" | "General" | "Urgent";
  targetEmails: string[];
  sender: string;
  createdAt: string;
  readByEmails?: string[];
}

export interface InternUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
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
  internLogin: (email: string, password: string, userObj?: InternUser) => boolean;
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
  deleteHoliday: (id: string) => void;

  // Notifications Store
  notifications: NotificationItem[];
  setNotifications: (notifications: NotificationItem[]) => void;
  sendNotification: (notif: Omit<NotificationItem, "id" | "createdAt" | "readByEmails">) => void;
  markNotificationAsRead: (id: string, userEmail: string) => void;
  deleteNotification: (id: string) => void;

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
        name: "",
        username: "",
        email: "",
        role: "DevTech Software Intern",
        mobile: "",
        workspaceName: "DevTech Workspace",
        workspaceCount: 1,
      },

      internLogin: (email, password, userObj) => {
        const cleanEmail = email.toLowerCase().trim();
        let found = get().registeredInterns.find(
          (i) => i.email.toLowerCase() === cleanEmail
        );

        if (!found && userObj) {
          found = userObj;
          const existing = get().registeredInterns.filter((i) => i.email.toLowerCase() !== cleanEmail);
          set({ registeredInterns: [userObj, ...existing] });
        }

        if (found) {
          if (found.password && password && found.password !== password) {
            return false;
          }
          set({
            isInternLoggedIn: true,
            currentIntern: found,
            currentUser: {
              name: found.name,
              username: found.name || found.email.split("@")[0],
              email: found.email,
              role: `${found.domain || "Software"} Intern`,
              mobile: found.mobile || "",
              workspaceName: "DevTech Workspace",
              workspaceCount: 1,
            },
          });
          get().addAuditLog(`Intern Logged In: ${found.email}`, "Authentication");
          return true;
        }
        return false;
      },
      internLogout: () =>
        set({
          isInternLoggedIn: false,
          currentIntern: null,
          currentUser: {
            name: "",
            username: "",
            email: "",
            role: "Intern",
            mobile: "",
            workspaceName: "DevTech Workspace",
            workspaceCount: 1,
          },
        }),

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
          mobile: newIntern.mobile || "",
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
          mobile: created.mobile || "",
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
        const todayStr = new Date().toISOString().split("T")[0];
        const currentEmail = get().currentIntern?.email || get().currentUser?.email || "";
        const currentName = get().currentIntern?.name || get().currentUser?.name || "Intern";
        const customId = `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

        const newRecord: AttendanceRecord = {
          id: customId,
          internName: currentName,
          internEmail: currentEmail,
          domain: get().currentIntern?.domain || "Full Stack Web Development",
          date: todayStr,
          day: new Date().getDay(),
          status: "Present",
          time: timeStr,
          selfieUrl,
          ipAddress: "103.21.124.5 (Pune)",
        };

        set((state) => ({
          isCheckedIn: true,
          checkinTime: timeStr,
          attendanceHistory: [newRecord, ...state.attendanceHistory.filter((a) => a.id !== customId)],
        }));

        setDoc(doc(db, "attendance", customId), newRecord, { merge: true }).catch((err) => console.error("Error saving attendance to Firestore:", err));
        get().addAuditLog(`Marked attendance for ${currentEmail}`, "Attendance");
      },

      updateUserProfile: (displayName, mobile) => {
        set((state) => ({
          currentIntern: state.currentIntern ? { ...state.currentIntern, name: displayName, mobile } : null,
          currentUser: { ...state.currentUser, username: displayName, name: displayName, mobile },
        }));

        const currentEmail = get().currentIntern?.email || get().currentUser?.email;
        if (currentEmail) {
          updateDoc(doc(db, "users", currentEmail.toLowerCase().trim()), {
            name: displayName,
            mobile: mobile,
            updatedAt: new Date().toISOString(),
          }).catch((err) => console.error("Error updating user profile in Firestore:", err));
        }
      },

      projects: [],

      tasks: [],
      setTasks: (tasks) => set({ tasks }),

      assignTaskToIntern: (taskData) => {
        const customId = `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const taskObj: any = {
          id: customId,
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
          ...taskObj,
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks.filter((t) => t.id !== customId)],
        }));

        setDoc(doc(db, "tasks", customId), taskObj, { merge: true }).catch((err) => console.error("Error adding task to Firestore:", err));
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

          const customId = `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

          const taskObj: any = {
            id: customId,
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

          setDoc(doc(db, "tasks", customId), taskObj, { merge: true }).catch((err) => console.error("Error adding task to Firestore:", err));

          return { ...taskObj } as TaskItem;
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
        const customId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

        const subRecord: ProjectSubmission = {
          id: customId,
          internName,
          internEmail,
          projectTitle,
          driveLink,
          adminNote: adminNote || "",
          submittedAt: new Date().toLocaleString(),
          status: "Awaiting Evaluation",
        };

        set((state) => ({
          submissions: [subRecord, ...state.submissions.filter((s) => s.id !== customId)],
        }));

        const payload: any = { ...subRecord };
        Object.keys(payload).forEach((k) => {
          if (payload[k] === undefined) delete payload[k];
        });

        setDoc(doc(db, "submissions", customId), payload, { merge: true }).catch((err) => console.error("Error saving submission to Firestore:", err));
        get().addAuditLog(`Submitted project "${projectTitle}"`, "Submissions");
      },

      evaluateSubmission: (id, score, status, remarks) => {
        const numScore = Number(score);
        const targetSub = get().submissions.find((s) => s.id === id);

        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === id ? { ...sub, score: numScore, status, mentorRemarks: remarks } : sub
          ),
        }));

        const updatePayload: any = {
          score: numScore,
          status,
          mentorRemarks: remarks || "",
          updatedAt: new Date().toISOString(),
        };

        if (targetSub) {
          if (targetSub.internName) updatePayload.internName = targetSub.internName;
          if (targetSub.internEmail) updatePayload.internEmail = targetSub.internEmail;
          if (targetSub.projectTitle) updatePayload.projectTitle = targetSub.projectTitle;
          if (targetSub.driveLink) updatePayload.driveLink = targetSub.driveLink;
        }

        setDoc(doc(db, "submissions", id), updatePayload, { merge: true }).catch((err) =>
          console.error("Error updating submission score in Firestore:", err)
        );

        get().addAuditLog(`Evaluated submission ${id}: Score ${numScore}`, "Submissions Evaluation");
      },

      leaveRequests: [],
      setLeaveRequests: (leaveRequests) => set({ leaveRequests }),

      addLeaveRequest: (req) => {
        const customId = `leave-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const leaveObj: LeaveRequest = {
          id: customId,
          ...req,
          status: "Pending",
        };

        set((state) => ({
          leaveRequests: [leaveObj, ...state.leaveRequests.filter((l) => l.id !== customId)],
        }));

        const payload: any = { ...leaveObj };
        Object.keys(payload).forEach((k) => {
          if (payload[k] === undefined) delete payload[k];
        });

        setDoc(doc(db, "leaves", customId), payload, { merge: true }).catch((err) => console.error("Error saving leave request to Firestore:", err));
        get().addAuditLog(`Submitted leave request for ${req.startDate}`, "Leave");
      },

      updateLeaveStatus: (id, status, remark) => {
        set((state) => ({
          leaveRequests: state.leaveRequests.map((req) =>
            req.id === id ? { ...req, status, adminRemark: remark } : req
          ),
        }));

        setDoc(
          doc(db, "leaves", id),
          {
            status,
            adminRemark: remark || "",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => console.error("Error updating leave status in Firestore:", err));

        get().addAuditLog(`Updated leave request ${id} to ${status}`, "Leave Management");
      },

      holidays: [],
      setHolidays: (holidays) => set({ holidays }),

      addHoliday: (holidayData) => {
        const customId = `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const holObj: CalendarHoliday = {
          id: customId,
          ...holidayData,
        };

        set((state) => ({
          holidays: [holObj, ...state.holidays.filter((h) => h.id !== customId)],
        }));

        const payload: any = { ...holObj };
        Object.keys(payload).forEach((k) => {
          if (payload[k] === undefined) delete payload[k];
        });

        setDoc(doc(db, "holidays", customId), payload, { merge: true }).catch((err) => console.error("Error saving holiday to Firestore:", err));
        get().addAuditLog(`Added holiday: ${holidayData.title}`, "Calendar");
      },

      deleteHoliday: (id) => {
        set((state) => ({
          holidays: state.holidays.filter((h) => h.id !== id),
        }));
        deleteDoc(doc(db, "holidays", id)).catch((err) => console.error("Error deleting holiday from Firestore:", err));
        get().addAuditLog(`Deleted holiday ${id}`, "Calendar");
      },

      notifications: [],
      setNotifications: (notifications) => set({ notifications }),

      sendNotification: (notifData) => {
        const customId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const notifObj: NotificationItem = {
          id: customId,
          ...notifData,
          createdAt: new Date().toLocaleString(),
          readByEmails: [],
        };

        set((state) => ({
          notifications: [notifObj, ...state.notifications.filter((n) => n.id !== customId)],
        }));

        setDoc(doc(db, "notifications", customId), notifObj, { merge: true }).catch((err) =>
          console.error("Error saving notification to Firestore:", err)
        );
        get().addAuditLog(`Sent notification "${notifData.title}"`, "Notifications");
      },

      markNotificationAsRead: (id, userEmail) => {
        const cleanEmail = userEmail.toLowerCase().trim();
        const targetNotif = get().notifications.find((n) => n.id === id);
        if (!targetNotif) return;

        const updatedReadBy = Array.from(new Set([...(targetNotif.readByEmails || []), cleanEmail]));

        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, readByEmails: updatedReadBy } : n
          ),
        }));

        updateDoc(doc(db, "notifications", id), {
          readByEmails: updatedReadBy,
        }).catch((err) => console.error("Error updating notification read status in Firestore:", err));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
        deleteDoc(doc(db, "notifications", id)).catch((err) => console.error("Error deleting notification from Firestore:", err));
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

      // Realtime Listener across ALL Firebase Firestore collections
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
                mobile: data.mobile || "",
              });
            }
          });
          set({ registeredInterns: fetched });
        });

        const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
          const fetchedTasks: TaskItem[] = [];
          snapshot.forEach((docSnap) => {
            fetchedTasks.push({ ...docSnap.data(), id: docSnap.id } as TaskItem);
          });
          set({ tasks: fetchedTasks });
        });

        const unsubAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
          const fetchedAtt: AttendanceRecord[] = [];
          snapshot.forEach((docSnap) => {
            fetchedAtt.push({ ...docSnap.data(), id: docSnap.id } as AttendanceRecord);
          });
          set({ attendanceHistory: fetchedAtt });
        });

        const unsubSubmissions = onSnapshot(collection(db, "submissions"), (snapshot) => {
          const fetchedSubs: ProjectSubmission[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedSubs.push({
              internName: data.internName || "",
              internEmail: data.internEmail || "",
              projectTitle: data.projectTitle || "",
              driveLink: data.driveLink || "",
              adminNote: data.adminNote || "",
              submittedAt: data.submittedAt || "",
              status: data.status || "Awaiting Evaluation",
              score: data.score !== undefined && data.score !== null ? Number(data.score) : null,
              mentorRemarks: data.mentorRemarks || "",
              ...data,
              id: docSnap.id,
            } as ProjectSubmission);
          });
          set({ submissions: fetchedSubs });
        });

        const unsubLeaves = onSnapshot(collection(db, "leaves"), (snapshot) => {
          const fetchedLeaves: LeaveRequest[] = [];
          snapshot.forEach((docSnap) => {
            fetchedLeaves.push({ ...docSnap.data(), id: docSnap.id } as LeaveRequest);
          });
          set({ leaveRequests: fetchedLeaves });
        });

        const unsubHolidays = onSnapshot(collection(db, "holidays"), (snapshot) => {
          const fetchedHols: CalendarHoliday[] = [];
          snapshot.forEach((docSnap) => {
            fetchedHols.push({ ...docSnap.data(), id: docSnap.id } as CalendarHoliday);
          });
          set({ holidays: fetchedHols });
        });

        const unsubNotifications = onSnapshot(collection(db, "notifications"), (snapshot) => {
          const fetchedNotifs: NotificationItem[] = [];
          snapshot.forEach((docSnap) => {
            fetchedNotifs.push({ ...docSnap.data(), id: docSnap.id } as NotificationItem);
          });
          set({ notifications: fetchedNotifs });
        });

        return () => {
          unsubUsers();
          unsubTasks();
          unsubAttendance();
          unsubSubmissions();
          unsubLeaves();
          unsubHolidays();
          unsubNotifications();
        };
      },
    }),
    {
      name: "devtech-workspace-store-v8",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAdminLoggedIn: state.isAdminLoggedIn,
        isInternLoggedIn: state.isInternLoggedIn,
        currentIntern: state.currentIntern,
        currentUser: state.currentUser,
        activeRole: state.activeRole,
        activeTab: state.activeTab,
      }),
    }
  )
);
