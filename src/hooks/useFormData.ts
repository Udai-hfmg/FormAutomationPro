import { useEffect, useMemo, useState } from "react"
import type { PatientDemographicDto } from "../DTOs/patienDetails"
import type { HipaaFamilyMemberDto, PatientDto, PatientProviderDto } from "../DTOs"
import type { InsurancePlanDto } from "../DTOs/insurance_plan"
import type { EmergencyContactDto } from "../DTOs/emegrency"
import type { PatientPharmacyDto } from "../DTOs/patientPharmacy"
import { usePostPatientInfoMutation, useUploadSignatureMutation } from "../redux/api/PatienSlice"
import type { PatientInsuranceDto } from "../DTOs/patienDetails"
import { create } from "framer-motion/m"
import type { IntakePacketDto } from "../DTOs/intake_packet"
import type { OfficeDocumentRequirementDto, OfficeDto, PatientOfficeDto } from "../DTOs/officeDTO"
import type { SignedDocumentDto, UnableToObtainSignatureDto } from "../DTOs/document"


//interface that merge all DTos into one big DTO that has all possible fields that any form might need. This will be sent to the backend on final submit
export interface FinalFormData {
    newPatient: PatientDto,
    patientDemographic: PatientDemographicDto,
    patientEmployment: any
    hipaa: HipaaFamilyMemberDto[]
    // hpv: any
    insurance: InsurancePlanDto
    intakePacket: IntakePacketDto
    patientOffice: PatientOfficeDto
    patientProvider: PatientProviderDto
    signedDocuments: SignedDocumentDto
    // paymentAgreement: any
    // paymentPolicy: any
    // privacy: any,
    emergencyContact: EmergencyContactDto,
    patientPharmacy: PatientPharmacyDto,
    patientInsurance: PatientInsuranceDto
    radios: Record<string, "yes" | "no">
    unableToObtainSignature: UnableToObtainSignatureDto
    signature?: Blob | null

}

const cleanDate = (date: string) =>
    date ? new Date(date).toISOString() : null;

const toApiDate = (date?: string) => {
    if (!date) return undefined;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
};

const toInputDate = (date: string) =>
    date ? date.split("T")[0] : null;

const buildMap = (formData: FinalFormData): Record<string, keyof FinalFormData> => {
    const map: Record<string, keyof FinalFormData> = {}
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            for (const field in formData[key as keyof FinalFormData]) {
                map[field] = key as keyof FinalFormData
            }
        }
    }
    return map
}

