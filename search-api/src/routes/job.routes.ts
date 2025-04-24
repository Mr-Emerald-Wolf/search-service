import express, { RequestHandler } from "express";
import JobController from "../controllers/job.controller";

const router = express.Router();

// Route to create a new job
router.post("/", JobController.createJob);

// Route to get all jobs
router.get("/", JobController.getJobs);

// Route to search jobs with query and filters
router.get("/search", JobController.searchJobs);

// Route to get a specific job by id
router.get("/:id", JobController.getJob as RequestHandler);

// Route to update a specific job by id
router.put("/:id", JobController.updateJob as RequestHandler);

// Route to delete a specific job by id
router.delete("/:id", JobController.deleteJob as RequestHandler);


export default router;
