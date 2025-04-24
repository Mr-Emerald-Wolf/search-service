import { Client } from "@elastic/elasticsearch"

// Initialize the Elasticsearch client
const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || "elastic",
    password: process.env.ELASTICSEARCH_PASSWORD || "changeme",
  },
})

// Index names
export const INDICES = {
  CANDIDATES: "candidates",
  JOBS: "jobs",
  APPLICATIONS: "applications",
}

// Initialize indices if they don't exist
export async function initializeIndices() {
  // Check if indices exist
  const candidatesExists = await elasticClient.indices.exists({ index: INDICES.CANDIDATES })
  const jobsExists = await elasticClient.indices.exists({ index: INDICES.JOBS })
  const applicationsExists = await elasticClient.indices.exists({ index: INDICES.APPLICATIONS })

  // Create candidates index if it doesn't exist
  if (!candidatesExists) {
    await elasticClient.indices.create({
      index: INDICES.CANDIDATES,
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            email: { type: "keyword" },
            mobile: { type: "keyword" },
            gender: { type: "keyword" },
            dateOfBirth: { type: "date" },
            fathersName: { type: "text" },
            age: { type: "integer" },
            address: { type: "text" },
            hiringProgram: { type: "keyword" },
            secondaryNumber: { type: "keyword" },
            industry: { type: "keyword" },
            functionalArea: { type: "keyword" },
            currentOrganization: { type: "keyword" },
            currentDesignation: { type: "keyword" },
            preferredLocation: { type: "keyword" },
            currentLocation: { type: "keyword" },
            nationality: { type: "keyword" },
            noticePeriod: { type: "keyword" },
            relocate: { type: "boolean" },
            lookingForRemoteWork: { type: "boolean" },
            maritalStatus: { type: "keyword" },
            primarySource: { type: "keyword" },
            secondarySource: { type: "keyword" },
            skills: { type: "keyword" },
            language: { type: "keyword" },
            certificates: { type: "keyword" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          },
        },
      },
    })
  }

  // Create jobs index if it doesn't exist
  if (!jobsExists) {
    await elasticClient.indices.create({
      index: INDICES.JOBS,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            description: { type: "text" },
            department: { type: "keyword" },
            location: { type: "keyword" },
            employmentType: { type: "keyword" },
            salaryMin: { type: "integer" },
            salaryMax: { type: "integer" },
            skillsRequired: { type: "keyword" },
            postedDate: { type: "date" },
            closingDate: { type: "date" },
            status: { type: "keyword" },
            candidateIds: { type: "keyword" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          },
        },
      },
    })
  }

  // Create applications index if it doesn't exist
  if (!applicationsExists) {
    await elasticClient.indices.create({
      index: INDICES.APPLICATIONS,
      body: {
        mappings: {
          properties: {
            candidateId: { type: "keyword" },
            jobId: { type: "keyword" },
            status: { type: "keyword" },
            appliedDate: { type: "date" },
            notes: { type: "text" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          },
        },
      },
    })
  }
}

// Export the client for use in API routes
export default elasticClient
