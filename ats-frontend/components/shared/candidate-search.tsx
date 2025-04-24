"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X } from "lucide-react"
import type { CandidateInterface } from "@/lib/interfaces"
import { searchCandidates } from "@/lib/api"
import { CandidateCard } from "./candidate-card"
import { Badge } from "@/components/ui/badge"
import Select from "react-select"
import { mockSkills, mockLocations } from "@/lib/mock-data"

type FilterType = {
  skills: string[]
  currentLocation: string[]
  relocate?: boolean
  remoteWork?: boolean
}

export function CandidateSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [candidates, setCandidates] = useState<CandidateInterface[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterType>({
    skills: [],
    currentLocation: [],
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const skillOptions = mockSkills.map((skill) => ({ value: skill, label: skill }))
  const locationOptions = mockLocations.map((location) => ({ value: location, label: location }))

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const results = await searchCandidates(debouncedSearchTerm, filters)
      setCandidates(results)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm, filters])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  useEffect(() => {
    // Count active filters
    let count = 0
    if (filters.skills.length > 0) count++
    if (filters.currentLocation.length > 0) count++
    if (filters.relocate !== undefined) count++
    if (filters.remoteWork !== undefined) count++
    setActiveFiltersCount(count)
  }, [filters])

  const resetFilters = () => {
    setFilters({
      skills: [],
      currentLocation: [],
      relocate: undefined,
      remoteWork: undefined,
    })
  }

  return (
    <div>
      <div className="sticky top-16 z-30 mb-4 bg-background pb-4 pt-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search candidates by name, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            {searchTerm && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Candidates</SheetTitle>
                <SheetDescription>Narrow down candidates based on specific criteria</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Skills</h3>
                  <Select
                    instanceId="filter-skills-select"
                    isMulti
                    value={filters.skills.map((skill) => ({ value: skill, label: skill }))}
                    onChange={(options) =>
                      setFilters({
                        ...filters,
                        skills: options.map((option) => option.value),
                      })
                    }
                    options={skillOptions}
                    placeholder="Select skills"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Locations</h3>
                  <Select
                    instanceId="filter-locations-select"
                    isMulti
                    value={filters.currentLocation.map((location) => ({ value: location, label: location }))}
                    onChange={(options) =>
                      setFilters({
                        ...filters,
                        currentLocation: options.map((option) => option.value),
                      })
                    }
                    options={locationOptions}
                    placeholder="Select locations"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="relocate"
                        checked={filters.relocate}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            relocate: checked === true ? true : undefined,
                          })
                        }
                      />
                      <label htmlFor="relocate" className="text-sm">
                        Willing to relocate
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remote"
                        checked={filters.remoteWork}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            remoteWork: checked === true ? true : undefined,
                          })
                        }
                      />
                      <label htmlFor="remote" className="text-sm">
                        Looking for remote work
                      </label>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.skills.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Skills: {filters.skills.length}
                <button onClick={() => setFilters({ ...filters, skills: [] })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.currentLocation.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Locations: {filters.currentLocation.length}
                <button onClick={() => setFilters({ ...filters, currentLocation: [] })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.relocate !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Relocate: {filters.relocate ? "Yes" : "No"}
                <button onClick={() => setFilters({ ...filters, relocate: undefined })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.remoteWork !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Remote: {filters.remoteWork ? "Yes" : "No"}
                <button onClick={() => setFilters({ ...filters, remoteWork: undefined })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground">
              Clear all
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-pulse text-center">
            <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading results...</p>
          </div>
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate._id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No candidates found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
