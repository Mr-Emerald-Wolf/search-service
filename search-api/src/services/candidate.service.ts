import { v4 as uuidv4 } from "uuid";
import { CandidateInterface } from "../interfaces";
import { executeQuery } from "../client/mysql.client";
import { addToSyncQueue } from "../utils/helper";
import { Client } from "@elastic/elasticsearch";
import * as fs from "fs";

// Initialize Elasticsearch client
let client: Client;

client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "7i4HmR0BF2=55Bsd5qgB",
  },
  tls: {
    ca: fs.readFileSync("http_ca.crt"),
  },
});

const INDEX = "candidates";

// Helper function to convert MySQL date format to JS Date
const formatDates = (candidate: any): CandidateInterface => {
  if (candidate.dateOfBirth && !(candidate.dateOfBirth instanceof Date)) {
    candidate.dateOfBirth = new Date(candidate.dateOfBirth);
  }
  if (candidate.createdAt && !(candidate.createdAt instanceof Date)) {
    candidate.createdAt = new Date(candidate.createdAt);
  }
  if (candidate.updatedAt && !(candidate.updatedAt instanceof Date)) {
    candidate.updatedAt = new Date(candidate.updatedAt);
  }

  // Parse JSON fields from MySQL
  if (typeof candidate.skills === "string") {
    candidate.skills = JSON.parse(candidate.skills);
  }
  if (typeof candidate.language === "string") {
    candidate.language = JSON.parse(candidate.language);
  }
  if (typeof candidate.certificates === "string") {
    candidate.certificates = JSON.parse(candidate.certificates);
  }

  return candidate as CandidateInterface;
};


