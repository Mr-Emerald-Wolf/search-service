import { ApplicationForm } from "@/components/shared/application-form"

export default function AddApplicationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Application</h1>
        <p className="text-muted-foreground mt-2">Link a candidate to a job posting</p>
      </div>

      <ApplicationForm />
    </div>
  )
}
