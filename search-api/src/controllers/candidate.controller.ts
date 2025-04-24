import { Request, Response, NextFunction } from "express";
import { CandidateInterface } from "../interfaces";
import candidateService from "../services/candidate.service";

class CandidateController {
  createCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateData: CandidateInterface = req.body;
      const createdCandidate = await candidateService.createCandidate(candidateData);
      res.status(201).json({
        success: true,
        data: createdCandidate,
      });
    } catch (error) {
      next(error);
    }
  };

  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await candidateService.getCandidates();
      res.status(200).json({
        success: true,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  };

  getCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const candidate = await candidateService.getCandidate(id);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }
      res.status(200).json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const candidateData: Partial<CandidateInterface> = req.body;
      const updatedCandidate = await candidateService.updateCandidate(id, candidateData);
      if (!updatedCandidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }
      res.status(200).json({
        success: true,
        data: updatedCandidate,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await candidateService.deleteCandidate(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Candidate deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  searchCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, filters } = req.query;
      const parsedFilters = filters ? JSON.parse(filters as string) : undefined;
      const candidates = await candidateService.searchCandidates(query as string, parsedFilters);
      res.status(200).json({
        success: true,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  };

  initializeWithMockData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mockCandidates } = req.body;
      await candidateService.initializeWithMockData(mockCandidates);
      res.status(200).json({
        success: true,
        message: "Mock data initialized successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  syncData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await candidateService.syncData();
      res.status(200).json({
        success: true,
        message: "Data synchronized successfully between MySQL and Elasticsearch",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CandidateController();
