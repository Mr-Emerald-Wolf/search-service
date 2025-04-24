import { v4 as uuidv4 } from "uuid"
import pool from "./mysql"

export type QueueOperation = "insert" | "update" | "delete"
export type EntityType = "candidate" | "job" | "application"
export type QueueStatus = "pending" | "processing" | "completed" | "failed"

export interface QueueEvent {
  id: string
  operation: QueueOperation
  entityType: EntityType
  entityId: string
  status: QueueStatus
  timestamp: Date
  details?: string
}

// Add an event to the queue
export async function addToQueue(
  operation: QueueOperation,
  entityType: EntityType,
  entityId: string,
  details?: string,
): Promise<QueueEvent> {
  const id = uuidv4()
  const timestamp = new Date()
  const status: QueueStatus = "pending"

  const queueEvent: QueueEvent = {
    id,
    operation,
    entityType,
    entityId,
    status,
    timestamp,
    details,
  }

  // Insert into MySQL
  await pool.query(
    `INSERT INTO queue_events 
     (id, operation, entity_type, entity_id, status, timestamp, details) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, operation, entityType, entityId, status, timestamp, details],
  )

  return queueEvent
}

// Get all queue events
export async function getQueueEvents(): Promise<QueueEvent[]> {
  const [rows] = await pool.query<any[]>(
    `SELECT id, operation, entity_type as entityType, entity_id as entityId, 
     status, timestamp, details 
     FROM queue_events 
     ORDER BY timestamp DESC 
     LIMIT 100`,
  )

  return rows.map((row) => ({
    ...row,
    timestamp: new Date(row.timestamp),
  }))
}

// Update queue event status
export async function updateQueueStatus(id: string, status: QueueStatus, details?: string): Promise<void> {
  await pool.query(
    `UPDATE queue_events 
     SET status = ?, details = ? 
     WHERE id = ?`,
    [status, details, id],
  )
}

// Process queue events (simulate processing)
export async function processQueueEvents(): Promise<void> {
  // Get pending events
  const [rows] = await pool.query<any[]>(
    `SELECT id FROM queue_events 
     WHERE status = 'pending' 
     ORDER BY timestamp ASC 
     LIMIT 10`,
  )

  // Process each event
  for (const row of rows) {
    // Update status to processing
    await updateQueueStatus(row.id, "processing")

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mark as completed
      await updateQueueStatus(row.id, "completed")
    } catch (error) {
      // Mark as failed
      await updateQueueStatus(row.id, "failed", error.message)
    }
  }
}
