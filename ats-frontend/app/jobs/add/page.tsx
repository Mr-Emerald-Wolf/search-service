import { JobForm } from "@/components/shared/job-form"

export default function AddJobPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Job</h1>
        <p className="text-muted-foreground mt-2">Create a new job posting with complete details</p>
      </div>

      <JobForm />
    </div>
  )
}
