"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  MapPinIcon,
  ArrowLeft,
  BriefcaseIcon,
  DollarSignIcon,
  UserIcon,
  Building2,
  Clock,
} from "lucide-react"
import { getJob, getCandidates } from "@/lib/api"
import type { JobInterface, CandidateInterface } from "@/lib/interfaces"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobInterface | null>(null)
  const [candidates, setCandidates] = useState<CandidateInterface[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJob() {
      if (!params.id) {
        router.push("/jobs/search")
        return
      }

      try {
        const data = await getJob(params.id as string)
        if (data) {
          setJob(data)

          // Load candidates attached to this job
          if (data.candidateIds && data.candidateIds.length > 0) {
            const allCandidates = await getCandidates()
            const jobCandidates = allCandidates.filter((c) => data.candidateIds?.includes(c._id || ""))
            setCandidates(jobCandidates)
          }
        } else {
          router.push("/jobs/search")
        }
      } catch (error) {
        console.error("Error loading job:", error)
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center my-8">
          <div className="animate-pulse text-center">
            <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Job not found</h3>
          <p className="text-muted-foreground mt-1">The job you're looking for doesn't exist</p>
          <Button onClick={() => router.push("/jobs/search")} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <p className="text-muted-foreground">{job.department}</p>
                </div>
                <Badge variant={job.status === "Open" ? "default" : "secondary"}>{job.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSignIcon className="mr-2 h-4 w-4" />
                    <span>
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Department: {job.department}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Closing: {new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Job Description</h3>
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired && job.skillsRequired.length > 0 ? (
                  job.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills specified</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                Candidates
                {job.candidateIds && (
                  <Badge variant="outline" className="ml-2">
                    {job.candidateIds.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidates.length > 0 ? (
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div key={candidate._id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {candidate.currentDesignation}
                        {candidate.currentOrganization && ` at ${candidate.currentOrganization}`}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.skills?.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills && candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto mt-2"
                        onClick={() => router.push(`/candidates/${candidate._id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No candidates have applied for this job yet</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push("/applications/add")}>
                    Add Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => router.push("/applications/add")}>
                  Add Candidate to Job
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/jobs/edit/${job._id}`)}>
                  Edit Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
