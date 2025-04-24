export interface JobInterface {
    _id?: string
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