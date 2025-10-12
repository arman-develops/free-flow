// Core Associate Types
export interface Associate {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  timezone?: string
  status: "pending" | "active" | "inactive" | "suspended"
  createdAt: string
  updatedAt: string
}

// Contract & Task Invite Types
export interface Contract {
  id: string
  associateId: string
  freelancerId: string
  freelancerName: string
  freelancerCompany?: string
  title: string
  description: string
  paymentTerms: {
    type: "hourly" | "fixed" | "milestone"
    rate?: number
    amount?: number
    currency: string
    paymentSchedule: string
  }
  confidentialityClause: string
  ownershipClause: string
  startDate: string
  endDate?: string
  status: "pending" | "accepted" | "declined" | "expired"
  acceptedAt?: string
  declinedAt?: string
  createdAt: string
}

export interface TaskInvite {
  id: string
  contractId: string
  projectId: string
  projectName: string
  clientName: string
  role: string
  responsibilities: string[]
  estimatedHours?: number
  deadline?: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "accepted" | "declined"
  acceptedAt?: string
  declinedAt?: string
  createdAt: string
}

// Task Management Types
export interface Task {
  id: string
  projectId: string
  projectName: string
  clientName: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "urgent"
  assignedBy: string
  dueDate?: string
  startedAt?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  attachments: Attachment[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

export interface Comment {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
}

// Financial Types
export interface Payment {
  id: string
  projectId: string
  projectName: string
  clientName: string
  amount: number
  currency: string
  status: "pending" | "processing" | "paid" | "failed" | "disputed"
  type: "hourly" | "fixed" | "milestone" | "bonus"
  description: string
  dueDate?: string
  paidAt?: string
  invoiceUrl?: string
  createdAt: string
}

export interface Earnings {
  totalEarned: number
  pendingPayments: number
  thisMonth: number
  lastMonth: number
  currency: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  projectId: string
  projectName: string
  clientName: string
  amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issuedAt: string
  dueDate: string
  paidAt?: string
  items: InvoiceItem[]
  notes?: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

// Time Tracking Types
export interface TimeEntry {
  id: string
  taskId: string
  taskTitle: string
  projectId: string
  projectName: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  description?: string
  billable: boolean
  createdAt: string
}

// Communication Types
export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  attachments: Attachment[]
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  projectId?: string
  projectName?: string
  participants: Participant[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  role: "freelancer" | "associate" | "client"
}

// Notification Types
export interface Notification {
  id: string
  type: "task" | "payment" | "message" | "contract" | "deadline" | "system"
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

// Project Overview Types
export interface Project {
  id: string
  name: string
  clientName: string
  description?: string
  status: "active" | "completed" | "on-hold" | "cancelled"
  startDate: string
  endDate?: string
  totalTasks: number
  completedTasks: number
  totalEarnings: number
  currency: string
}
