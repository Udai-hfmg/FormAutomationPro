// ─────────────────────────────────────────────
// hipaa-family-member.dto.ts
// ─────────────────────────────────────────────

export interface HipaaFamilyMemberDto {
  hipaaFamilyMemberId?: number;
  signedDocumentId: number;
  familyMemberName: string;
  relationship: string;
  isRepresentative?: boolean; // Optional field to indicate if this family member is a representative
}

export type CreateHipaaFamilyMemberDto = Omit<HipaaFamilyMemberDto, "hipaaFamilyMemberId">;

export type UpdateHipaaFamilyMemberDto = Partial<CreateHipaaFamilyMemberDto> & { hipaaFamilyMemberId: number };

export const defaultHipaaFamilyMember: CreateHipaaFamilyMemberDto = {

  signedDocumentId: 0,
  familyMemberName: "",
  relationship: "",
  isRepresentative: false
};
