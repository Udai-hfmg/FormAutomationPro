import type { InsurancePlanDto } from "./insurance_plan";

export interface PatientInsuranceDto {
  patientInsuranceId?: number;
  patientId: number;

  insurancePlanId: number;

  coverageType: string;             // REQUIRED
  memberId: string;                 // REQUIRED
  groupNumber?: string;

  subscriberName?: string;
  subscriberDOB?: string | null;           // "YYYY-MM-DD"
  relationshipToPatient?: string;

  isActive: boolean;                // REQUIRED

  createdAt?: string;               // readonly

  insurancePlan?: InsurancePlanDto; // nested object (optional)
}

export type CreatePatientInsuranceDto = Omit<
  PatientInsuranceDto,
  "patientInsuranceId" | "createdAt"
>;

export type UpdatePatientInsuranceDto =
  Partial<CreatePatientInsuranceDto> & {
    patientInsuranceId: number;
  };

 export const defaultPatientInsurance: CreatePatientInsuranceDto = {
  patientId: 0,
  insurancePlanId: 1,

  coverageType: "",
  memberId: "",
  groupNumber: "",

  subscriberName: "",
  subscriberDOB: null,
  relationshipToPatient: "",

  isActive: true
}; 