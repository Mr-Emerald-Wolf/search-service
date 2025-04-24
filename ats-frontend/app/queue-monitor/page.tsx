"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, List } from "lucide-react"
import type { QueueItem } from "@/lib/interfaces"
import { getQueueItems, subscribeToQueueUpdates } from "@/lib/api"

export default function QueueMonitorPage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: () => void

    async function loadInitialData() {
      setLoading(true)
      try {
        const items = await getQueueItems()
        setQueueItems(items)
      } catch (error) {
        console.error("Error loading queue items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()

    // Subscribe to real-time updates
    unsubscribe = subscribeToQueueUpdates((items) => {
      setQueueItems(items)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-amber-500"
      case "pending":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "insert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getEntityTypeColor = (entityType: string) => {
    switch (entityType) {
      case "candidate":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "job":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "application":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Indexing Queue Monitor</h1>
        <p className="text-muted-foreground mt-2">Monitor RabbitMQ indexing operations in real-time</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Queue Events
                </CardTitle>
                <CardDescription>Real-time updates of Elasticsearch indexing operations</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-xs text-muted-foreground">Auto-updating</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="animate-pulse text-center">
                  <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading queue data...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queueItems.length > 0 ? (
                      queueItems.map((item) => (
                        <TableRow key={item.id} className="group">
                          <TableCell className="font-mono text-xs">
                            {new Date(item.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getOperationColor(item.operation)}`}>{item.operation}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getEntityTypeColor(item.entityType)}`}>{item.entityType}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{item.entityId}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`}></div>
                              <span>{item.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.details || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No queue items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueItems.length}</div>
              <p className="text-xs text-muted-foreground">Indexing operations processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueItems.filter((item) => item.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">Waiting to be processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queueItems.filter((item) => item.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully indexed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueItems.filter((item) => item.status === "failed").length}</div>
              <p className="text-xs text-muted-foreground">Indexing errors</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
