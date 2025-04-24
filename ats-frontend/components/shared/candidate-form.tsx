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
import { Checkbox } from "@/components/ui/checkbox"

import type { CandidateInterface } from "@/lib/interfaces"
import { mockSkills, mockLanguages, mockLocations } from "@/lib/mock-data"
import { createCandidate, updateCandidate } from "@/lib/api"

// Import the AutoComplete and MultiAutoComplete components
import { AutoComplete } from "@/components/shared/auto-complete"
import { MultiAutoComplete } from "@/components/shared/multi-auto-complete"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z.string().min(10, { message: "Please enter a valid phone number." }),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dateOfBirth: z.date().optional(),
  fathersName: z.string().optional(),
  address: z.string().optional(),
  hiringProgram: z.string().optional(),
  secondaryNumber: z.string().optional(),
  industry: z.string().optional(),
  functionalArea: z.string().optional(),
  currentOrganization: z.string().optional(),
  currentDesignation: z.string().optional(),
  preferredLocation: z.string().optional(),
  currentLocation: z.string().optional(),
  nationality: z.string().optional(),
  noticePeriod: z.string().optional(),
  relocate: z.boolean().optional(),
  lookingForRemoteWork: z.boolean().optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]).optional(),
  primarySource: z.string().optional(),
  secondarySource: z.string().optional(),
  skills: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  certificates: z.array(z.string()).optional(),
})

interface CandidateFormProps {
  initialData?: CandidateInterface
  isEditMode?: boolean
}

export function CandidateForm({ initialData, isEditMode = false }: CandidateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const skillOptions = mockSkills.map((skill) => ({ value: skill, label: skill }))
  const languageOptions = mockLanguages.map((lang) => ({ value: lang, label: lang }))
  const locationOptions = mockLocations.map((loc) => ({ value: loc, label: loc }))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      mobile: initialData?.mobile || "",
      gender: initialData?.gender,
      dateOfBirth: initialData?.dateOfBirth,
      fathersName: initialData?.fathersName || "",
      address: initialData?.address || "",
      hiringProgram: initialData?.hiringProgram || "",
      secondaryNumber: initialData?.secondaryNumber || "",
      industry: initialData?.industry || "",
      functionalArea: initialData?.functionalArea || "",
      currentOrganization: initialData?.currentOrganization || "",
      currentDesignation: initialData?.currentDesignation || "",
      preferredLocation: initialData?.preferredLocation || "",
      currentLocation: initialData?.currentLocation || "",
      nationality: initialData?.nationality || "",
      noticePeriod: initialData?.noticePeriod || "",
      relocate: initialData?.relocate || false,
      lookingForRemoteWork: initialData?.lookingForRemoteWork || false,
      maritalStatus: initialData?.maritalStatus,
      primarySource: initialData?.primarySource || "",
      secondarySource: initialData?.secondarySource || "",
      skills: initialData?.skills || [],
      language: initialData?.language || [],
      certificates: initialData?.certificates || [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if (isEditMode && initialData?.id) {
        await updateCandidate(initialData.id, values)
      } else {
        await createCandidate(values as CandidateInterface)
      }
      router.push("/candidates/search")
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
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address*</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    instanceId="gender-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value)}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                    placeholder="Select gender"
                    isClearable
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
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
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
              name="fathersName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="currentDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="functionalArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Functional Area</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={locationOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select location"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Location</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={locationOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select location"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noticePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notice Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 30 days" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <MultiAutoComplete
                      options={skillOptions}
                      values={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select skills"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <Select
                    instanceId="language-select"
                    isMulti
                    value={field.value?.map((lang) => ({ value: lang, label: lang })) || []}
                    onChange={(options) => field.onChange(options.map((option) => option.value))}
                    options={languageOptions}
                    placeholder="Select languages"
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="relocate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Willing to Relocate</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lookingForRemoteWork"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Looking for Remote Work</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter complete address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Alternative contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. US" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select
                    instanceId="marital-status-select"
                    value={field.value ? { value: field.value, label: field.value } : null}
                    onChange={(option) => field.onChange(option?.value)}
                    options={[
                      { value: "Single", label: "Single" },
                      { value: "Married", label: "Married" },
                      { value: "Divorced", label: "Divorced" },
                    ]}
                    placeholder="Select status"
                    isClearable
                    className="w-full react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primarySource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. LinkedIn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondarySource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Referral" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hiringProgram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hiring Program</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Campus Recruitment" {...field} />
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
            {isEditMode ? "Update Candidate" : "Add Candidate"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
