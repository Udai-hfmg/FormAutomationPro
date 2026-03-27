// ─────────────────────────────────────────────
// emergency-contact.dto.ts
// ─────────────────────────────────────────────

export interface EmergencyContactDto {
  emergencyContactId?: number;
  patientId: number;
  contactName: string;
  relationship: string;
  phone: string;
  isPrimary: number;            // 0 or 1 — matches int in backend
  createdAt?: string;           // Readonly — set by backend
}

export type CreateEmergencyContactDto = Omit<EmergencyContactDto, "emergencyContactId" | "createdAt">;

export type UpdateEmergencyContactDto = Partial<CreateEmergencyContactDto> & { emergencyContactId: number };

export const defaultEmergencyContact: CreateEmergencyContactDto = {
  patientId: 0,
  contactName: "",
  relationship: "",
  phone: "",
  isPrimary: 0,
};
