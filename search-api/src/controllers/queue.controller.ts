import { Request, Response, NextFunction } from "express";
import { QueueItem } from "../interfaces";
import {  getQueueItems } from "../services/queue.service";


// Controller to get all QueueItems
export const getQueueItemsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queueItems = await getQueueItems();
    res.status(200).json({
      success: true,
      data: queueItems,
    });
  } catch (error) {
    next(error);
  }
};
