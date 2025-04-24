import { CalendarIcon, MapPinIcon, MailIcon, PhoneIcon, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CandidateInterface } from "@/lib/interfaces"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CandidateCardProps {
  candidate: CandidateInterface
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted pb-4">
        <CardTitle className="flex flex-col gap-1">
          <span className="text-lg">{candidate.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {candidate.currentDesignation
              ? `${candidate.currentDesignation}${candidate.currentOrganization ? ` at ${candidate.currentOrganization}` : ""}`
              : "No designation"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-0">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <MailIcon className="mr-2 h-4 w-4" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <PhoneIcon className="mr-2 h-4 w-4" />
              <span>{candidate.mobile}</span>
            </div>
            {candidate.currentLocation && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span>{candidate.currentLocation}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No skills listed</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Preferences</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                {candidate.relocate ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                )}
                <span>Relocate</span>
              </div>
              <div className="flex items-center gap-1">
                {candidate.lookingForRemoteWork ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                )}
                <span>Remote Work</span>
              </div>
              {candidate.preferredLocation && (
                <div className="flex items-center gap-1 col-span-2">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  <span>Prefers: {candidate.preferredLocation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 pb-4">
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {candidate.createdAt ? (
            <span>Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
          ) : (
            <span>No date</span>
          )}
        </div>
        <Link href={`/candidates/${candidate._id || "#"}`} passHref>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
