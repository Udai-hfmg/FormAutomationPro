// ─────────────────────────────────────────────
// patient-demographic.dto.ts
// ─────────────────────────────────────────────

export interface PatientDemographicDto {
  patientId: number;            // PK + FK — always required
  language?: string;
  race?: string;
  ethnicity?: string;
  updatedAt?: string | null;           // Readonly — set by backend
}

// Only editable fields for form
export type UpdatePatientDemographicDto = Omit<PatientDemographicDto, "updatedAt">;

export const defaultPatientDemographic: UpdatePatientDemographicDto = {
  patientId: 0,
  language: "",
  race: "",
  ethnicity: "",
};


// ─────────────────────────────────────────────
// patient-employment.dto.ts
// ─────────────────────────────────────────────

export interface PatientEmploymentDto {
  patientEmploymentId?: number;
  patientId: number;
  employerName?: string;
  occupation?: string;
  employerAddress?: string;
  createdAt?: null;           // Readonly — set by backend
}

export type CreatePatientEmploymentDto = Omit<PatientEmploymentDto, "patientEmploymentId" | "createdAt">;

export type UpdatePatientEmploymentDto = Partial<CreatePatientEmploymentDto> & { patientEmploymentId: number };

export const defaultPatientEmployment: CreatePatientEmploymentDto = {
  patientId: 0,
  employerName: "",
  occupation: "",
  employerAddress: "",
};


// ─────────────────────────────────────────────
// patient-insurance.dto.ts
// ─────────────────────────────────────────────

export interface PatientInsuranceDto {
  patientInsuranceId?: number;
  patientId: number;
  insurancePlanId?: number;
  coverageType: string;         // Required — e.g. "Primary", "Secondary"
  memberId?: string;
  groupNumber?: string;
  subscriberName?: string;
  subscriberDOB?: string |  null;       // ISO date string "YYYY-MM-DD"
  relationshipToPatient?: string;
  isActive?: boolean;           // default true
  createdAt?: string | null;           // Readonly — set by backend
}

export type CreatePatientInsuranceDto = Omit<PatientInsuranceDto, "patientInsuranceId" | "createdAt">;

export type UpdatePatientInsuranceDto = Partial<CreatePatientInsuranceDto> & { patientInsuranceId: number };

export const defaultPatientInsurance: CreatePatientInsuranceDto = {
  patientId: 0,
  insurancePlanId: undefined,
  coverageType: "",
  memberId: "",
  groupNumber: "",
  subscriberName: "",
  subscriberDOB: null,
  relationshipToPatient: "",
  isActive: true,
};