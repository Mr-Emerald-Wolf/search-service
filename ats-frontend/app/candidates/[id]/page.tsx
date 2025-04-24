"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  ArrowLeft,
  Briefcase,
  Globe,
  Languages,
  Award,
} from "lucide-react"
import { getCandidate } from "@/lib/api"
import type { CandidateInterface } from "@/lib/interfaces"

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [candidate, setCandidate] = useState<CandidateInterface | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCandidate() {
      if (!params.id) {
        router.push("/candidates/search")
        return
      }

      try {
        const data = await getCandidate(params.id as string)
        if (data) {
          setCandidate(data)
        } else {
          router.push("/candidates/search")
        }
      } catch (error) {
        console.error("Error loading candidate:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCandidate()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center my-8">
          <div className="animate-pulse text-center">
            <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading candidate details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Candidate not found</h3>
          <p className="text-muted-foreground mt-1">The candidate you're looking for doesn't exist</p>
          <Button onClick={() => router.push("/candidates/search")} className="mt-4">
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
              <CardTitle className="text-2xl">{candidate.name}</CardTitle>
              <p className="text-muted-foreground">{candidate.currentDesignation || "No designation"}</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MailIcon className="mr-2 h-4 w-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    <span>{candidate.mobile}</span>
                  </div>
                  {candidate.currentLocation && (
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="mr-2 h-4 w-4" />
                      <span>{candidate.currentLocation}</span>
                    </div>
                  )}
                  {candidate.preferredLocation && (
                    <div className="flex items-center text-sm">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>Preferred: {candidate.preferredLocation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {candidate.industry && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Industry: {candidate.industry}</span>
                    </div>
                  )}
                  {candidate.functionalArea && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Functional Area: {candidate.functionalArea}</span>
                    </div>
                  )}
                  {candidate.currentOrganization && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Current Organization: {candidate.currentOrganization}</span>
                    </div>
                  )}
                  {candidate.noticePeriod && (
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Notice Period: {candidate.noticePeriod}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Badge variant={candidate.relocate ? "default" : "outline"} className="mr-2">
                      {candidate.relocate ? "Will Relocate" : "Won't Relocate"}
                    </Badge>
                    <Badge variant={candidate.lookingForRemoteWork ? "default" : "outline"}>
                      {candidate.lookingForRemoteWork ? "Remote OK" : "No Remote"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Skills & Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.skills && candidate.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {candidate.language && candidate.language.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Languages className="mr-2 h-4 w-4" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.language.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {candidate.certificates && candidate.certificates.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Certificates
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.certificates.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {candidate.gender && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <span className="text-sm">{candidate.gender}</span>
                  </div>
                )}
                {candidate.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date of Birth</span>
                    <span className="text-sm">{new Date(candidate.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {candidate.age && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Age</span>
                    <span className="text-sm">{candidate.age} years</span>
                  </div>
                )}
                {candidate.nationality && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nationality</span>
                    <span className="text-sm">{candidate.nationality}</span>
                  </div>
                )}
                {candidate.maritalStatus && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Marital Status</span>
                    <span className="text-sm">{candidate.maritalStatus}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {candidate.primarySource && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Primary Source</span>
                    <span className="text-sm">{candidate.primarySource}</span>
                  </div>
                )}
                {candidate.secondarySource && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Secondary Source</span>
                    <span className="text-sm">{candidate.secondarySource}</span>
                  </div>
                )}
                {candidate.hiringProgram && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Hiring Program</span>
                    <span className="text-sm">{candidate.hiringProgram}</span>
                  </div>
                )}
                {candidate.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Added On</span>
                    <span className="text-sm">{new Date(candidate.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
