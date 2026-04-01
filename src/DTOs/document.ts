// ─────────────────────────────────────────────
// signed-document.dto.ts
// ─────────────────────────────────────────────

export interface SignedDocumentDto {
  signedDocumentId?: number;
  intakePacketId: number;
  documentTypeId: number;
  signedByName?: string;
  signedByRole?: string;
  RepresentativeAuthority?: string;
  signedAt?: string | undefined;            // ISO datetime string
  signatureCaptured?: boolean;  // default false
  notes?: string;
  documentVersionId?: number;
}

export type CreateSignedDocumentDto = Omit<SignedDocumentDto, "signedDocumentId">;

export type UpdateSignedDocumentDto = Partial<CreateSignedDocumentDto> & { signedDocumentId: number };

export const defaultSignedDocument: CreateSignedDocumentDto = {
  intakePacketId: 0,
  documentTypeId: 0,
  signedByName: "",
  signedByRole: "",
  RepresentativeAuthority: "",
  signedAt: string,
  signatureCaptured: false,
  notes: "",
  documentVersionId: undefined,
};


// ─────────────────────────────────────────────
// signed-document-response.dto.ts
// ─────────────────────────────────────────────

export type ResponseType = "bool" | "text" | "date" | "choice";

export interface SignedDocumentResponseDto {
  responseId?: number;
  signedDocumentId: number;
  questionCode: string;         // Required — e.g. "CONSENT_HIPAA", "ALLERGIES_YN"
  responseType: ResponseType;   // Required — drives which value field to use
  boolValue?: boolean;          // Used when responseType === "bool"
  textValue?: string;           // Used when responseType === "text"
  dateValue?: string;           // ISO date "YYYY-MM-DD", when responseType === "date"
  choiceValue?: string;         // Used when responseType === "choice"
}

export type CreateSignedDocumentResponseDto = Omit<SignedDocumentResponseDto, "responseId">;

export type UpdateSignedDocumentResponseDto = Partial<CreateSignedDocumentResponseDto> & { responseId: number };

export const defaultSignedDocumentResponse: CreateSignedDocumentResponseDto = {
  signedDocumentId: 0,
  questionCode: "",
  responseType: "text",
  boolValue: undefined,
  textValue: "",
  dateValue: "",
  choiceValue: "",
};


// ─────────────────────────────────────────────
// unable-to-obtain-signature.dto.ts
// ─────────────────────────────────────────────

export interface UnableToObtainSignatureDto {
  unableId?: number;
  signedDocumentId: number;
  attemptDate?: string;         // ISO date "YYYY-MM-DD"
  reason?: string;
  staffInitials?: string;
}

export type CreateUnableToObtainSignatureDto = Omit<UnableToObtainSignatureDto, "unableId">;

export type UpdateUnableToObtainSignatureDto = Partial<CreateUnableToObtainSignatureDto> & { unableId: number };

export const defaultUnableToObtainSignature: CreateUnableToObtainSignatureDto = {
  signedDocumentId: 0,
  attemptDate: "",
  reason: "",
  staffInitials: "",
};