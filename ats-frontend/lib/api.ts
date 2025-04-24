import type { CandidateInterface, JobInterface, ApplicationInterface, QueueItem } from "./interfaces"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }
  return response.json()
}

// Candidate APIs
export const getCandidates = async (): Promise<CandidateInterface[]> => {
  const response = await fetch("/api/candidates")
  const result = await handleResponse(response)
  return result.data || result
}

export const getCandidate = async (id: string): Promise<CandidateInterface | undefined> => {
  const response = await fetch(`/api/candidates/${id}`)
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const createCandidate = async (candidate: CandidateInterface): Promise<CandidateInterface> => {
  const response = await fetch("/api/candidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const updateCandidate = async (
  id: string,
  candidate: Partial<CandidateInterface>,
): Promise<CandidateInterface | undefined> => {
  const response = await fetch(`/api/candidates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const deleteCandidate = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/candidates/${id}`, {
    method: "DELETE",
  })
  if (response.status === 404) return false
  await handleResponse(response)
  return true
}

export const searchCandidates = async (query: string, filters?: any): Promise<CandidateInterface[]> => {
  const queryParams = new URLSearchParams()
  if (query) queryParams.set("query", query)
  if (filters) queryParams.set("filters", JSON.stringify(filters))

  const response = await fetch(`/api/candidates?${queryParams.toString()}`)
  const result = await handleResponse(response)
  return result.data || result
}

// Job APIs
export const getJobs = async (): Promise<JobInterface[]> => {
  const response = await fetch("/api/jobs")
  const result = await handleResponse(response)
  return result.data || result
}

export const getJob = async (id: string): Promise<JobInterface | undefined> => {
  const response = await fetch(`/api/jobs/${id}`)
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const createJob = async (job: JobInterface): Promise<JobInterface> => {
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const updateJob = async (id: string, job: Partial<JobInterface>): Promise<JobInterface | undefined> => {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const deleteJob = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "DELETE",
  })
  if (response.status === 404) return false
  await handleResponse(response)
  return true
}

export const searchJobs = async (query: string, filters?: any): Promise<JobInterface[]> => {
  const queryParams = new URLSearchParams()
  if (query) queryParams.set("query", query)
  if (filters) queryParams.set("filters", JSON.stringify(filters))

  const response = await fetch(`/api/jobs?${queryParams.toString()}`)
  const result = await handleResponse(response)
  return result.data || result
}

// Application APIs
export const getApplications = async (): Promise<ApplicationInterface[]> => {
  const response = await fetch("/api/applications")
  const result = await handleResponse(response)
  return result.data || result
}

export const getApplication = async (id: string): Promise<ApplicationInterface | undefined> => {
  const response = await fetch(`/api/applications/${id}`)
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const createApplication = async (application: ApplicationInterface): Promise<ApplicationInterface> => {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const updateApplication = async (
  id: string,
  application: Partial<ApplicationInterface>,
): Promise<ApplicationInterface | undefined> => {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const deleteApplication = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
  })
  if (response.status === 404) return false
  await handleResponse(response)
  return true
}

// Migration APIs
export const triggerMigration = async (): Promise<{ success: boolean; message: string }> => {
  // This now triggers a real migration from MySQL to Elasticsearch
  const response = await fetch("/api/migration", {
    method: "POST",
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Queue APIs
export const getQueueItems = async (): Promise<QueueItem[]> => {
  const response = await fetch("/api/queue")
  const result = await handleResponse(response)
  return result.data || result
}

// Process queue items
export const processQueue = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch("/api/queue", {
    method: "POST",
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Subscribe to queue updates (using Server-Sent Events)
export const subscribeToQueueUpdates = (callback: (items: QueueItem[]) => void) => {
  const eventSource = new EventSource("/api/queue/subscribe")

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data)
  }

  eventSource.onerror = (error) => {
    console.error("EventSource error:", error)
    eventSource.close()

    // Reconnect after 5 seconds
    setTimeout(() => {
      subscribeToQueueUpdates(callback)
    }, 5000)
  }

  return () => {
    eventSource.close()
  }
}
