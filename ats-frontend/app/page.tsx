import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, FileSearch, UserPlus, BriefcaseBusiness, LinkIcon, Database, ListChecks } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">ATS Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-10">Manage candidates, jobs, and applications in one place.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/candidates/add">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <UserPlus className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Add Candidate</CardTitle>
              <CardDescription>Create a new candidate profile</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add complete candidate information including skills, experience, and preferences.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/jobs/add">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <BriefcaseBusiness className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Add Job</CardTitle>
              <CardDescription>Create a new job posting</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create detailed job descriptions with requirements, salary ranges, and more.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/applications/add">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <LinkIcon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Add Application</CardTitle>
              <CardDescription>Link candidates to jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create applications by connecting candidates with appropriate job openings.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/candidates/search">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <FileSearch className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Search Candidates</CardTitle>
              <CardDescription>Find candidates by skills or location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search for candidates using filters and view detailed profiles.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/jobs/search">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Search Jobs</CardTitle>
              <CardDescription>Find jobs by criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search for jobs and view matched candidates for each position.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/migration">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <Database className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Migration Trigger</CardTitle>
              <CardDescription>Migrate data to Elasticsearch</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Trigger migration of data from MySQL to Elasticsearch.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/queue-monitor">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <ListChecks className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Indexing Queue Monitor</CardTitle>
              <CardDescription>Monitor Elasticsearch operations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View live updates of indexing operations from RabbitMQ.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
