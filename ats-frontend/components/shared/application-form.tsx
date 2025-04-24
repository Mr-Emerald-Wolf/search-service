"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import Select from "react-select"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import type { ApplicationInterface, CandidateInterface, JobInterface } from "@/lib/interfaces"
import { mockApplicationStatuses } from "@/lib/mock-data"
import { createApplication, getCandidates, getJobs } from "@/lib/api"

const formSchema = z.object({
  candidateId: z.string().min(1, { message: "Candidate is required." }),
  jobId: z.string().min(1, { message: "Job is required." }),
  status: z.string().optional(),
  appliedDate: z.date(),
  notes: z.string().optional(),
})

interface ApplicationFormProps {
  initialData?: ApplicationInterface
  isEditMode?: boolean
}

export function ApplicationForm({ initialData, isEditMode = false }: ApplicationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [candidates, setCandidates] = useState<CandidateInterface[]>([])
  const [jobs, setJobs] = useState<JobInterface[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [candidatesData, jobsData] = await Promise.all([getCandidates(), getJobs()])
        setCandidates(candidatesData || [])
        setJobs((jobsData || []).filter((job) => job.status === "Open"))
      } catch (error) {
        console.error("Error loading data:", error)
        setCandidates([])
        setJobs([])
      }
    }

    loadData()
  }, [])

  const candidateOptions = candidates.map((candidate) => ({
    value: candidate.id || "",
    label: `${candidate.name} (${candidate.email})`,
  }))

  const jobOptions = jobs.map((job) => ({
    value: job.id || "",
    label: `${job.title} - ${job.department} (${job.location})`,
  }))

  const statusOptions = mockApplicationStatuses.map((status) => ({
    value: status,
    label: status,
  }))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateId: initialData?.candidateId || "",
      jobId: initialData?.jobId || "",
      status: initialData?.status || "Applied",
      appliedDate: initialData?.appliedDate || new Date(),
      notes: initialData?.notes || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await createApplication(values as ApplicationInterface)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Application Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="candidateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate*</FormLabel>
                  <Select
                    instanceId="candidate-select"
                    value={candidateOptions.find((option) => option.value === field.value) || null}
                    onChange={(option) => field.onChange(option?.value || "")}
                    options={candidateOptions}
                    placeholder="Select candidate"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job*</FormLabel>
                  <Select
                    instanceId="job-select"
                    value={jobOptions.find((option) => option.value === field.value) || null}
                    onChange={(option) => field.onChange(option?.value || "")}
                    options={jobOptions}
                    placeholder="Select job"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    instanceId="status-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value || "")}
                    options={statusOptions}
                    placeholder="Select status"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appliedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Application Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this application"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Application" : "Add Application"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