const candidateService = {
  async createCandidate(
    candidateData: CandidateInterface
  ): Promise<CandidateInterface> {
    const id = candidateData._id || uuidv4();
    const now = new Date();

    const candidate: CandidateInterface = {
      ...candidateData,
      createdAt: candidateData.createdAt || now,
      updatedAt: now,
    };

    // If dateOfBirth is provided, format it as well
    if (candidate.dateOfBirth) {
      candidate.dateOfBirth = now
    }
    try {
      // Insert into MySQL
      const fields = Object.keys(candidate).filter(
        (key) => candidate[key as keyof CandidateInterface] !== undefined
      );
      const placeholders = fields.map(() => "?").join(", ");
      const values = fields.map((field) => {
        const value = candidate[field as keyof CandidateInterface];
        if (Array.isArray(value)) {
          return JSON.stringify(value);
        }
        return value;
      });

      await executeQuery(
        `INSERT INTO candidates (${fields.join(", ")}) VALUES (${placeholders})`,
        values
      );

      // Insert into Elasticsearch
      await client.index({
        index: INDEX,
        id,
        document: candidate,
        refresh: true,
      });

      // Add to sync queue
      await addToSyncQueue("insert", "candidate", id, "Candidate created");

      return candidate;
    } catch (error) {
      console.error("Error creating candidate:", error);
      throw error;
    }
  },

  async getCandidates(): Promise<CandidateInterface[]> {
    try {
      const result = await client.search({
        index: INDEX,
        size: 1000,
        query: {
          match_all: {},
        },
        sort: [{ updatedAt: { order: "desc" } }],
      });

      const hits = result?.hits?.hits;
      if (!hits || !Array.isArray(hits)) {
        throw new Error("Invalid Elasticsearch response format");
      }
      return hits.map((hit) => ({
        _id: hit._id,
        ...(hit._source as CandidateInterface),
      }));
    } catch (esError) {
      console.error("Error fetching candidates from Elasticsearch:", esError);
      throw esError;
    }
  },

  async getCandidate(id: string): Promise<CandidateInterface | undefined> {
    try {
      const result = await client.get({
        index: INDEX,
        id,
      });

      return {
        _id: result._id,
        ...(result._source as CandidateInterface),
      };
    } catch (esError: any) {
      if (esError.meta?.statusCode === 404) {
        return undefined;
      }
      console.error(
        `Error fetching candidate ${id} from Elasticsearch:`,
        esError
      );
      throw esError;
    }
  },

  async updateCandidate(
    id: string,
    candidateData: Partial<CandidateInterface>
  ): Promise<CandidateInterface | undefined> {
    try {
      // Check if candidate exists
      const candidate = await this.getCandidate(id);
      if (!candidate) return undefined;

      const now = new Date();
      const updateData = {
        ...candidateData,
        updatedAt: now,
      };

      // Update MySQL
      const setClause = Object.entries(updateData)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key} = ?`)
        .join(", ");

      const values = Object.entries(updateData)
        .filter(([_, value]) => value !== undefined)
        .map(([_, value]) =>
          Array.isArray(value) ? JSON.stringify(value) : value
        );

      await executeQuery(`UPDATE candidates SET ${setClause} WHERE id = ?`, [
        ...values,
        id,
      ]);

      // Update Elasticsearch
      await client.update({
        index: INDEX,
        id,
        doc: updateData,
        refresh: true,
      });

      // Add to sync queue
      await addToSyncQueue("update", "candidate", id, "Candidate updated");

      // Get and return the updated document
      return await this.getCandidate(id);
    } catch (error) {
      console.error(`Error updating candidate ${id}:`, error);
      throw error;
    }
  },

  async deleteCandidate(id: string): Promise<boolean> {
    try {
      // Check if candidate exists
      const candidate = await this.getCandidate(id);
      if (!candidate) return false;

      // Delete from MySQL
      await executeQuery("DELETE FROM candidates WHERE id = ?", [id]);

      // Delete from Elasticsearch
      await client.delete({
        index: INDEX,
        id,
        refresh: true,
      });

      // Add to sync queue
      await addToSyncQueue("delete", "candidate", id, "Candidate deleted");

      return true;
    } catch (error) {
      console.error(`Error deleting candidate ${id}:`, error);
      throw error;
    }
  },

  async searchCandidates(
    query?: string,
    filters?: any
  ): Promise<CandidateInterface[]> {
    try {
      const searchQuery: any = {
        query: {
          bool: {
            must: [],
          },
        },
      };

      // Add text search if query is provided
      if (query && query.trim()) {
        searchQuery.query.bool.must.push({
          multi_match: {
            query,
            fields: [
              "name^3",
              "email^2",
              "skills^2",
              "currentDesignation",
              "industry",
              "address",
              "preferredLocation",
              "currentLocation",
            ],
            fuzziness: "AUTO",
          },
        });
      }

      // Add filters if provided
      if (filters) {
        if (filters.remoteWork === true) {
          filters.preferredLocation = "Remote";
        }
        Object.entries(filters).forEach(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            key === "remoteWork" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return; // Skip null, undefined, or empty array filters
          }

          if (Array.isArray(value)) {
            // Use keyword for exact matches
            if (key === "currentLocation") {
              searchQuery.query.bool.must.push({
                terms: { [`${key}.keyword`]: value },
              });
            } else {
              searchQuery.query.bool.must.push({
                terms: { [key]: value },
              });
            }
          } else if (typeof value === "object" && value !== null) {
            // For range filters
            searchQuery.query.bool.must.push({
              range: { [key]: value },
            });
          } else {
            // For exact match filters
            searchQuery.query.bool.must.push({
              match: { [key]: value },
            });
          }
        });
      }

      if (searchQuery.query.bool.must.length === 0) {
        searchQuery.query.bool.must.push({ match_all: {} });
      }

      // Perform the search query
      const result = await client.search({
        index: INDEX,
        body: searchQuery,
        sort: [{ _score: { order: "desc" } }, { updatedAt: { order: "desc" } }],
      });

      console.log("Final Elasticsearch Query:", JSON.stringify(searchQuery, null, 2));

      return result.hits.hits.map((hit) => ({
        _id: hit._id,
        ...(hit._source as CandidateInterface),
      }));
    } catch (error) {
      console.error("Error searching candidates in Elasticsearch:", error);
      return this.getCandidates();
    }
  },

  // Method to initialize indices and sync data
  async initializeWithMockData(
    mockCandidates: CandidateInterface[]
  ): Promise<void> {
    try {
      // Check if Elasticsearch index exists
      const indexExists = await client.indices.exists({ index: INDEX });

      if (!indexExists) {
        // Create index with mapping
        await client.indices.create({
          index: INDEX,
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
        });
      }

      // Insert mock data into MySQL and Elasticsearch
      for (const candidate of mockCandidates) {
        await this.createCandidate(candidate);
      }

      console.log(`Initialized with ${mockCandidates.length} mock candidates`);
    } catch (error) {
      console.error("Error initializing with mock data:", error);
      throw error;
    }
  },

  // Method to sync data between MySQL and Elasticsearch
  async syncData(): Promise<void> {
    try {
      // Get all candidates from MySQL
      const mysqlCandidates = await executeQuery<CandidateInterface[]>(
        "SELECT * FROM candidates"
      );
      const formattedCandidates = mysqlCandidates.map(formatDates);

      // Bulk index to Elasticsearch
      const operations = formattedCandidates.flatMap(
        (candidate: CandidateInterface) => [
          { index: { _index: INDEX, _id: candidate._id } },
          candidate,
        ]
      );

      if (operations.length > 0) {
        await client.bulk({
          refresh: true,
          operations,
        });
      }

      console.log(
        `Synced ${formattedCandidates.length} candidates from MySQL to Elasticsearch`
      );
    } catch (error) {
      console.error("Error syncing data:", error);
      throw error;
    }
  },
};

export default candidateService;
