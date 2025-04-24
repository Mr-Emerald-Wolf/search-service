import { CalendarIcon, MapPinIcon, BriefcaseIcon, DollarSignIcon, UserIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { JobInterface } from "@/lib/interfaces"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface JobCardProps {
  job: JobInterface
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="flex flex-col gap-1">
            <span className="text-lg">{job.title}</span>
            <span className="text-sm font-normal text-muted-foreground">{job.department}</span>
          </CardTitle>
          <Badge variant={job.status === "Open" ? "default" : "secondary"}>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-0">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="mr-2 h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSignIcon className="mr-2 h-4 w-4" />
              <span>
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
              </span>
            </div>
            {job.candidateIds && job.candidateIds.length > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>
                  {job.candidateIds.length} applicant{job.candidateIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skillsRequired && job.skillsRequired.length > 0 ? (
                job.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No skills listed</span>
              )}
            </div>
          </div>

          <div className="line-clamp-3 text-sm">{job.description}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 pb-4">
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span>
            Posted: {new Date(job.postedDate).toLocaleDateString()} | Closes:{" "}
            {new Date(job.closingDate).toLocaleDateString()}
          </span>
        </div>
        <Link href={`/jobs/${job._id || "#"}`} passHref>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
