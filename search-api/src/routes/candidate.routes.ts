import { Router } from "express";
import candidateController from "../controllers/candidate.controller";
import type { RequestHandler } from "express";

const router = Router();

router.get("/", candidateController.getCandidates);
router.post("/", candidateController.createCandidate);
router.get("/search", candidateController.searchCandidates);
router.get("/:id", candidateController.getCandidate as RequestHandler);
router.put("/:id", candidateController.updateCandidate as RequestHandler);
router.delete("/:id", candidateController.deleteCandidate as RequestHandler);
router.post("/initialize", candidateController.initializeWithMockData);
router.post("/sync", candidateController.syncData);

export default router;