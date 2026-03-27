// ─────────────────────────────────────────────
// office.dto.ts
// ─────────────────────────────────────────────

export interface OfficeDto {
  officeId?: number;
  officeName: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive?: boolean;           // default true
}

export type CreateOfficeDto = Omit<OfficeDto, "officeId">;

export type UpdateOfficeDto = Partial<CreateOfficeDto> & { officeId: number };

export const defaultOffice: CreateOfficeDto = {
  officeName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  isActive: true,
};


// ─────────────────────────────────────────────
// office-document-requirement.dto.ts
// ─────────────────────────────────────────────

export interface OfficeDocumentRequirementDto {
  officeId: number;
  documentTypeId: number;       // PK
  isRequired?: boolean;         // default false
  isActive?: boolean;           // default true
}

export type UpdateOfficeDocumentRequirementDto = Partial<Omit<OfficeDocumentRequirementDto, "documentTypeId">> & {
  documentTypeId: number;
};

export const defaultOfficeDocumentRequirement: OfficeDocumentRequirementDto = {
  officeId: 0,
  documentTypeId: 0,
  isRequired: false,
  isActive: true,
};