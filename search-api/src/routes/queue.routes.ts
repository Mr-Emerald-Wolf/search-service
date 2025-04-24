import { Router } from "express";
import {  getQueueItemsList } from "../controllers/queue.controller";

const router = Router();


// Route to get all QueueItems
router.get("/", getQueueItemsList);

export default router;
