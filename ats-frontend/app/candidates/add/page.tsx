import { CandidateForm } from "@/components/shared/candidate-form"

export default function AddCandidatePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Candidate</h1>
        <p className="text-muted-foreground mt-2">Create a new candidate profile with complete details</p>
      </div>

      <CandidateForm />
    </div>
  )
}
