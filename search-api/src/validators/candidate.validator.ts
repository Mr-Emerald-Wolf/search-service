import { IsEmail, IsString, IsOptional, IsBoolean, IsDate, IsInt, IsEnum, IsNotEmpty } from 'class-validator';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

export class Candidate {

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Mobile number is required' })
  mobile!: string;

  @IsEnum(Gender, { message: 'Invalid gender value' })
  @IsOptional()
  gender?: Gender;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  fathersName?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  hiringProgram?: string;

  @IsString()
  @IsOptional()
  secondaryNumber?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  functionalArea?: string;

  @IsString()
  @IsOptional()
  currentOrganization?: string;

  @IsString()
  @IsOptional()
  currentDesignation?: string;

  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @IsString()
  @IsOptional()
  currentLocation?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  noticePeriod?: string;

  @IsBoolean()
  @IsOptional()
  relocate?: boolean;

  @IsBoolean()
  @IsOptional()
  lookingForRemoteWork?: boolean;

  @IsEnum(MaritalStatus, { message: 'Invalid marital status value' })
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @IsString()
  @IsOptional()
  primarySource?: string;

  @IsString()
  @IsOptional()
  secondarySource?: string;

  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString({ each: true })
  @IsOptional()
  language?: string[];

  @IsString({ each: true })
  @IsOptional()
  certificates?: string[];
  
  constructor(partial?: Partial<Candidate>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
