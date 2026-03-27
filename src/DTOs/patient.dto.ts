// ─────────────────────────────────────────────
// patient.dto.ts
// ─────────────────────────────────────────────

export interface PatientDto {
  patientId?: number;
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
  dateOfBirth?: string;         // ISO string "YYYY-MM-DD", backend parses to DateTime
  ssnLast4?: string;            // Only last 4 digits — never expose SSN_Encrypted
  createdAt?: string;           // Readonly — set by backend
  updatedAt?: string;           // Readonly — set by backend
}

// For CREATE forms — no id or audit fields
export type CreatePatientDto = Omit<PatientDto, "patientId" | "createdAt" | "updatedAt">;

// For UPDATE forms — id required, rest optional
export type UpdatePatientDto = Partial<CreatePatientDto> & { patientId: number };

export const defaultPatient: CreatePatientDto = {
  firstName: "",
  lastName: "",
  middleInitial: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  email: "",
  phonePrimary: "",
  phoneAlternate: "",
  sex: "",
  maritalStatus: "",
  dateOfBirth: "",
  ssnLast4: "",
};
