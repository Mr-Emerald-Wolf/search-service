"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowRight, Check, Database, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { triggerMigration } from "@/lib/api"

export default function MigrationPage() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleMigration = async () => {
    setIsMigrating(true)
    try {
      const response = await triggerMigration()
      setResult(response)
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        message: "Error initiating migration. Please try again later.",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">MySQL to Elasticsearch Migration</h1>
        <p className="text-muted-foreground mt-2">Trigger data migration from MySQL database to Elasticsearch</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Migration Tool
            </CardTitle>
            <CardDescription>This tool will initiate data migration from MySQL to Elasticsearch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>When you trigger the migration, the following will occur:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All candidates will be migrated to the Elasticsearch index</li>
                <li>All jobs will be migrated to the Elasticsearch index</li>
                <li>All applications will be migrated to the Elasticsearch index</li>
                <li>Relationships between entities will be preserved</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Note: This operation may take some time depending on the amount of data.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleMigration} disabled={isMigrating} className="w-full">
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating Data...
                </>
              ) : (
                <>
                  Start Migration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Migration Initiated" : "Migration Failed"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Migration Process</CardTitle>
              <CardDescription>How data is transferred and indexed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <div className="flex-shrink-0 rounded-full w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Extract Data</h3>
                    <p className="text-sm text-muted-foreground">Data is read from MySQL database</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <div className="flex-shrink-0 rounded-full w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Transform</h3>
                    <p className="text-sm text-muted-foreground">Data is formatted for Elasticsearch</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <div className="flex-shrink-0 rounded-full w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Queue Operations</h3>
                    <p className="text-sm text-muted-foreground">Index operations are added to RabbitMQ</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-md bg-muted">
                  <div className="flex-shrink-0 rounded-full w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Index Data</h3>
                    <p className="text-sm text-muted-foreground">Workers consume queue and index data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
