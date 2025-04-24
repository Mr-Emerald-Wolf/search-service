import { CandidateSearch } from "@/components/shared/candidate-search"

export default function SearchCandidatesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Candidates</h1>
        <p className="text-muted-foreground mt-2">Find candidates based on name, skills, location, and more</p>
      </div>

      <CandidateSearch />
    </div>
  )
}