const useFormData = () => {

    //state to hold form data
    const [formData, setFormData] = useState<FinalFormData | null>(
        {
            newPatient: {
                firstName: "",
                middleInitial: "",
                lastName: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                zipCode: "",
                phonePrimary: "",
                phoneAlternate: "",
                email: "",
                dateOfBirth: null,
                sex: "",
                maritalStatus: "",
                ssnLast4: "",
                createdAt: null,
                updatedAt: null,
                date: '',
                initials: ""
            },
            patientDemographic: {
                patientId: 0,
                ethnicity: "",
                language: "",
                race: "",
                updatedAt: null,
            },
            patientEmployment: {},
            hipaa: [{
                familyMemberName: "",
                relationship: "",
                hipaaFamilyMemberId: 0,
                signedDocumentId: 0,
            }],
            // hpv: {},
            insurance: {
                insurancePlanId: 0,
                payerName: "",
                planName: "",
                notes: "",
            },
            // paymentAgreement: {},
            // paymentPolicy: {},
            // privacy: {},
            emergencyContact: {
                contactName: "",
                relationship: "",
                phone: "",
                isPrimary: 0,
                patientId: 0,
                emergencyContactId: 0,
            },
            patientPharmacy: {
                pharmacyName: "",
                location: "",
                phone: "",
                isPreferred: true,
                patientId: 0,
                patientPharmacyId: 0,
            },
            patientInsurance: {
                patientId: 0,                // ✅ REQUIRED (backend uses this)

                insurancePlanId: 0,          // ✅ REQUIRED

                coverageType: "",            // ✅ REQUIRED
                memberId: "",                // ✅ REQUIRED
                groupNumber: "",

                subscriberName: "",          // ✅ ADD THIS
                subscriberDOB: null,           // "YYYY-MM-DD"
                relationshipToPatient: "",   // e.g., "Self"

                isActive: true               // ✅ REQUIRED
            },
            radios: {},
            intakePacket: {
                intakePacketId: 0,
                patientId: 0,
                packetDate: "",
                locationName: "",
                officeId: 0,
                createdAt: null,
            },
            patientOffice: {
                active: true,
                firstVisitDate: "",
                isPrimary: true,
                officeId: 0,
            },
            patientProvider: {
                patientProviderId: 0,
                patientId: 0,
                providerName: "",
                providerType: "",
                notes: "",
                createdAt: null,
            },
            signedDocuments: {
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
                unableId: 0,
                signedDocumentId: 0,
                attemptDate: null,
                reason: "",
                staffInitials: "",
            },
            signature: null 

        })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const [postPatienForm] = usePostPatientInfoMutation()
    const [uploadSignature] = useUploadSignatureMutation()

    //function to fetch data from backend and populate formData state
    const fetchFormData = async (patientId: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Patient/${patientId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch patient data")
            }
            const data = await response.json()
            //populate formData state with data from backend
            console.log('original data', data);

            const radioMap: Record<string, "yes" | "no"> = {}

            data?.signedDocumentResponse?.forEach((item: any) => {
                radioMap[item.questionCode] = item.boolValue === 1 ? "yes" : "no"
            })
            // console.log('this is the radio map',radioMap);

            setFormData({
                newPatient: {
                    patientId: data?.patient?.patientId || 0,
                    firstName: data?.patient?.firstName || "",
                    middleInitial: data?.patient?.middleInitial || "",
                    lastName: data?.patient?.lastName || "",
                    addressLine1: data?.patient?.addressLine1 || "",
                    city: data?.patient?.city || "",
                    state: data?.patient?.state || "",
                    zipCode: data?.patient?.zipCode || "",
                    ssnLast4: data?.patient?.ssN_Last4 || "",
                    dateOfBirth: toInputDate(data?.patient?.dateOfBirth),
                    maritalStatus: data?.patient?.maritalStatus || "",
                    phonePrimary: data?.patient?.phonePrimary || "",
                    phoneAlternate: data?.patient?.phoneAlternate || "",
                    email: data?.patient?.email || "",
                    addressLine2: data?.patient?.addressLine2 || "",
                    createdAt: data?.patient?.createdAt || null,
                    updatedAt: data?.patient?.updatedAt || null,
                    sex: data?.patient?.sex || "",
                    initials: data?.patient?.initials || "",

                },
                patientDemographic: {
                    // Initialize with default values or values from data
                    patientId: data?.demographics?.patientId || 0,
                    ethnicity: data?.demographics?.ethnicity || "",
                    language: data?.demographics?.language || "",
                    race: data?.demographics?.race || "",
                    updatedAt: data?.demographics?.updatedAt || null,
                },
                patientEmployment: {
                    employerAddress: data?.employer?.employerAddress || "",
                    employerName: data?.employer?.employerName || "",
                    occupation: data?.employer?.occupation || "",
                    createdAt: data?.employer?.createdAt || null,

                },
                hipaa: data?.hipaa?.map((item: any) => ({
                    familyMemberName: item.familyMemberName || "",
                    relationship: item.relationship || "",
                    hipaaFamilyMemberId: item.hipaaFamilyMemberId || 0,
                    signedDocumentId: item.signedDocumentId || 0,
                })) || [],
                // hpv: {
                //     // Initialize with default values or values from data
                // },
                insurance: {
                    insurancePlanId: data?.insurance?.insurancePlanId || "",
                    payerName: data?.insurance?.payerName || "",
                    planName: data?.insurance?.planName || "",
                    notes: data?.insurance?.notes || "",
                },
                // paymentAgreement: {
                //     // Initialize with default values or values from data
                // },
                // paymentPolicy: {
                //     // Initialize with default values or values from data
                // },
                // privacy: {
                //     // Initialize with default values or values from data
                // },
                emergencyContact: {
                    contactName: data?.emergency?.contactName || "",
                    relationship: data?.emergency?.relationship || "",
                    phone: data?.emergency?.phone || "",
                    isPrimary: data?.emergency?.isPrimary || 0,
                    patientId: data?.emergency?.patientId || 0,
                    emergencyContactId: data?.emergency?.emergencyContactId || 0,
                },
                patientPharmacy: {
                    pharmacyName: data?.pharmacy?.pharmacyName || "",
                    location: data?.pharmacy?.location || "",
                    phone: data?.pharmacy?.phone || "",
                    isPreferred: data?.pharmacy?.isPreferred || true,
                    patientId: data?.pharmacy?.patientId || 0,
                    patientPharmacyId: data?.pharmacy?.patientPharmacyId || 0,
                },
                patientInsurance: {
                    patientId: data?.patientInsurance?.patientId || 0,                // ✅ REQUIRED (backend uses this)

                    insurancePlanId: data?.patientInsurance?.insurancePlanId || 0,          // ✅ REQUIRED
                    coverageType: data?.patientInsurance?.coverageType || "",            // ✅ REQUIRED
                    memberId: data?.patientInsurance?.memberId || "",                // ✅ REQUIRED
                    groupNumber: data?.patientInsurance?.groupNumber || "",
                    subscriberName: data?.patientInsurance?.subscriberName || "",          // ✅ ADD THIS
                    subscriberDOB: toInputDate(data?.patientInsurance?.subscriberDOB),         // "YYYY-MM-DD"
                    relationshipToPatient: data?.patientInsurance?.relationshipToPatient || "",   // e.g., "Self"
                    isActive: data?.patientInsurance?.isActive ?? true,                // ✅ REQUIRED
                },
                radios: radioMap,
                intakePacket: {
                    intakePacketId: data?.intakePacket?.intakePacketId || 0,
                    patientId: data?.intakePacket?.patientId || 0,
                    packetDate: data?.intakePacket?.packetDate || null,
                    locationName: data?.intakePacket?.locationName || "",
                    officeId: data?.intakePacket?.officeId || 0,
                    createdAt: data?.intakePacket?.createdAt || null,
                },
                patientOffice: {
                    active: data?.patientOffice?.active ?? true,
                    firstVisitDate: toInputDate(data?.patientOffice?.firstVisitDate),
                    isPrimary: data?.patientOffice?.isPrimary ?? true,
                    officeId: data?.patientOffice?.officeId || 0,
                },
                patientProvider: {
                    patientProviderId: data?.patientProvider?.patientProviderId || 0,
                    patientId: data?.patientProvider?.patientId || 0,
                    providerName: data?.patientProvider?.providerName || "",
                    providerType: data?.patientProvider?.providerType || "",
                    notes: data?.patientProvider?.notes || "",
                    createdAt: data?.patientProvider?.createdAt || null,
                },
                signedDocuments: {
                    signedDocumentId: data?.signedDocument?.signedDocumentId || 0,
                    intakePacketId: data?.signedDocument?.intakePacketId || 0,
                    documentTypeId: data?.signedDocument?.documentTypeId || 0,
                    signedByName: data?.signedDocument?.signedByName || "",
                    signedByRole: data?.signedDocument?.signedByRole || "",
                    RepresentativeAuthority: data?.signedDocument?.representative || "",
                    signedAt: data?.signedDocument?.signedAt || null,
                    signatureCaptured: data?.signedDocument?.signatureCaptured ?? false,
                    notes: data?.signedDocument?.notes || "",
                    documentVersionId: data?.signedDocument?.documentVersionId,
                },
                unableToObtainSignature: {
                    unableId: data?.unableToObtainSignature?.unableId || 0,
                    signedDocumentId: data?.unableToObtainSignature?.signedDocumentId || 0,
                    attemptDate: data?.unableToObtainSignature?.attemptDate?.split("T")[0] || null,
                    reason: data?.unableToObtainSignature?.reason || "",
                    staffInitials: data?.unableToObtainSignature?.staffInitials || "",
                },
                signature:data?.signature || null

            })
        } catch (err) {
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    const sectionMap = useMemo(() => {
        return formData ? buildMap(formData) : {}
    }, [formData])

    //use effect to fetch data on mount
    useEffect(() => {
        const patientId = new URLSearchParams(window.location.search).get("patientId")
        console.log("Patient ID from URL in useEffect:", patientId)
        if (patientId) {
            fetchFormData(patientId)
        } else {
            setIsLoading(false)
        }
    }, [])

    // Add this function inside useFormData(), after fetchFormData

    const submitFormData = async () => {

        const signedDocumentResponses = Object.entries(formData?.radios || {}).map(
            ([questionCode, value]) => ({
                questionCode: questionCode,

                // 🔥 IMPORTANT
                boolValue: value === "yes",  // converts to true/false

                responseType: "BOOLEAN",
                textValue: null,
                choiceValue: null,
                // 🔥 FIX HERE
                signedDocumentId: formData?.signedDocuments?.signedDocumentId
            })
        );
        if (!formData) {
            setError(new Error("No form data to submit"))
            return
        }
        try {
            setIsLoading(true)
            console.log('this is the final before  payload', formData);
            const payload = {
                Patient: formData.newPatient,
                PatientDemographic: formData.patientDemographic,
                PatientEmployment: formData.patientEmployment,
                PatientPharmacy: formData.patientPharmacy,
                PatientInsurance: formData.patientInsurance,
                EmergencyContact: formData.emergencyContact,
                HipaaFamilyMembers: formData.hipaa,
                PatientOffice: formData.patientOffice.officeId
                    ? {
                        ...formData.patientOffice,
                        firstVisitDate: formData.patientOffice.firstVisitDate
                            ? toApiDate(formData.patientOffice.firstVisitDate)
                            : undefined
                    }
                    : null,
                PatientProvider: formData.patientProvider,
                IntakePacket: {
                    ...formData.intakePacket,
                    packetDate: formData.intakePacket.packetDate &&
                        formData.intakePacket.packetDate !== "0001-01-01"
                        ? toApiDate(formData.intakePacket.packetDate)
                        : undefined
                },
                SignedDocument: {
                    ...formData.signedDocuments,

                    // ensure required IDs
                    documentTypeId: formData?.signedDocuments?.documentTypeId || 1,
                    intakePacketId: formData?.intakePacket?.intakePacketId || 1,

                    // ✅ use actual user-entered data
                    signedByName: formData?.signedDocuments?.signedByName?.trim() || "",
                    signedByRole: formData?.signedDocuments?.signedByRole?.trim() || "",
                    // ✅ fix date issue safely
                    signedAt: formData?.signedDocuments?.signedAt
                        ? toApiDate(formData?.signedDocuments?.signedAt)
                        : new Date().toISOString(),

                    signatureCaptured: formData?.signedDocuments?.signatureCaptured ?? false,
                    notes: formData?.signedDocuments?.notes || ""
                },
                UnableToObtainSignature: formData?.unableToObtainSignature?.attemptDate
                    ? {
                        ...formData?.unableToObtainSignature,
                        attemptDate: toApiDate(formData?.unableToObtainSignature?.attemptDate),
                    }
                    : null,
                SignedDocumentResponses: signedDocumentResponses
            }

            console.log("FINAL PAYLOAD", JSON.stringify(payload, null, 2));

            const res = await postPatienForm(payload).unwrap()
            const patientId = res?.patientId; // ✅ CORRECT ID
            if (formData?.signature && patientId) {
                await uploadSignature({
                    patientId: patientId,
                    file: formData.signature
                }).unwrap();
            }
            console.log('this is the response form the post api',res);
            
        } catch (err) {
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof FinalFormData
    ) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: type === "checkbox" ? checked : value
            }
        }));
    };



    return { formData, setFormData, isLoading, setIsLoading, error, setError, sectionMap, submitFormData, handleInput }
}


export default useFormData