import { QueueItem } from "../interfaces";
import { getQueueItems as fetchQueueItems } from "../utils/helper"; // Import the helper function


// Function to get all QueueItems with optional status filter
export const getQueueItems = async (
  status?: "pending" | "processing" | "completed" | "failed",
  limit: number = 100
): Promise<QueueItem[]> => {
  return fetchQueueItems(status, limit); // Use the imported function from the helper
};
