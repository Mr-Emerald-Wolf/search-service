import { Client } from "@elastic/elasticsearch";
import * as fs from "fs";

let client: Client;

export async function initElasticsearchClient(): Promise<void> {
  client = new Client({
    node: "https://localhost:9200",
    auth: {
      username: "elastic",
      password: "7i4HmR0BF2=55Bsd5qgB",
    },
    tls: {
      ca: fs.readFileSync("http_ca.crt"),
      rejectUnauthorized: true,
    },
    requestTimeout: 5000,
  });

  try {
    await client.ping();
    console.log("✅ Elasticsearch client connected successfully");

    const candidateIndex = "candidates";
    const jobIndex = "jobs";

    // Check if the candidates index exists
    const candidateExists = await client.indices.exists({
      index: candidateIndex,
    });
    if (!candidateExists) {
      console.log(`ℹ️ Index "${candidateIndex}" does not exist. Creating...`);
      await client.indices.create({
        index: candidateIndex,
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
              currentOrganization: { type: "text" },
              currentDesignation: { type: "text" },
              preferredLocation: { type: "keyword" },
              currentLocation: { type: "keyword" },
              nationality: { type: "keyword" },
              noticePeriod: { type: "keyword" },
              relocate: { type: "boolean" },
              lookingForRemoteWork: { type: "boolean" },
              maritalStatus: { type: "keyword" },
              primarySource: { type: "keyword" },
              secondarySource: { type: "keyword" },
              skills: { type: "text" }, // Handle array of skills
              language: { type: "text" }, // Handle array of languages
              certificates: { type: "text" }, // Handle array of certificates
              createdAt: { type: "date" },
              updatedAt: { type: "date" },
            },
          },
        },
      });
    }

    // Check if the jobs index exists
    const jobExists = await client.indices.exists({ index: jobIndex });
    if (!jobExists) {
      console.log(`ℹ️ Index "${jobIndex}" does not exist. Creating...`);
      await client.indices.create({
        index: jobIndex,
        body: {
          mappings: {
            properties: {
              jobTitle: { type: "text" },
              jobDescription: { type: "text" },
              jobLocation: { type: "keyword" },
              company: { type: "text" },
              postedDate: { type: "date" },
              closingDate: { type: "date" },
              jobType: { type: "keyword" },
              salaryRange: { type: "keyword" },
              requiredSkills: { type: "text" },
              preferredExperience: { type: "keyword" },
              industry: { type: "keyword" },
              companyLocation: { type: "keyword" },
              applyLink: { type: "keyword" },
              createdAt: { type: "date" },
              updatedAt: { type: "date" },
            },
          },
        },
      });

      console.log("✅ Index created");
    } else {
      console.log("✅ Index already exists");
    }
  } catch (error) {
    console.error(
      "❌ Failed to connect to Elasticsearch or create index:",
      error
    );
    throw error;
  }
}

export function getElasticClient(): Client {
  if (!client) {
    throw new Error("Elasticsearch client not initialized!");
  }
  return client;
}
