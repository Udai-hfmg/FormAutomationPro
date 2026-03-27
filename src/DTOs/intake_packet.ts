// ─────────────────────────────────────────────
// intake-packet.dto.ts
// ─────────────────────────────────────────────

export interface IntakePacketDto {
  intakePacketId?: number;
  patientId: number;
  packedDate: string;           // ISO string "YYYY-MM-DD"
  locationName: string;
  officeId: number;
  createdAt?: string;           // Readonly — set by backend
}

export type CreateIntakePacketDto = Omit<IntakePacketDto, "intakePacketId" | "createdAt">;

export type UpdateIntakePacketDto = Partial<CreateIntakePacketDto> & { intakePacketId: number };

export const defaultIntakePacket: CreateIntakePacketDto = {
  patientId: 0,
  packedDate: "",
  locationName: "",
  officeId: 0,
};