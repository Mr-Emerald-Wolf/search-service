import { JobSearch } from "@/components/shared/job-search"

export default function SearchJobsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Jobs</h1>
        <p className="text-muted-foreground mt-2">Find jobs based on title, skills, department, location, and more</p>
      </div>

      <JobSearch />
    </div>
  )
}
