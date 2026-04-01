export interface PatientProviderDto {
  patientProviderId?: number;
  patientId: number;
  providerName: string;
  providerType: string;
  notes?: string;
  createdAt?: string;
}

export type CreatePatientProviderDto = Omit<
  PatientProviderDto,
  "patientProviderId"
>;

export type UpdatePatientProviderDto = Partial<CreatePatientProviderDto> & {
  patientProviderId: number;
};

export const defaultPatientProvider: CreatePatientProviderDto = {
  patientId: 0,
  providerName: "",
  providerType: "",
  notes: "",
  createdAt: new Date().toISOString()
};