// dtos/patient-relations.dto.ts

export interface PatientPharmacyDto {
  patientPharmacyId?: number;
  patientId: number;
  pharmacyName: string;         // Required
  location?: string;
  phone?: string;
  isPreferred?: boolean;        // default true
  createdAt?: string;           // Readonly — set by backend
}

export type CreatePatientPharmacyDto = Omit<PatientPharmacyDto, "patientPharmacyId" | "createdAt">;

export type UpdatePatientPharmacyDto = Partial<CreatePatientPharmacyDto> & { patientPharmacyId: number };

export const defaultPatientPharmacy: CreatePatientPharmacyDto = {
  patientId: 0,
  pharmacyName: "",
  location: "",
  phone: "",
  isPreferred: true,
};