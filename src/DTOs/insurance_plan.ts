// ─────────────────────────────────────────────
// insurance-plan.dto.ts
// ─────────────────────────────────────────────

export interface InsurancePlanDto {
  insurancePlanId?: number;
  planName: string;
  payerName: string;
  notes?: string;
}

export type CreateInsurancePlanDto = Omit<InsurancePlanDto, "insurancePlanId">;

export type UpdateInsurancePlanDto = Partial<CreateInsurancePlanDto> & { insurancePlanId: number };

export const defaultInsurancePlan: CreateInsurancePlanDto = {
  planName: "",
  payerName: "",
  notes: "",
};