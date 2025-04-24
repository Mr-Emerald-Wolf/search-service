import { v4 as uuidv4 } from "uuid";
import { ApplicationInterface, JobInterface } from "../interfaces";
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

const INDEX = "jobs";

// Helper function to format dates
const formatDates = (job: any): JobInterface => {
  if (job.postedDate && !(job.postedDate instanceof Date)) {
    job.postedDate = new Date(job.postedDate);
  }
  if (job.closingDate && !(job.closingDate instanceof Date)) {
    job.closingDate = new Date(job.closingDate);
  }

  return job as JobInterface;
};

function formatDateMySQL(date: Date): Date {
  console.log(typeof date);
  const formattedDate = new Date(date).toISOString().slice(0, 10); // Get the YYYY-MM-DD part as a Date object
  return new Date(formattedDate);
}

const jobService = {
  async createJob(jobData: JobInterface): Promise<JobInterface> {
    const id = jobData._id || uuidv4();
    const now = new Date();

    const job: JobInterface = {
      ...jobData,
      postedDate: formatDateMySQL(jobData.postedDate) || now,
      closingDate: formatDateMySQL(jobData.closingDate) || now,
    };

    try {
      // Insert into MySQL
      const fields = Object.keys(job).filter(
        (key) => job[key as keyof JobInterface] !== undefined
      );
      const placeholders = fields.map(() => "?").join(", ");
      const values = fields.map((field) => job[field as keyof JobInterface]);

      await executeQuery(
        `INSERT INTO jobs (${fields.join(", ")}) VALUES (${placeholders})`,
        values
      );

      // Insert into Elasticsearch
      await client.index({
        index: INDEX,
        id,
        document: job,
        refresh: true,
      });

      // Add to sync queue
      await addToSyncQueue("insert", "job", id, "Job created");

      return job;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  async getJobs(): Promise<JobInterface[]> {
    try {
      const result = await client.search({
        index: INDEX,
        size: 1000,
        query: {
          match_all: {},
        },
        sort: [{ postedDate: { order: "desc" } }],
      });

      const hits = result?.hits?.hits;
      if (!hits || !Array.isArray(hits)) {
        throw new Error("Invalid Elasticsearch response format");
      }
      return hits.map((hit) => ({
        _id: hit._id,
        ...(hit._source as JobInterface),
      }));
    } catch (esError) {
      console.error("Error fetching jobs from Elasticsearch:", esError);
      throw esError;
    }
  },

  async getJob(id: string): Promise<JobInterface | undefined> {
    try {
      const result = await client.get({
        index: INDEX,
        id,
      });

      return {
        _id: result._id,
        ...(result._source as JobInterface),
      };
    } catch (esError: any) {
      if (esError.meta?.statusCode === 404) {
        return undefined;
      }
      console.error(`Error fetching job ${id} from Elasticsearch:`, esError);
      throw esError;
    }
  },

  async updateJob(
    id: string,
    jobData: Partial<JobInterface>
  ): Promise<JobInterface | undefined> {
    try {
      // Check if job exists
      const job = await this.getJob(id);
      if (!job) return undefined;

      const now = new Date();
      const updateData = {
        ...jobData,
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

      await executeQuery(`UPDATE jobs SET ${setClause} WHERE id = ?`, [
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
      await addToSyncQueue("update", "job", id, "Job updated");

      // Get and return the updated document
      return await this.getJob(id);
    } catch (error) {
      console.error(`Error updating job ${id}:`, error);
      throw error;
    }
  },

  async deleteJob(id: string): Promise<boolean> {
    try {
      // Check if job exists
      const job = await this.getJob(id);
      if (!job) return false;

      // Delete from MySQL
      await executeQuery("DELETE FROM jobs WHERE id = ?", [id]);

      // Delete from Elasticsearch
      await client.delete({
        index: INDEX,
        id,
        refresh: true,
      });

      // Add to sync queue
      await addToSyncQueue("delete", "job", id, "Job deleted");

      return true;
    } catch (error) {
      console.error(`Error deleting job ${id}:`, error);
      throw error;
    }
  },

  async searchJobs(query?: string, filters?: any): Promise<JobInterface[]> {
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
            fields: ["title^3", "department^2", "skillsRequired^2", "location"],
            fuzziness: "AUTO",
          },
        });
      }

      // Add filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return; // Skip null, undefined, or empty array filters
          }
          if (key === "departments" && Array.isArray(value)) {
            searchQuery.query.bool.must.push({
              terms: { "department.keyword": value },
            });
          } else if (key === "locations" && Array.isArray(value)) {
            searchQuery.query.bool.must.push({
              terms: { "location.keyword": value },
            });
          } else if (key === "employmentTypes" && Array.isArray(value)) {
            searchQuery.query.bool.must.push({
              terms: { "employmentType.keyword": value },
            });
          } else if (key === "status" && Array.isArray(value)) {
            searchQuery.query.bool.must.push({
              terms: { "status.keyword": value },
            });
          } else if (Array.isArray(value)) {
            searchQuery.query.bool.must.push({
              terms: { [key]: value },
            });
          } else if (typeof value === "object" && value !== null) {
            searchQuery.query.bool.must.push({
              range: { [key]: value },
            });
          } else {
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
        sort: [
          { _score: { order: "desc" } },
          { postedDate: { order: "desc" } },
        ],
      });

      console.log(
        "Final Elasticsearch Query:",
        JSON.stringify(searchQuery, null, 2)
      );

      return result.hits.hits.map((hit) => ({
        _id: hit._id,
        ...(hit._source as JobInterface),
      }));
    } catch (error) {
      console.error("Error searching jobs in Elasticsearch:", error);
      throw error;
    }
  },

  // Method to sync data between MySQL and Elasticsearch
  async syncData(): Promise<void> {
    try {
      // Get all jobs from MySQL
      const mysqlJobs =
        await executeQuery<JobInterface[]>("SELECT * FROM jobs");
      const formattedJobs = mysqlJobs.map(formatDates);

      // Bulk index to Elasticsearch
      const operations = formattedJobs.flatMap((job: JobInterface) => [
        { index: { _index: INDEX, _id: job._id } },
        job,
      ]);

      if (operations.length > 0) {
        await client.bulk({
          refresh: true,
          operations,
        });
      }

      console.log(
        `Synced ${formattedJobs.length} jobs from MySQL to Elasticsearch`
      );
    } catch (error) {
      console.error("Error syncing data:", error);
      throw error;
    }
  },
  async createApplication(
    application: ApplicationInterface
  ): Promise<ApplicationInterface> {
    try {
      const result = await client.update({
        index: INDEX,
        id: application.jobId,
        body: {
          script: {
            source:
              "if (ctx._source.candidateIds == null) { ctx._source.candidateIds = [] } ctx._source.candidateIds.add(params.candidateId)",
            params: {
              candidateId: application.candidateId,
            },
          },
        },
      });
      await addToSyncQueue(
        "insert",
        "application",
        application.candidateId,
        "Job application created"
      );
      return application;
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  },
};

export default jobService;
