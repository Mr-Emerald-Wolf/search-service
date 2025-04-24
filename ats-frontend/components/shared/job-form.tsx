"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import type { JobInterface } from "@/lib/interfaces"
import { mockSkills, mockLocations, mockDepartments, mockEmploymentTypes, mockJobStatuses } from "@/lib/mock-data"
import { createJob, updateJob } from "@/lib/api"

const formSchema = z
  .object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    department: z.string().min(1, { message: "Department is required." }),
    location: z.string().min(1, { message: "Location is required." }),
    employmentType: z.string().min(1, { message: "Employment type is required." }),
    salaryMin: z.number().min(0, { message: "Minimum salary must be a positive number." }),
    salaryMax: z.number().min(0, { message: "Maximum salary must be a positive number." }),
    skillsRequired: z.array(z.string()).min(1, { message: "At least one skill is required." }),
    postedDate: z.date(),
    closingDate: z.date().min(new Date(), { message: "Closing date must be in the future." }),
    status: z.string().min(1, { message: "Status is required." }),
  })
  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"],
  })

interface JobFormProps {
  initialData?: JobInterface
  isEditMode?: boolean
}

export function JobForm({ initialData, isEditMode = false }: JobFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const skillOptions = mockSkills.map((skill) => ({ value: skill, label: skill }))
  const locationOptions = mockLocations.map((loc) => ({ value: loc, label: loc }))
  const departmentOptions = mockDepartments.map((dept) => ({ value: dept, label: dept }))
  const employmentTypeOptions = mockEmploymentTypes.map((type) => ({ value: type, label: type }))
  const statusOptions = mockJobStatuses.map((status) => ({ value: status, label: status }))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      department: initialData?.department || "",
      location: initialData?.location || "",
      employmentType: initialData?.employmentType || "",
      salaryMin: initialData?.salaryMin || 0,
      salaryMax: initialData?.salaryMax || 0,
      skillsRequired: initialData?.skillsRequired || [],
      postedDate: initialData?.postedDate || new Date(),
      closingDate: initialData?.closingDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: initialData?.status || "Open",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if (isEditMode && initialData?._id) {
        await updateJob(initialData._id, values)
      } else {
        await createJob(values as JobInterface)
      }
      router.push("/jobs/search")
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
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department*</FormLabel>
                  <Select
                    instanceId="department-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value)}
                    options={departmentOptions}
                    placeholder="Select department"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Job Description*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter detailed job description" className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location*</FormLabel>
                  <Select
                    instanceId="location-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value)}
                    options={locationOptions}
                    placeholder="Select location"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type*</FormLabel>
                  <Select
                    instanceId="employment-type-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value)}
                    options={employmentTypeOptions}
                    placeholder="Select employment type"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Compensation & Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 50000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Salary*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 80000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillsRequired"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Required Skills*</FormLabel>
                  <Select
                    instanceId="skills-select"
                    isMulti
                    value={field.value?.map((skill) => ({ value: skill, label: skill })) || []}
                    onChange={(options) => field.onChange(options.map((option) => option.value))}
                    options={skillOptions}
                    placeholder="Select required skills"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Dates & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="postedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Posted Date*</FormLabel>
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
              name="closingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Closing Date*</FormLabel>
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
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status*</FormLabel>
                  <Select
                    instanceId="status-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value)}
                    options={statusOptions}
                    placeholder="Select status"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
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
            {isEditMode ? "Update Job" : "Add Job"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
