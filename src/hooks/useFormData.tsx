import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { PatientDemographicDto } from "../DTOs/patienDetails"
import type { HipaaFamilyMemberDto, PatientDto, PatientProviderDto } from "../DTOs"
import type { InsurancePlanDto } from "../DTOs/insurance_plan"
import type { EmergencyContactDto } from "../DTOs/emegrency"
import type { PatientPharmacyDto } from "../DTOs/patientPharmacy"
import { useLazyGetSesionDetailsQuery, usePostPatientInfoMutation, useUploadSignatureMutation } from "../redux/api/PatienSlice"
import type { PatientInsuranceDto, PatientDemographicDto as PID } from "../DTOs/patienDetails"
import type { IntakePacketDto } from "../DTOs/intake_packet"
import type { PatientOfficeDto } from "../DTOs/officeDTO"
import type { SignedDocumentDto, UnableToObtainSignatureDto } from "../DTOs/document"
import toast from "react-hot-toast"

// ── re-export so DTOs are available from one place ────────────────────────────
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

interface SignatureMeta {
    signatureVersion: number;
    lastSignatureSourceId: string | null;
}
// ── same interface that useFormData() used to return ─────────────────────────
interface FormDataContextValue {
    formData: FinalFormData | null
    setFormData: React.Dispatch<React.SetStateAction<FinalFormData | null>>
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    error: Error | null
    setError: React.Dispatch<React.SetStateAction<Error | null>>
    sectionMap: Record<string, keyof FinalFormData>
    submitFormData: () => Promise<void>
    signatureMeta:SignatureMeta,
    setSignatureMeta: React.Dispatch<React.SetStateAction<SignatureMeta>>
    handleInput: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        section: keyof FinalFormData
    ) => void
    handleHipaaChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void
}

// ── date helpers ─────────────────────────────────────────────────────────────
const toInputDate = (date?: string | null): string | null =>
    date ? date.split("T")[0] : null

// ── field → section lookup ────────────────────────────────────────────────────
const buildMap = (formData: FinalFormData): Record<string, keyof FinalFormData> => {
    const map: Record<string, keyof FinalFormData> = {}
    for (const key in formData) {
        if (!Object.prototype.hasOwnProperty.call(formData, key)) continue
        const section = formData[key as keyof FinalFormData]
        if (section && typeof section === "object" && !Array.isArray(section)) {
            for (const field in section as object) map[field] = key as keyof FinalFormData
        }
    }
    return map
}

// ── defaults ──────────────────────────────────────────────────────────────────
export const defaultFormData: FinalFormData = {
    newPatient: {
        firstName: "", middleInitial: "", lastName: "", dateOfBirth: null,
        sex: "", maritalStatus: "", ssnLast4: "", email: "", phonePrimary: "",
        phoneAlternate: "", addressLine1: "", addressLine2: "", city: "",
        state: "", zipCode: "", initials: "", apt: "", createdAt: null,
        updatedAt: null, date: ""
    },
    patientDemographic: { patientId: 0, language: "", race: "", ethnicity: "", updatedAt: null },
    patientEmployment:  { employerName: "", occupation: "", employerAddress: "" },
    hipaa: [{ hipaaFamilyMemberId: 0, signedDocumentId: 0, familyMemberName: "", relationship: "", isRepresentative: false }],
    insurance:          { insurancePlanId: 0, planName: "", payerName: "", notes: "" },
    emergencyContact:   { emergencyContactId: 0, patientId: 0, contactName: "", relationship: "", phone: "", isPrimary: 0 },
    patientPharmacy:    { patientPharmacyId: 0, patientId: 0, pharmacyName: "", location: "", phone: "", isPreferred: true },
    patientInsurance:   { patientId: 0, insurancePlanId: 0, coverageType: "", memberId: "", groupNumber: "", subscriberName: "", subscriberDOB: null, relationshipToPatient: "", isActive: true },
    intakePacket:       { intakePacketId: 0, patientId: 0, packetDate: "", locationName: "", officeId: 0, createdAt: null },
    patientOffice:      { officeId: 0, isPrimary: true, firstVisitDate: "", active: true },
    patientProvider:    { patientProviderId: 0, patientId: 0, providerName: "", providerType: "", notes: "", createdAt: null },
    signedDocuments:    { signedDocumentId: 0, intakePacketId: 0, documentTypeId: 0, signedByName: "", signedByRole: "", RepresentativeAuthority: "", signedAt: null, signatureCaptured: false, notes: "", documentVersionId: undefined },
    unableToObtainSignature: { unableId: 0, signedDocumentId: 0, attemptDate: null, reason: "", staffInitials: "" },
    radios: {},
    signature: null
}

