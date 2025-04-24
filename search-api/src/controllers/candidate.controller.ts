// src/controllers/candidate.controller.ts
import { Request, Response, NextFunction } from "express";
import { CandidateInterface } from "../interfaces";
// import candidateService from '../services/candidate.service';

export default {
  async createCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateData: CandidateInterface = req.body;
      const createdCandidate =
        await candidateService.createCandidate(candidateData);

      res.status(201).json({
        success: true,
        data: createdCandidate,
      });
    } catch (error) {
      next(error);
    }
  },
};
