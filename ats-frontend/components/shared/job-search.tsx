"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, X } from "lucide-react"
import type { JobInterface } from "@/lib/interfaces"
import { searchJobs } from "@/lib/api"
import { JobCard } from "./job-card"
import { Badge } from "@/components/ui/badge"
import Select from "react-select"
import { mockDepartments, mockEmploymentTypes, mockLocations, mockJobStatuses } from "@/lib/mock-data"

type FilterType = {
  departments: string[]
  locations: string[]
  employmentTypes: string[]
  status: string[]
  salaryMin?: number
  salaryMax?: number
}

export function JobSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [jobs, setJobs] = useState<JobInterface[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterType>({
    departments: [],
    locations: [],
    employmentTypes: [],
    status: [],
  })
  const [salary, setSalary] = useState<[number, number]>([0, 200000])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const departmentOptions = mockDepartments.map((dept) => ({ value: dept, label: dept }))
  const locationOptions = mockLocations.map((location) => ({ value: location, label: location }))
  const employmentTypeOptions = mockEmploymentTypes.map((type) => ({ value: type, label: type }))
  const statusOptions = mockJobStatuses.map((status) => ({ value: status, label: status }))

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      // Add salary to filters only if they've been changed from default
      const searchFilters = {
        ...filters,
        ...(salary[0] > 0 && { salaryMin: salary[0] }),
        ...(salary[1] < 200000 && { salaryMax: salary[1] }),
      }

      const results = await searchJobs(debouncedSearchTerm, searchFilters)
      setJobs(results)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm, filters, salary])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  useEffect(() => {
    // Count active filters
    let count = 0
    if (filters.departments.length > 0) count++
    if (filters.locations.length > 0) count++
    if (filters.employmentTypes.length > 0) count++
    if (filters.status.length > 0) count++
    if (salary[0] > 0 || salary[1] < 200000) count++
    setActiveFiltersCount(count)
  }, [filters, salary])

  const resetFilters = () => {
    setFilters({
      departments: [],
      locations: [],
      employmentTypes: [],
      status: [],
    })
    setSalary([0, 200000])
  }

  return (
    <div>
      <div className="sticky top-16 z-30 mb-4 bg-background pb-4 pt-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search jobs by title, description, or skills..."
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
                <SheetTitle>Filter Jobs</SheetTitle>
                <SheetDescription>Narrow down jobs based on specific criteria</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Departments</h3>
                  <Select
                    instanceId="filter-departments-select"
                    isMulti
                    value={filters.departments.map((dept) => ({ value: dept, label: dept }))}
                    onChange={(options) =>
                      setFilters({
                        ...filters,
                        departments: options.map((option) => option.value),
                      })
                    }
                    options={departmentOptions}
                    placeholder="Select departments"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Locations</h3>
                  <Select
                    instanceId="filter-locations-select"
                    isMulti
                    value={filters.locations.map((location) => ({ value: location, label: location }))}
                    onChange={(options) =>
                      setFilters({
                        ...filters,
                        locations: options.map((option) => option.value),
                      })
                    }
                    options={locationOptions}
                    placeholder="Select locations"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Employment Types</h3>
                  <Select
                    instanceId="filter-employment-types-select"
                    isMulti
                    value={filters.employmentTypes.map((type) => ({ value: type, label: type }))}
                    onChange={(options) =>
                      setFilters({
                        ...filters,
                        employmentTypes: options.map((option) => option.value),
                      })
                    }
                    options={employmentTypeOptions}
                    placeholder="Select employment types"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Status</h3>
                  <Select
                    instanceId="filter-status-select"
                    isMulti
                    value={filters.status.map((status) => ({ value: status, label: status }))}
                    onChange={(options) =>
                      setFilters({
                        ...filters,
                        status: options.map((option) => option.value),
                      })
                    }
                    options={statusOptions}
                    placeholder="Select statuses"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Salary Range</h3>
                    <span className="text-sm text-muted-foreground">
                      ${salary[0].toLocaleString()} - ${salary[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={200000}
                    step={5000}
                    value={salary}
                    onValueChange={(value) => setSalary(value as [number, number])}
                    className="my-6"
                  />
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
            {filters.departments.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Departments: {filters.departments.length}
                <button onClick={() => setFilters({ ...filters, departments: [] })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.locations.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Locations: {filters.locations.length}
                <button onClick={() => setFilters({ ...filters, locations: [] })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.employmentTypes.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Employment Types: {filters.employmentTypes.length}
                <button onClick={() => setFilters({ ...filters, employmentTypes: [] })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.status.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {filters.status.length}
                <button onClick={() => setFilters({ ...filters, status: [] })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(salary[0] > 0 || salary[1] < 200000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Salary: ${salary[0].toLocaleString()} - ${salary[1].toLocaleString()}
                <button onClick={() => setSalary([0, 200000])}>
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
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
