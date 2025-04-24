export interface CandidateInterface {
    _id?: string; 
    name: string;
    email: string;
    mobile: string;
    gender?: 'Male' | 'Female' | 'Other';
    dateOfBirth?: Date;
    fathersName?: string;
    age?: number;
    address?: string;
    hiringProgram?: string;
    secondaryNumber?: string;
    industry?: string;
    functionalArea?: string;
    currentOrganization?: string;
    currentDesignation?: string;
    preferredLocation?: string;
    currentLocation?: string;
    nationality?: string;
    noticePeriod?: string;
    relocate?: boolean;
    lookingForRemoteWork?: boolean;
    maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    primarySource?: string;
    secondarySource?: string;
    skills?: string[];
    language?: string[];
    certificates?: string[];
    createdAt?: Date; 
    updatedAt?: Date; 
  }
  