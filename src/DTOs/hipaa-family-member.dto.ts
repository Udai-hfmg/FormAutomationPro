// ─────────────────────────────────────────────
// hipaa-family-member.dto.ts
// ─────────────────────────────────────────────

export interface HipaaFamilyMemberDto {
  hipaaFamilyMemberId?: number;
  signedDocumentId: number;
  familyMemberName: string;
  relationship: string;
}

export type CreateHipaaFamilyMemberDto = Omit<HipaaFamilyMemberDto, "hipaaFamilyMemberId">;

export type UpdateHipaaFamilyMemberDto = Partial<CreateHipaaFamilyMemberDto> & { hipaaFamilyMemberId: number };

export const defaultHipaaFamilyMember: CreateHipaaFamilyMemberDto = {
  signedDocumentId: 0,
  familyMemberName: "",
  relationship: "",
};
