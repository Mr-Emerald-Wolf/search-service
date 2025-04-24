import { Request, Response, NextFunction } from "express";
import { JobInterface } from "../interfaces";
import jobService from "../services/jobs.service";

class JobController {
  createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobData: JobInterface = req.body;
      const createdJob = await jobService.createJob(jobData);
      res.status(201).json({
        success: true,
        data: createdJob,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await jobService.getJobs();
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  };

  getJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const job = await jobService.getJob(id);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }
      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const jobData: Partial<JobInterface> = req.body;
      const updatedJob = await jobService.updateJob(id, jobData);
      if (!updatedJob) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }
      res.status(200).json({
        success: true,
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await jobService.deleteJob(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  searchJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, filters } = req.query;
      const parsedFilters = filters ? JSON.parse(filters as string) : undefined;
      const jobs = await jobService.searchJobs(query as string, parsedFilters);
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new JobController();
