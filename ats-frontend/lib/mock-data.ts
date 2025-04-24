// Mock Skills
export const mockSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "SQL",
  "NoSQL",
  "Machine Learning",
  "Data Science",
  "Product Management",
  "Agile",
  "Scrum",
  "UX/UI Design",
  "GraphQL",
  "REST API",
  "DevOps",
  "Microservices",
]

// Mock Languages
export const mockLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Italian",
  "Dutch",
]

// Mock Locations
export const mockLocations = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "London, UK",
  "Berlin, Germany",
  "Paris, France",
  "Toronto, Canada",
  "Sydney, Australia",
  "Bangalore, India",
  "Tokyo, Japan",
  "Singapore",
  "Remote",
]

// Mock Departments
export const mockDepartments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Finance",
  "HR",
  "Operations",
  "Legal",
  "Data",
]

// Mock Employment Types
export const mockEmploymentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"]

// Mock Status Options
export const mockJobStatuses = ["Open", "Closed", "On Hold", "Draft"]

export const mockApplicationStatuses = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"]

// Random helper functions
const randomId = () => Math.random().toString(36).substring(2, 10)
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomItems = <T>(arr: T[], min = 1, max = 5): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const result: Set<T> = new Set<T>();
  while (result.size < count) {
    result.add(randomItem(arr));
  }
  return Array.from(result);
};
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const randomBool = () => Math.random() > 0.5;
const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Define interfaces
interface CandidateInterface {
  id: string;
  name: string;
  email: string;
  mobile: string;
  gender: string;
  dateOfBirth: Date;
  fathersName: string;
  age: number;
  address: string;
  hiringProgram: string;
  secondaryNumber?: string;
  industry: string;
  functionalArea: string;
  currentOrganization: string;
  currentDesignation: string;
  preferredLocation: string;
  currentLocation: string;
  nationality: string;
  noticePeriod: string;
  relocate: boolean;
  lookingForRemoteWork: boolean;
  maritalStatus: string;
  primarySource: string;
  secondarySource?: string;
  skills: string[];
  language: string[];
  certificates: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface JobInterface {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  salaryMin: number;
  salaryMax: number;
  skillsRequired: string[];
  postedDate: Date;
  closingDate: Date;
  status: string;
  candidateIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationInterface {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  appliedDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QueueItem {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  entityType: 'candidate' | 'job' | 'application';
  entityId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  details?: string;
}

// Generate mock candidates
export const mockCandidates: CandidateInterface[] = Array.from({ length: 50 }, (_, i) => {
  const id = randomId();
  const now = new Date();
  const birthDate = randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1));
  const age = now.getFullYear() - birthDate.getFullYear();
  
  return {
    id,
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@example.com`,
    mobile: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    gender: randomItem(['Male', 'Female', 'Other']),
    dateOfBirth: birthDate,
    fathersName: `Parent of Candidate ${i + 1}`,
    age,
    address: `${i + 100} Main St, ${randomItem(mockLocations)}`,
    hiringProgram: `Hiring Program ${i % 5 + 1}`,
    secondaryNumber: randomBool() ? `+1${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
    industry: randomItem(['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing']),
    functionalArea: randomItem(['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations']),
    currentOrganization: randomItem(['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Startup Inc.']),
    currentDesignation: randomItem(['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'Marketing Manager']),
    preferredLocation: randomItem(mockLocations),
    currentLocation: randomItem(mockLocations),
    nationality: randomItem(['US', 'UK', 'Canada', 'India', 'Germany', 'France', 'Australia']),
    noticePeriod: randomItem(['2 weeks', '1 month', '2 months', '3 months', 'Immediate']),
    relocate: randomBool(),
    lookingForRemoteWork: randomBool(),
    maritalStatus: randomItem(['Single', 'Married', 'Divorced', 'Widowed']),
    primarySource: randomItem(['LinkedIn', 'Indeed', 'Referral', 'Company Website', 'Job Fair']),
    secondarySource: randomBool() ? randomItem(['LinkedIn', 'Indeed', 'Referral', 'Company Website', 'Job Fair']) : undefined,
    skills: randomItems(mockSkills, 3, 8),
    language: randomItems(mockLanguages, 1, 3),
    certificates: randomBool() ? [`Certificate ${i % 5 + 1}`, `Certificate ${i % 3 + 6}`] : [],
    createdAt: randomDate(new Date(2022, 0, 1), now),
    updatedAt: randomDate(new Date(2022, 0, 1), now)
  };
});

// Generate mock jobs
export const mockJobs: JobInterface[] = Array.from({ length: 20 }, (_, i) => {
  const id = randomId();
  const now = new Date();
  const postedDate = randomDate(new Date(2022, 0, 1), now);
  const closingDate = randomDate(postedDate, new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()));
  const salaryMin = randomNumber(50000, 100000);
  
  return {
    id,
    title: `${randomItem(['Senior', 'Junior', 'Lead', 'Staff', 'Principal'])} ${randomItem(['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'Marketing Manager'])}`,
    description: `This is a job description for position ${i + 1}. We are looking for a talented professional to join our team.`,
    department: randomItem(mockDepartments),
    location: randomItem(mockLocations),
    employmentType: randomItem(mockEmploymentTypes),
    salaryMin,
    salaryMax: salaryMin + randomNumber(10000, 50000),
    skillsRequired: randomItems(mockSkills, 3, 8),
    postedDate,
    closingDate,
    status: randomItem(mockJobStatuses),
    candidateIds: [],
    createdAt: postedDate,
    updatedAt: randomDate(postedDate, now)
  };
});

// Generate mock applications
export const mockApplications: ApplicationInterface[] = Array.from({ length: 30 }, (_, i) => {
  const id = randomId();
  const candidateId = randomItem(mockCandidates).id;
  const jobId = randomItem(mockJobs).id;
  const now = new Date();
  const appliedDate = randomDate(new Date(2022, 0, 1), now);
  
  // Update the job's candidateIds list
  const job = mockJobs.find(j => j.id === jobId);
  if (job && !job.candidateIds?.includes(candidateId)) {
    job.candidateIds = [...(job.candidateIds || []), candidateId];
  }
  
  return {
    id,
    candidateId,
    jobId,
    status: randomItem(mockApplicationStatuses),
    appliedDate,
    notes: randomBool() ? `Notes for application ${i + 1}` : undefined,
    createdAt: appliedDate,
    updatedAt: randomDate(appliedDate, now)
  };
});

// Generate mock queue items
export const mockQueueItems: QueueItem[] = Array.from({ length: 15 }, (_, i) => {
  const now = new Date();
  const timestamp = randomDate(new Date(now.getTime() - 24 * 60 * 60 * 1000), now);
  const entityType = randomItem(['candidate', 'job', 'application']) as 'candidate' | 'job' | 'application';
  let entityId;
  
  switch (entityType) {
    case 'candidate':
      entityId = randomItem(mockCandidates).id!;
      break;
    case 'job':
      entityId = randomItem(mockJobs).id!;
      break;
    case 'application':
      entityId = randomItem(mockApplications).id!;
      break;
  }
  
  return {
    id: randomId(),
    operation: randomItem(['insert', 'update', 'delete']) as 'insert' | 'update' | 'delete',
    entityType,
    entityId,
    status: randomItem(['pending', 'processing', 'completed', 'failed']) as 'pending' | 'processing' | 'completed' | 'failed',
    timestamp,
    details: randomBool() ? `Details for operation ${i + 1}` : undefined
  };
});
