// dtos/patient.dto.ts

export interface PatientDto {
  patientId?: number;           // optional on create, required on update
  firstName: string;
  lastName: string;
  middleInitial?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  phonePrimary?: string;
  phoneAlternate?: string;
  sex?: string;
  maritalStatus?: string;
  dateOfBirth?: string;         // string in form, .NET parses to DateTime
  ssnLast4?: string;            // only last 4 exposed — never send full SSN
  createdAt?: string;           // readonly, set by backend
  updatedAt?: string;           // readonly, set by backend
}

// For CREATE — no id, no audit fields
export type CreatePatientDto = Omit<PatientDto, "patientId" | "createdAt" | "updatedAt">;

// For UPDATE — id required, everything else optional
export type UpdatePatientDto = Partial<CreatePatientDto> & { patientId: number };