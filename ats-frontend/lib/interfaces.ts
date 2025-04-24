export interface CandidateInterface {
  id?: string
  name: string
  email: string
  mobile: string
  gender?: "Male" | "Female" | "Other"
  dateOfBirth?: Date
  fathersName?: string
  age?: number
  address?: string
  hiringProgram?: string
  secondaryNumber?: string
  industry?: string
  functionalArea?: string
  currentOrganization?: string
  currentDesignation?: string
  preferredLocation?: string
  currentLocation?: string
  nationality?: string
  noticePeriod?: string
  relocate?: boolean
  lookingForRemoteWork?: boolean
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed"
  primarySource?: string
  secondarySource?: string
  skills?: string[]
  language?: string[]
  certificates?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface JobInterface {
  id?: string
  title: string
  description: string
  department: string
  location: string
  employmentType: string
  salaryMin: number
  salaryMax: number
  skillsRequired: string[]
  postedDate: Date
  closingDate: Date
  status: string
  candidateIds?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ApplicationInterface {
  id?: string
  candidateId: string
  jobId: string
  status?: string
  appliedDate?: Date
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface QueueItem {
  id: string
  operation: "insert" | "update" | "delete"
  entityType: "candidate" | "job" | "application"
  entityId: string
  status: "pending" | "processing" | "completed" | "failed"
  timestamp: Date
  details?: string
}
