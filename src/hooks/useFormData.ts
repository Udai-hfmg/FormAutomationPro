import { useEffect, useMemo, useState } from "react"
import type { PatientDemographicDto } from "../DTOs/patienDetails"
import type { HipaaFamilyMemberDto, PatientDto, PatientProviderDto } from "../DTOs"
import type { InsurancePlanDto } from "../DTOs/insurance_plan"
import type { EmergencyContactDto } from "../DTOs/emegrency"
import type { PatientPharmacyDto } from "../DTOs/patientPharmacy"
import { useLazyGetSesionDetailsQuery, usePostPatientInfoMutation, useUploadSignatureMutation } from "../redux/api/PatienSlice"
import type { PatientInsuranceDto } from "../DTOs/patienDetails"
import type { IntakePacketDto } from "../DTOs/intake_packet"
import type { PatientOfficeDto } from "../DTOs/officeDTO"
import type { SignedDocumentDto, UnableToObtainSignatureDto } from "../DTOs/document"

// ─────────────────────────────────────────────────────────────────────────────
// Combined form state — one object for all sections
// ─────────────────────────────────────────────────────────────────────────────
export interface FinalFormData {
    newPatient: PatientDto
    patientDemographic: PatientDemographicDto
    patientEmployment: any
    hipaa: HipaaFamilyMemberDto[]
    insurance: InsurancePlanDto
    intakePacket: IntakePacketDto
    patientOffice: PatientOfficeDto
    patientProvider: PatientProviderDto
    signedDocuments: SignedDocumentDto
    emergencyContact: EmergencyContactDto
    patientPharmacy: PatientPharmacyDto
    patientInsurance: PatientInsuranceDto
    radios: Record<string, "yes" | "no">
    unableToObtainSignature: UnableToObtainSignatureDto
    signature?: Blob | null | string
}

// ─────────────────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert any date string to ISO for the API */
const toApiDate = (date?: string | null): string | undefined => {
    if (!date) return undefined
    const d = new Date(date)
    return isNaN(d.getTime()) ? undefined : d.toISOString()
}

/** Strip time portion for <input type="date"> — returns "YYYY-MM-DD" or null */
const toInputDate = (date?: string | null): string | null =>
    date ? date.split("T")[0] : null

// ─────────────────────────────────────────────────────────────────────────────
// Builds a field-name → section-key lookup map for convenient auto-routing
// ─────────────────────────────────────────────────────────────────────────────
const buildMap = (formData: FinalFormData): Record<string, keyof FinalFormData> => {
    const map: Record<string, keyof FinalFormData> = {}
    for (const key in formData) {
        if (!Object.prototype.hasOwnProperty.call(formData, key)) continue
        const section = formData[key as keyof FinalFormData]
        if (section && typeof section === "object" && !Array.isArray(section)) {
            for (const field in section as object) {
                map[field] = key as keyof FinalFormData
            }
        }
    }
    return map
}

