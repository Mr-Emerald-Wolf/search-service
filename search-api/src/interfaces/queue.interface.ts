export interface QueueItem {
  id?: string;
  operation: "insert" | "update" | "delete";
  entityType: "candidate" | "job" | "application";
  entityId: string;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: Date;
  details?: string;
}
