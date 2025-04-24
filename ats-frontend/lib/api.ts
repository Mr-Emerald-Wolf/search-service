import type { CandidateInterface, JobInterface, ApplicationInterface, QueueItem } from "./interfaces"

const API_CONFIG = {
  baseUrl: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  }
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json()
    console.error(error.message)
    throw new Error(error.message || "API request failed")
  }
  return response.json()
}

// Candidate APIs
export const getCandidates = async (): Promise<CandidateInterface[]> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates`, {
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const getCandidate = async (id: string): Promise<CandidateInterface | undefined> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates/${id}`, {
    headers: API_CONFIG.headers
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const createCandidate = async (candidate: CandidateInterface): Promise<CandidateInterface> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates`, {
    method: "POST",
    headers: API_CONFIG.headers,
    body: JSON.stringify(candidate),
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const updateCandidate = async (
  id: string,
  candidate: Partial<CandidateInterface>,
): Promise<CandidateInterface | undefined> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates/${id}`, {
    method: "PUT",
    headers: API_CONFIG.headers,
    body: JSON.stringify(candidate),
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const deleteCandidate = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates/${id}`, {
    method: "DELETE",
    headers: API_CONFIG.headers
  })
  if (response.status === 404) return false
  await handleResponse(response)
  return true
}

export const searchCandidates = async (query: string, filters?: any): Promise<CandidateInterface[]> => {
  const queryParams = new URLSearchParams()
  if (query) queryParams.set("query", query)
  if (filters) queryParams.set("filters", JSON.stringify(filters))
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates/search?${queryParams.toString()}`, {
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Job APIs
export const getJobs = async (): Promise<JobInterface[]> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/jobs`, {
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const getJob = async (id: string): Promise<JobInterface | undefined> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/jobs/${id}`, {
    headers: API_CONFIG.headers
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const createJob = async (job: JobInterface): Promise<JobInterface> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/jobs`, {
    method: "POST",
    headers: API_CONFIG.headers,
    body: JSON.stringify(job),
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const updateJob = async (id: string, job: Partial<JobInterface>): Promise<JobInterface | undefined> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/jobs/${id}`, {
    method: "PUT",
    headers: API_CONFIG.headers,
    body: JSON.stringify(job),
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const deleteJob = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/jobs/${id}`, {
    method: "DELETE",
    headers: API_CONFIG.headers
  })
  if (response.status === 404) return false
  await handleResponse(response)
  return true
}

export const searchJobs = async (query: string, filters?: any): Promise<JobInterface[]> => {
  const queryParams = new URLSearchParams()
  if (query) queryParams.set("query", query)
  if (filters) queryParams.set("filters", JSON.stringify(filters))
  const response = await fetch(`${API_CONFIG.baseUrl}/jobs/search?${queryParams.toString()}`, {
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Application APIs
export const getApplications = async (): Promise<ApplicationInterface[]> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/applications`, {
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const getApplication = async (id: string): Promise<ApplicationInterface | undefined> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/applications/${id}`, {
    headers: API_CONFIG.headers
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const createApplication = async (application: ApplicationInterface): Promise<ApplicationInterface> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/applications`, {
    method: "POST",
    headers: API_CONFIG.headers,
    body: JSON.stringify(application),
  })
  const result = await handleResponse(response)
  return result.data || result
}

export const updateApplication = async (
  id: string,
  application: Partial<ApplicationInterface>,
): Promise<ApplicationInterface | undefined> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/applications/${id}`, {
    method: "PUT",
    headers: API_CONFIG.headers,
    body: JSON.stringify(application),
  })
  if (response.status === 404) return undefined
  const result = await handleResponse(response)
  return result.data || result
}

export const deleteApplication = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/applications/${id}`, {
    method: "DELETE",
    headers: API_CONFIG.headers
  })
  if (response.status === 404) return false
  await handleResponse(response)
  return true
}

// Migration APIs
export const triggerMigration = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/candidates/sync`, {
    method: "POST",
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Queue APIs
export const getQueueItems = async (): Promise<QueueItem[]> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/queue`, {
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Process queue items
export const processQueue = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/queue/process`, {
    method: "POST",
    headers: API_CONFIG.headers
  })
  const result = await handleResponse(response)
  return result.data || result
}

// Subscribe to queue updates (using Server-Sent Events)
export const subscribeToQueueUpdates = (callback: (items: QueueItem[]) => void) => {
  const eventSource = new EventSource(`${API_CONFIG.baseUrl}/queue/subscribe`)
  
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