// ─────────────────────────────────────────────────────────────────────────────
// Blank defaults — used for new patients
// ─────────────────────────────────────────────────────────────────────────────
const defaultFormData: FinalFormData = {
    newPatient: {
        // Patient table columns from DB schema (Image 6)
        firstName: "",
        middleInitial: "",
        lastName: "",
        dateOfBirth: null,
        sex: "",
        maritalStatus: "",
        ssnLast4: "",
        email: "",
        phonePrimary: "",
        phoneAlternate: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        initials: "",
        apt: "",
        createdAt: null,
        updatedAt: null,
        date: ""
    },
    patientDemographic: {
        // PatientDemographic columns (Image 7): PatientId(PK/FK), Language, Race, Ethnicity, UpdatedAt
        patientId: 0,
        language: "",
        race: "",
        ethnicity: "",
        updatedAt: null,
    },
    patientEmployment: {
        // PatientEmployment columns (Image 8): PatientEmploymentId(PK), PatientId(FK),
        // EmployerName, Occupation, EmployerAddress, CreatedAt
        employerName: "",
        occupation: "",
        employerAddress: "",
    },
    hipaa: [{
        // HipaaFamilyMember columns (Image 1): HipaaFamilyMemberId(PK), SignedDocumentId(FK),
        // FamilyMemberName, Relationship, isRepresentative — NO PatientId
        hipaaFamilyMemberId: 0,
        signedDocumentId: 0,
        familyMemberName: "",
        relationship: "",
        isRepresentative: false,
    }],
    insurance: {
        // InsurancePlan columns (Image 3): InsurancePlanId(PK), PlanName, PayerName, Notes
        insurancePlanId: 0,
        planName: "",
        payerName: "",
        notes: "",
    },
    emergencyContact: {
        // EmergencyContact columns (Image 2): EmergencyContactId(PK), PatientId(FK),
        // ContactName, Relationship, Phone, IsPrimary, CreatedAt
        emergencyContactId: 0,
        patientId: 0,
        contactName: "",
        relationship: "",
        phone: "",
        isPrimary: 0,
    },
    patientPharmacy: {
        // PatientPharmacy columns (Image 11): PatientPharmacyId(PK), PatientId(FK),
        // PharmacyName, Location, Phone, IsPreferred, CreatedAt
        patientPharmacyId: 0,
        patientId: 0,
        pharmacyName: "",
        location: "",
        phone: "",
        isPreferred: true,
    },
    patientInsurance: {
        // PatientInsurance columns (Image 9): PatientInsuranceId(PK), PatientId(FK),
        // InsurancePlanId(FK nullable), CoverageType, MemberId, GroupNumber,
        // SubscriberName, SubscriberDOB, RelationshipToPatient, IsActive, CreatedAt
        patientId: 0,
        insurancePlanId: 0,
        coverageType: "",
        memberId: "",
        groupNumber: "",
        subscriberName: "",
        subscriberDOB: null,
        relationshipToPatient: "",
        isActive: true,
    },
    intakePacket: {
        // IntakePacket columns (Image 4): IntakePacketId(PK), PatientId(FK), PacketDate,
        // LocationName, CreatedAt, OfficeId(FK)
        intakePacketId: 0,
        patientId: 0,
        packetDate: "",
        locationName: "",
        officeId: 0,
        createdAt: null,
    },
    patientOffice: {
        // PatientOffice columns (Image 10): PatientOfficeId(PK), PatientId(FK), OfficeId(FK),
        // IsPrimary(TINYINT nullable), FirstVisitDate(DATE nullable), Active(TINYINT nullable)
        officeId: 0,
        isPrimary: true,
        firstVisitDate: "",
        active: true,
    },
    patientProvider: {
        // PatientProvider columns (Image 12): PatientProviderId(PK), PatientId(FK),
        // ProviderName, ProviderType, Notes, CreatedAt
        patientProviderId: 0,
        patientId: 0,
        providerName: "",
        providerType: "",
        notes: "",
        createdAt: null,
    },
    signedDocuments: {
        // SignedDocument columns (Image 14): SignedDocumentId(PK), IntakePacketId(FK),
        // DocumentTypeId(FK), SignedByName, SignedByRole, RepresentativeAuthority,
        // SignedAt, SignatureCaptured(TINYINT), Notes, DocumentVersionId(FK nullable)
        signedDocumentId: 0,
        intakePacketId: 0,
        documentTypeId: 0,
        signedByName: "",
        signedByRole: "",
        RepresentativeAuthority: "",
        signedAt: null,
        signatureCaptured: false,
        notes: "",
        documentVersionId: undefined,
    },
    unableToObtainSignature: {
        // UnableToObtainSignature columns (Image 16): UnableId(PK), SignedDocumentId(FK),
        // AttemptDate(DATE nullable), Reason, StaffInitials
        unableId: 0,
        signedDocumentId: 0,
        attemptDate: null,
        reason: "",
        staffInitials: "",
    },
    radios: {},
    signature: null
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
const useFormData = () => {

    const [formData, setFormData] = useState<FinalFormData | null>(defaultFormData)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [patientId, setPatientId] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [postPatienForm] = usePostPatientInfoMutation()
    const [uploadSignature] = useUploadSignatureMutation()
    const [getSessionDetails] = useLazyGetSesionDetailsQuery()

    

    // ─────────────────────────────────────────────────────────────────────────
    // FETCH — loads existing patient from backend and maps to formData
    // ─────────────────────────────────────────────────────────────────────────
    const fetchFormData = async (patientId: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Patient/${patientId}`)
            if (!response.ok) throw new Error("Failed to fetch patient data")

            const data = await response.json()
            console.log("API response:", data)

            // Build radio map from SignedDocumentResponse table
            // BoolValue is TINYINT in DB — could come back as 0/1 or true/false
            const radioMap: Record<string, "yes" | "no"> = {}
            data?.signedDocumentResponse?.forEach((item: any) => {
                radioMap[item.questionCode] =
                    item.boolValue === true || item.boolValue === 1 ? "yes" : "no"
            })

            setFormData({
                // ── Patient (Image 6) ─────────────────────────────────────────
                newPatient: {
                    patientId: data?.patient?.patientId || undefined,
                    firstName: data?.patient?.firstName || "",
                    middleInitial: data?.patient?.middleInitial || "",
                    lastName: data?.patient?.lastName || "",
                    dateOfBirth: toInputDate(data?.patient?.dateOfBirth),
                    sex: data?.patient?.sex || "",
                    maritalStatus: data?.patient?.maritalStatus || "",
                    ssnLast4: data?.patient?.ssN_Last4 || "", // DB col = SSN_Last4
                    email: data?.patient?.email || "",
                    phonePrimary: data?.patient?.phonePrimary || "",
                    phoneAlternate: data?.patient?.phoneAlternate || "",
                    addressLine1: data?.patient?.addressLine1 || "",
                    addressLine2: data?.patient?.addressLine2 || "",
                    city: data?.patient?.city || "",
                    state: data?.patient?.state || "",
                    zipCode: data?.patient?.zipCode || "",
                    initials: data?.patient?.initials || "",
                    apt: data?.patient?.apt || "",
                    createdAt: data?.patient?.createdAt || null,
                    updatedAt: data?.patient?.updatedAt || null,
                    date: ""
                },

                // ── PatientDemographic (Image 7) ──────────────────────────────
                // PK = PatientId (shared), columns: Language, Race, Ethnicity, UpdatedAt
                patientDemographic: {
                    patientId: data?.demographics?.patientId || undefined,
                    language: data?.demographics?.language || "",
                    race: data?.demographics?.race || "",
                    ethnicity: data?.demographics?.ethnicity || "",
                    updatedAt: data?.demographics?.updatedAt || null,
                },

                // ── PatientEmployment (Image 8) ───────────────────────────────
                // PK = PatientEmploymentId, FK = PatientId
                patientEmployment: {
                    employerName: data?.employer?.employerName || "",
                    occupation: data?.employer?.occupation || "",
                    employerAddress: data?.employer?.employerAddress || "",
                    createdAt: data?.employer?.createdAt || null,
                },

                // ── HipaaFamilyMember (Image 1) ───────────────────────────────
                // PK = HipaaFamilyMemberId, FK = SignedDocumentId — NO PatientId
                hipaa: data?.hipaa?.length
                    ? data.hipaa.map((item: any) => ({
                        hipaaFamilyMemberId: item.hipaaFamilyMemberId || 0,
                        signedDocumentId: item.signedDocumentId || 0,
                        familyMemberName: item.familyMemberName || "",
                        relationship: item.relationship || "",
                        isRepresentative: item.isRepresentative ?? false,
                    }))
                    : defaultFormData.hipaa,

                // ── InsurancePlan (Image 3) ───────────────────────────────────
                // PK = InsurancePlanId, columns: PlanName, PayerName, Notes
                insurance: {
                    insurancePlanId: data?.insurance?.insurancePlanId || 0,
                    planName: data?.insurance?.planName || "",
                    payerName: data?.insurance?.payerName || "",
                    notes: data?.insurance?.notes || "",
                },

                // ── EmergencyContact (Image 2) ────────────────────────────────
                // PK = EmergencyContactId, FK = PatientId
                emergencyContact: {
                    emergencyContactId: data?.emergency?.emergencyContactId || undefined,
                    patientId: data?.emergency?.patientId || 0,
                    contactName: data?.emergency?.contactName || "",
                    relationship: data?.emergency?.relationship || "",
                    phone: data?.emergency?.phone || "",
                    isPrimary: data?.emergency?.isPrimary ?? 0,
                },

                // ── PatientPharmacy (Image 11) ────────────────────────────────
                // PK = PatientPharmacyId, FK = PatientId
                patientPharmacy: {
                    patientPharmacyId: data?.pharmacy?.patientPharmacyId || undefined,
                    patientId: data?.pharmacy?.patientId || undefined,
                    pharmacyName: data?.pharmacy?.pharmacyName || "",
                    location: data?.pharmacy?.location || "",
                    phone: data?.pharmacy?.phone || "",
                    isPreferred: data?.pharmacy?.isPreferred ?? true,
                },

                // ── PatientInsurance (Image 9) ────────────────────────────────
                // PK = PatientInsuranceId, FK = PatientId + InsurancePlanId
                patientInsurance: {
                    patientId: data?.patientInsurance?.patientId || undefined,
                    insurancePlanId: data?.patientInsurance?.insurancePlanId || undefined,
                    coverageType: data?.patientInsurance?.coverageType || "",
                    memberId: data?.patientInsurance?.memberId || "",
                    groupNumber: data?.patientInsurance?.groupNumber || "",
                    subscriberName: data?.patientInsurance?.subscriberName || "",
                    subscriberDOB: toInputDate(data?.patientInsurance?.subscriberDOB),
                    relationshipToPatient: data?.patientInsurance?.relationshipToPatient || "",
                    isActive: data?.patientInsurance?.isActive ?? true,
                },

                // ── IntakePacket (Image 4) ────────────────────────────────────
                // PK = IntakePacketId, FK = PatientId + OfficeId
                intakePacket: {
                    intakePacketId: data?.intakePacket?.intakePacketId || undefined,
                    patientId: data?.intakePacket?.patientId || undefined,
                    packetDate: toInputDate(data?.intakePacket?.packetDate),
                    locationName: data?.intakePacket?.locationName || "",
                    officeId: data?.intakePacket?.officeId || undefined,
                    createdAt: data?.intakePacket?.createdAt || null,
                },

                // ── PatientOffice (Image 10) ──────────────────────────────────
                // PK = PatientOfficeId, FK = PatientId + OfficeId
                // Key in API response is "patientOffice" (camelCase — fixed in backend)
                patientOffice: {
                    officeId: data?.patientOffice?.officeId || undefined,
                    isPrimary: data?.patientOffice?.isPrimary ?? true,
                    firstVisitDate: toInputDate(data?.patientOffice?.firstVisitDate),
                    active: data?.patientOffice?.active ?? true,
                },

                // ── PatientProvider (Image 12) ────────────────────────────────
                // PK = PatientProviderId, FK = PatientId
                patientProvider: {
                    patientProviderId: data?.patientProvider?.patientProviderId || undefined,
                    patientId: data?.patientProvider?.patientId || undefined,
                    providerName: data?.patientProvider?.providerName || "",
                    providerType: data?.patientProvider?.providerType || "",
                    notes: data?.patientProvider?.notes || "",
                    createdAt: data?.patientProvider?.createdAt || null,
                },

                // ── SignedDocument (Image 14) ─────────────────────────────────
                // PK = SignedDocumentId, FK = IntakePacketId + DocumentTypeId
                // Key in API response is "signedDocuments"
                signedDocuments: {
                    signedDocumentId: data?.signedDocuments?.signedDocumentId || undefined,
                    intakePacketId: data?.signedDocuments?.intakePacketId || undefined,
                    documentTypeId: data?.signedDocuments?.documentTypeId || undefined,
                    signedByName: data?.signedDocuments?.signedByName || "",
                    signedByRole: data?.signedDocuments?.signedByRole || "",
                    RepresentativeAuthority: data?.signedDocuments?.representativeAuthority || "",
                    signedAt: data?.signedDocuments?.signedAt || null,
                    signatureCaptured: data?.signedDocuments?.signatureCaptured ?? false,
                    notes: data?.signedDocuments?.notes || "",
                    documentVersionId: data?.signedDocuments?.documentVersionId,
                },

                // ── UnableToObtainSignature (Image 16) ────────────────────────
                // PK = UnableId, FK = SignedDocumentId
                // Key in API response is "unableToObtainSignature" (fixed in backend)
                unableToObtainSignature: {
                    unableId: data?.unableToObtainSignature?.unableId || undefined,
                    signedDocumentId: data?.unableToObtainSignature?.signedDocumentId || undefined,
                    attemptDate: toInputDate(data?.unableToObtainSignature?.attemptDate),
                    reason: data?.unableToObtainSignature?.reason || "",
                    staffInitials: data?.unableToObtainSignature?.staffInitials || "",
                },

                radios: radioMap,

                // ── PatientSignature (Image 13) ───────────────────────────────
                // SignatureData is LONGBLOB — comes back as base64 or URL
                signature: data?.signature?.signatureData || null
            })
        } catch (err) {
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUBMIT — builds API payload and posts to backend
    // ─────────────────────────────────────────────────────────────────────────
    const submitFormData = async () => {
        if (!formData) {
            setError(new Error("No form data to submit"))
            return
        }

        // If patientId is missing/0 this is a new patient → backend does INSERT
        const isNewPatient = !formData?.newPatient?.patientId

        // Build SignedDocumentResponse rows from radio state
        // BoolValue is TINYINT in DB — send as boolean (EF handles the conversion)
        const signedDocumentResponses = Object.entries(formData.radios || {}).map(
            ([questionCode, value]) => ({
                questionCode,
                boolValue: value === "yes",  // boolean → TINYINT via EF
                responseType: "BOOLEAN",
                textValue: null,
                choiceValue: null,
                signedDocumentId: formData.signedDocuments?.signedDocumentId || undefined
            })
        )

        try {
            setIsLoading(true)

            const payload = {
                Patient: {
                    ...formData.newPatient,
                    patientId: isNewPatient ? undefined : formData.newPatient.patientId
                },
                PatientDemographic: {
                    ...formData.patientDemographic,
                    patientId: isNewPatient ? undefined : formData.patientDemographic.patientId
                },
                PatientInsurance: {
                    ...formData.patientInsurance,
                    patientId: isNewPatient ? undefined : formData.patientInsurance.patientId,
                    subscriberDOB: formData.patientInsurance.subscriberDOB
                        ? formData.patientInsurance.subscriberDOB.split("T")[0]
                        : null
                },
                PatientEmployment: formData.patientEmployment,
                PatientPharmacy: formData.patientPharmacy,
                EmergencyContact: formData.emergencyContact,

                // Filter blank default HIPAA rows
                HipaaFamilyMembers: formData.hipaa.filter(
                    h => h.familyMemberName && h.familyMemberName.trim() !== ""
                ),

                // firstVisitDate must be YYYY-MM-DD (DATE column), not full ISO
                PatientOffice: formData.patientOffice?.officeId && formData.patientOffice.officeId > 0
                    ? {
                        ...formData.patientOffice,
                        firstVisitDate: formData.patientOffice.firstVisitDate
                            ? formData.patientOffice.firstVisitDate.split("T")[0]
                            : null
                    }
                    : null,

                PatientProvider: formData.patientProvider,

                IntakePacket: {
                    ...formData.intakePacket,
                    // FIX: null out officeId=0 so FK constraint is not violated for new patients
                    officeId: formData.intakePacket.officeId && formData.intakePacket.officeId > 0
                        ? formData.intakePacket.officeId
                        : null,
                    // FIX: DATE column — YYYY-MM-DD only, fallback to today
                    packetDate:
                        formData.intakePacket.packetDate &&
                            formData.intakePacket.packetDate !== "0001-01-01"
                            ? formData.intakePacket.packetDate.split("T")[0]
                            : new Date().toISOString().split("T")[0]
                },

                SignedDocument: {
                    ...formData.signedDocuments,
                    intakePacketId: formData.intakePacket?.intakePacketId || undefined,
                    documentTypeId: formData.signedDocuments?.documentTypeId || 1,
                },

                UnableToObtainSignature: formData.unableToObtainSignature?.attemptDate
                    ? {
                        ...formData.unableToObtainSignature,
                        // DATE column — YYYY-MM-DD only
                        attemptDate: formData.unableToObtainSignature.attemptDate.split("T")[0]
                    }
                    : null,

                SignedDocumentResponses: signedDocumentResponses
            }

            console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2))

            const res = await postPatienForm(payload).unwrap()
            const returnedPatientId = res?.patientId

            // After successful INSERT, store the new patientId in state so the
            // next save is treated as an UPDATE
            if (isNewPatient && returnedPatientId) {
                setFormData(prev => ({
                    ...prev!,
                    newPatient: {
                        ...prev!.newPatient,
                        patientId: returnedPatientId
                    }
                }))
            }

            // Upload signature blob if present
            if (formData.signature && returnedPatientId) {
                await uploadSignature({
                    patientId: returnedPatientId,
                    file: formData.signature
                }).unwrap()
            }

            console.log("Submit response:", res)
        } catch (err) {
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Generic input handler — works for any section
    // ─────────────────────────────────────────────────────────────────────────
    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        section: keyof FinalFormData
    ) => {
         const { name, value } = e.target
        const type = e.target.type
        const checked = (e.target as HTMLInputElement).checked

    setFormData((prev: any) => {

        // 🔥 SPECIAL CASE FOR HIPAA ARRAY
        if (section === "hipaa") {
            const updated = Array.isArray(prev.hipaa) ? [...prev.hipaa] : []

            const index = 0 // ⚠️ you need to pass index dynamically

            updated[index] = {
                ...updated[index],
                [name]: type === "checkbox" ? checked : value
            }

            return {
                ...prev,
                hipaa: updated
            }
        }

        // ✅ normal case
        return {
            ...prev,
            [section]: {
                ...prev[section],
                [name]: type === "checkbox" ? checked : value
            }
        }
    })
    }

    const handleHipaaChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const { name, value } = e.target;

  setFormData((prev: any) => {
    const updated = Array.isArray(prev.hipaa) ? [...prev.hipaa] : [];

    // ensure row exists
    if (!updated[index]) {
      updated[index] = {
        hipaaFamilyMemberId: 0,
        familyMemberName: "",
        relationship: "",
        isRepresentative: false
      };
    }

    updated[index] = {
      ...updated[index],
      [name]: value
    };

    return {
      ...prev,
      hipaa: updated
    };
  });
};

    // ─────────────────────────────────────────────────────────────────────────
    // Section map — maps individual field names back to their parent section
    // ─────────────────────────────────────────────────────────────────────────
    const sectionMap = useMemo(() => {
        return formData ? buildMap(formData) : {}
    }, [formData])

    // ─────────────────────────────────────────────────────────────────────────
    // On mount: read patientId from URL and load existing patient if present
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const sessionIdParams = new URLSearchParams(window.location.search).get("token")
        console.log("Session ID from URL:", sessionIdParams)
        if (sessionIdParams) {
        
            getSessionDetails(sessionIdParams)
                .unwrap()
                .then((sessionData) => {
                    console.log("Session details:", sessionData)
                    if (sessionData?.patientId) {
                        setPatientId(sessionData.patientId.toString())
                        fetchFormData(sessionData.patientId.toString())
                    } else {
                        setIsLoading(false)
                    }   
                })
                .catch((err) => {
                    console.error("Failed to fetch session details:", err)
                    setError(err as Error)
                    setIsLoading(false)
                })
        }

    }, [])

    return {
        formData,
        setFormData,
        isLoading,
        setIsLoading,
        error,
        setError,
        sectionMap,
        submitFormData,
        handleInput , 
        handleHipaaChange
    }
}

export default useFormData