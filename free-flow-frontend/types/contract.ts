export interface Contract {
  id: string
  project_id: string,
  task_id: string
  role: string
  responsibilities: string[]
  deliverables: string[]
  effort: string
  start_date: string
  end_date: string
  timestamp: string
  project?: {
    id: string
    name: string
    category: string
    status: string
    progress_percent?: number
    description?: string
  }
  task?: {
    id: string
    title: string
    status: string
    due_date?: string
    description?: string
  }
  timeline_notes?: string
  payment_terms?: string
}

export interface Contracts {
  Contracts: Contract[]
}