// ── context ───────────────────────────────────────────────────────────────────
const FormDataContext = createContext<FormDataContextValue | null>(null)

// ── provider ──────────────────────────────────────────────────────────────────
export function FormDataProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData]   = useState<FinalFormData | null>(defaultFormData)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError]         = useState<Error | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)

    const [postPatienForm]    = usePostPatientInfoMutation()
    const [uploadSignature]   = useUploadSignatureMutation()
    const [getSessionDetails] = useLazyGetSesionDetailsQuery()

    const [signatureMeta,setSignatureMeta]=useState<SignatureMeta>({
        signatureVersion: 0,
        lastSignatureSourceId: null,
    })

    // ── fetch ─────────────────────────────────────────────────────────────────
    const fetchFormData = async (patientId: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Patient/${patientId}`)
            if (!response.ok) throw new Error("Failed to fetch patient data")
            const data = await response.json()

            const radioMap: Record<string, "yes" | "no"> = {}
            data?.signedDocumentResponse?.forEach((item: any) => {
                radioMap[item.questionCode] = item.boolValue === true || item.boolValue === 1 ? "yes" : "no"
            })

            setFormData({
                newPatient: {
                    patientId:      data?.patient?.patientId || undefined,
                    firstName:      data?.patient?.firstName || "",
                    middleInitial:  data?.patient?.middleInitial || "",
                    lastName:       data?.patient?.lastName || "",
                    dateOfBirth:    toInputDate(data?.patient?.dateOfBirth),
                    sex:            data?.patient?.sex || "",
                    maritalStatus:  data?.patient?.maritalStatus || "",
                    ssnLast4:       data?.patient?.ssN_Last4 || "",
                    email:          data?.patient?.email || "",
                    phonePrimary:   data?.patient?.phonePrimary || "",
                    phoneAlternate: data?.patient?.phoneAlternate || "",
                    addressLine1:   data?.patient?.addressLine1 || "",
                    addressLine2:   data?.patient?.addressLine2 || "",
                    city:           data?.patient?.city || "",
                    state:          data?.patient?.state || "",
                    zipCode:        data?.patient?.zipCode || "",
                    initials:       data?.patient?.initials || "",
                    apt:            data?.patient?.apt || "",
                    createdAt:      data?.patient?.createdAt || null,
                    updatedAt:      data?.patient?.updatedAt || null,
                    date:           ""
                },
                patientDemographic: {
                    patientId:  data?.demographics?.patientId || undefined,
                    language:   data?.demographics?.language || "",
                    race:       data?.demographics?.race || "",
                    ethnicity:  data?.demographics?.ethnicity || "",
                    updatedAt:  data?.demographics?.updatedAt || null,
                },
                patientEmployment: {
                    employerName:    data?.employer?.employerName || "",
                    occupation:      data?.employer?.occupation || "",
                    employerAddress: data?.employer?.employerAddress || "",
                    createdAt:       data?.employer?.createdAt || null,
                },
                hipaa: data?.hipaa?.length
                    ? data.hipaa.map((item: any) => ({
                        hipaaFamilyMemberId: item.hipaaFamilyMemberId || 0,
                        signedDocumentId:    item.signedDocumentId || 0,
                        familyMemberName:    item.familyMemberName || "",
                        relationship:        item.relationship || "",
                        isRepresentative:    item.isRepresentative ?? false,
                    }))
                    : defaultFormData.hipaa,
                insurance: {
                    insurancePlanId: data?.insurance?.insurancePlanId || 0,
                    planName:        data?.insurance?.planName || "",
                    payerName:       data?.insurance?.payerName || "",
                    notes:           data?.insurance?.notes || "",
                },
                emergencyContact: {
                    emergencyContactId: data?.emergency?.emergencyContactId || undefined,
                    patientId:          data?.emergency?.patientId || 0,
                    contactName:        data?.emergency?.contactName || "",
                    relationship:       data?.emergency?.relationship || "",
                    phone:              data?.emergency?.phone || "",
                    isPrimary:          data?.emergency?.isPrimary ?? 0,
                },
                patientPharmacy: {
                    patientPharmacyId: data?.pharmacy?.patientPharmacyId || undefined,
                    patientId:         data?.pharmacy?.patientId || undefined,
                    pharmacyName:      data?.pharmacy?.pharmacyName || "",
                    location:          data?.pharmacy?.location || "",
                    phone:             data?.pharmacy?.phone || "",
                    isPreferred:       data?.pharmacy?.isPreferred ?? true,
                },
                patientInsurance: {
                    patientId:               data?.patientInsurance?.patientId || undefined,
                    insurancePlanId:         data?.patientInsurance?.insurancePlanId || undefined,
                    coverageType:            data?.patientInsurance?.coverageType || "",
                    memberId:                data?.patientInsurance?.memberId || "",
                    groupNumber:             data?.patientInsurance?.groupNumber || "",
                    subscriberName:          data?.patientInsurance?.subscriberName || "",
                    subscriberDOB:           toInputDate(data?.patientInsurance?.subscriberDOB),
                    relationshipToPatient:   data?.patientInsurance?.relationshipToPatient || "",
                    isActive:                data?.patientInsurance?.isActive ?? true,
                },
                intakePacket: {
                    intakePacketId: data?.intakePacket?.intakePacketId || undefined,
                    patientId:      data?.intakePacket?.patientId || undefined,
                    packetDate:     toInputDate(data?.intakePacket?.packetDate),
                    locationName:   data?.intakePacket?.locationName || "",
                    officeId:       data?.intakePacket?.officeId || undefined,
                    createdAt:      data?.intakePacket?.createdAt || null,
                },
                patientOffice: {
                    officeId:       data?.patientOffice?.officeId || undefined,
                    isPrimary:      data?.patientOffice?.isPrimary ?? true,
                    firstVisitDate: toInputDate(data?.patientOffice?.firstVisitDate),
                    active:         data?.patientOffice?.active ?? true,
                },
                patientProvider: {
                    patientProviderId: data?.patientProvider?.patientProviderId || undefined,
                    patientId:         data?.patientProvider?.patientId || undefined,
                    providerName:      data?.patientProvider?.providerName || "",
                    providerType:      data?.patientProvider?.providerType || "",
                    notes:             data?.patientProvider?.notes || "",
                    createdAt:         data?.patientProvider?.createdAt || null,
                },
                signedDocuments: {
                    signedDocumentId:        data?.signedDocuments?.signedDocumentId || undefined,
                    intakePacketId:          data?.signedDocuments?.intakePacketId || undefined,
                    documentTypeId:          data?.signedDocuments?.documentTypeId || undefined,
                    signedByName:            data?.signedDocuments?.signedByName || "",
                    signedByRole:            data?.signedDocuments?.signedByRole || "",
                    RepresentativeAuthority: data?.signedDocuments?.representativeAuthority || "",
                    signedAt:                data?.signedDocuments?.signedAt || null,
                    signatureCaptured:       data?.signedDocuments?.signatureCaptured ?? false,
                    notes:                   data?.signedDocuments?.notes || "",
                    documentVersionId:       data?.signedDocuments?.documentVersionId,
                },
                unableToObtainSignature: {
                    unableId:         data?.unableToObtainSignature?.unableId || undefined,
                    signedDocumentId: data?.unableToObtainSignature?.signedDocumentId || undefined,
                    attemptDate:      toInputDate(data?.unableToObtainSignature?.attemptDate),
                    reason:           data?.unableToObtainSignature?.reason || "",
                    staffInitials:    data?.unableToObtainSignature?.staffInitials || "",
                },
                radios:    radioMap,
                signature: data?.signature?.signatureData || null,
            })
        } catch (err) {
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    // ── submit ────────────────────────────────────────────────────────────────
    const submitFormData = async () => {
        if (!formData) { setError(new Error("No form data to submit")); return }

        const isNewPatient = !formData?.newPatient?.patientId
        const signedDocumentResponses = Object.entries(formData.radios || {}).map(
            ([questionCode, value]) => ({
                questionCode, boolValue: value === "yes",
                responseType: "BOOLEAN", textValue: null, choiceValue: null,
                signedDocumentId: formData.signedDocuments?.signedDocumentId || undefined
            })
        )

        try {
            setIsLoading(true)
            const payload = {
                SessionId: sessionId,
                Patient: { ...formData.newPatient, patientId: isNewPatient ? undefined : formData.newPatient.patientId },
                PatientDemographic: { ...formData.patientDemographic, patientId: isNewPatient ? undefined : formData.patientDemographic.patientId },
                PatientInsurance: { ...formData.patientInsurance, patientId: isNewPatient ? undefined : formData.patientInsurance.patientId, subscriberDOB: formData.patientInsurance.subscriberDOB ? formData.patientInsurance.subscriberDOB.split("T")[0] : null },
                PatientEmployment:  formData.patientEmployment,
                PatientPharmacy:    formData.patientPharmacy,
                EmergencyContact:   formData.emergencyContact,
                HipaaFamilyMembers: formData.hipaa.filter(h => h.familyMemberName?.trim()),
                PatientOffice: formData.patientOffice?.officeId && formData.patientOffice.officeId > 0
                    ? { ...formData.patientOffice, firstVisitDate: formData.patientOffice.firstVisitDate ? formData.patientOffice.firstVisitDate.split("T")[0] : null }
                    : null,
                PatientProvider: formData.patientProvider,
                IntakePacket: { ...formData.intakePacket, officeId: formData.intakePacket.officeId > 0 ? formData.intakePacket.officeId : null, packetDate: formData.intakePacket.packetDate && formData.intakePacket.packetDate !== "0001-01-01" ? formData.intakePacket.packetDate.split("T")[0] : new Date().toISOString().split("T")[0] },
                SignedDocument: { ...formData.signedDocuments, intakePacketId: formData.intakePacket?.intakePacketId || undefined, documentTypeId: formData.signedDocuments?.documentTypeId || 1 },
                UnableToObtainSignature: formData.unableToObtainSignature?.attemptDate ? { ...formData.unableToObtainSignature, attemptDate: formData.unableToObtainSignature.attemptDate.split("T")[0] } : null,
                SignedDocumentResponses: signedDocumentResponses
            }

            const res = await postPatienForm(payload).unwrap()
            const returnedPatientId = res?.patientId

            if (isNewPatient && returnedPatientId) {
                setFormData(prev => ({ ...prev!, newPatient: { ...prev!.newPatient, patientId: returnedPatientId } }))
            }
            if (formData.signature && returnedPatientId) {
                await uploadSignature({ patientId: returnedPatientId, file: formData.signature }).unwrap()
            }
            toast.success("Form submitted successfully!")
        } catch (err) {
            setError(err as Error)
            toast.error("Submission failed.")
        } finally {
            setIsLoading(false)
        }
    }

    // ── handlers ──────────────────────────────────────────────────────────────
    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        section: keyof FinalFormData
    ) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        setFormData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [name]: type === "checkbox" ? checked : value }
        }))
    }

    const handleHipaaChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target
        setFormData((prev: any) => {
            const updated = Array.isArray(prev.hipaa) ? [...prev.hipaa] : []
            if (!updated[index]) updated[index] = { hipaaFamilyMemberId: 0, familyMemberName: "", relationship: "", isRepresentative: false }
            updated[index] = { ...updated[index], [name]: value }
            return { ...prev, hipaa: updated }
        })
    }

    // ── on mount ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token")
        if (!token) { setIsLoading(false); return }

        setSessionId(token)
        getSessionDetails(token)
            .unwrap()
            .then((sessionData) => {
                if (sessionData?.patientId) {
                    fetchFormData(sessionData.patientId.toString())
                } else {
                    setIsLoading(false)
                }
            })
            .catch((err) => { setError(err as Error); setIsLoading(false) })
    }, [])

    const sectionMap = useMemo(() => formData ? buildMap(formData) : {}, [formData])

    return (
        <FormDataContext.Provider value={{ formData, setFormData, isLoading, setIsLoading, error, setError, sectionMap, submitFormData, handleInput, handleHipaaChange,signatureMeta,setSignatureMeta }}>
            {children}
        </FormDataContext.Provider>
    )
}

// ── internal hook — not exported directly ─────────────────────────────────────
export default function useFormData() {
    const ctx = useContext(FormDataContext)
    if (!ctx) throw new Error("useFormContext must be used inside <FormDataProvider>")
    return ctx
}
