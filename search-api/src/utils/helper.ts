// src/utils/queueHelper.ts
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../client/mysql.client';
import { QueueItem } from '../interfaces';

export async function addToSyncQueue(
  operation: 'insert' | 'update' | 'delete',
  entityType: 'candidate' | 'job' | 'application',
  entityId: string,
  details?: string
): Promise<QueueItem> {
  const id = uuidv4();
  const timestamp = new Date();
  
  const queueItem: QueueItem = {
    operation,
    entityType,
    entityId,
    status: 'pending',
    timestamp,
    details
  };
  
  await executeQuery(
    `INSERT INTO sync_queue ( operation, entityType, entityId, status, timestamp, details) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [ operation, entityType, entityId, 'pending', timestamp, details || null]
  );
  
  return queueItem;
}

export async function updateQueueItemStatus(
  id: string, 
  status: 'pending' | 'processing' | 'completed' | 'failed',
  details?: string
): Promise<void> {
  await executeQuery(
    `UPDATE sync_queue SET status = ?, details = ? WHERE id = ?`,
    [status, details || null, id]
  );
}

export async function getQueueItems(
  status?: 'pending' | 'processing' | 'completed' | 'failed',
  limit: number = 100
): Promise<QueueItem[]> {
  const query = status 
    ? `SELECT * FROM sync_queue WHERE status = ? ORDER BY timestamp ASC LIMIT ?`
    : `SELECT * FROM sync_queue ORDER BY timestamp ASC`;
  
  const params = status ? [status, limit] : [limit];
  
  return executeQuery<QueueItem[]>(query, params);
}
