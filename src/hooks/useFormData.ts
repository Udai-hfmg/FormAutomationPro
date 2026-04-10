import { useEffect, useMemo, useState, useCallback } from "react";
import type { PatientDemographicDto } from "../DTOs/patienDetails";
import type {
    HipaaFamilyMemberDto,
    PatientDto,
    PatientProviderDto,
} from "../DTOs";
import type { InsurancePlanDto } from "../DTOs/insurance_plan";
import type { EmergencyContactDto } from "../DTOs/emegrency";
import type { PatientPharmacyDto } from "../DTOs/patientPharmacy";
import {
    useLazyGetSesionDetailsQuery,
    usePostPatientInfoMutation,
} from "../redux/api/PatienSlice";
import type { PatientInsuranceDto } from "../DTOs/patienDetails";
import type { IntakePacketDto } from "../DTOs/intake_packet";
import type { PatientOfficeDto } from "../DTOs/officeDTO";
import type {
    SignedDocumentDto,
    UnableToObtainSignatureDto,
} from "../DTOs/document";

// --- INTERFACES ---

export interface FinalFormData {
    newPatient: PatientDto;
    patientDemographic: PatientDemographicDto;
    patientEmployment: any;
    hipaa: HipaaFamilyMemberDto[];
    insurance: InsurancePlanDto;
    intakePacket: IntakePacketDto;
    patientOffice: PatientOfficeDto;
    patientProvider: PatientProviderDto;
    signedDocuments: SignedDocumentDto;
    emergencyContact: EmergencyContactDto;
    patientPharmacy: PatientPharmacyDto;
    patientInsurance: PatientInsuranceDto;
    radios: Record<string, "yes" | "no">;
    unableToObtainSignature: UnableToObtainSignatureDto;
}

// --- CONSTANTS ---

const INITIAL_FORM_DATA: FinalFormData = {
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
        dateOfBirth: "",
        sex: "",
        maritalStatus: "",
        ssnLast4: "",
        createdAt: "",
        updatedAt: "",
        date: "",
    },
    patientDemographic: {
        patientId: 0,
        ethnicity: "",
        language: "",
        race: "",
        updatedAt: "",
    },
    patientEmployment: {},
    hipaa: [
        {
            familyMemberName: "",
            relationship: "",
            hipaaFamilyMemberId: 0,
            signedDocumentId: 0,
        },
    ],
    insurance: {
        insurancePlanId: 0,
        payerName: "",
        planName: "",
        notes: "",
    },
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
        patientId: 0,
        insurancePlanId: 0,
        coverageType: "",
        memberId: "",
        groupNumber: "",
        subscriberName: "",
        subscriberDOB: "",
        relationshipToPatient: "",
        isActive: true,
    },
    radios: {},
    intakePacket: {
        intakePacketId: 0,
        patientId: 0,
        packetDate: "",
        locationName: "",
        officeId: 0,
        createdAt: "",
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
        createdAt: "",
    },
    signedDocuments: {
        signedDocumentId: 0,
        intakePacketId: 0,
        documentTypeId: 0,
        signedByName: "",
        signedByRole: "",
        RepresentativeAuthority: "",
        signedAt: "",
        signatureCaptured: false,
        notes: "",
        documentVersionId: undefined,
    },
    unableToObtainSignature: {
        unableId: 0,
        signedDocumentId: 0,
        attemptDate: "",
        reason: "",
        staffInitials: "",
    },
};

// --- HELPER FUNCTIONS ---

const cleanDate = (date: string) =>
    date ? new Date(date).toISOString() : undefined;

const toApiDate = (date?: string) => {
    if (!date) return undefined;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
};

const toInputDate = (date: string) => (date ? date.split("T")[0] : "");

const buildMap = (
    formData: FinalFormData,
): Record<string, keyof FinalFormData> => {
    const map: Record<string, keyof FinalFormData> = {};
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            for (const field in formData[key as keyof FinalFormData]) {
                map[field] = key as keyof FinalFormData;
            }
        }
    }
    return map;
};

// --- MAIN HOOK ---

const useFormData = () => {
    // --- STATE ---
    const [formData, setFormData] = useState<FinalFormData | null>(
        INITIAL_FORM_DATA,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [sessionDetails, setSessionDetails] = useState<any>(null);

    // --- API HOOKS ---
    const [postPatienForm] = usePostPatientInfoMutation();
    const [getSession] = useLazyGetSesionDetailsQuery();

    // --- DERIVED STATE ---
    const sectionMap = useMemo(() => {
        return formData ? buildMap(formData) : {};
    }, [formData]);

    // --- FUNCTIONS ---

    /**
     * Fetches current session details using the provided token.
     */
    const getSessionDetails = async (token: string) => {
        try {
            if (!token) {
                setError(new Error("No token provided"));
                return;
            }
            const data = await getSession(token).unwrap();
            setSessionDetails(data);
        } catch (error) {
            setError(error as Error);
        }
        setIsLoading(false)
    };

    /**
     * Fetches patient form data from the backend and populates state.
     * Triggers whenever sessionDetails contains a valid patientId.
     */
    const fetchFormData = useCallback(async () => {
        if (!sessionDetails?.patientId) return;

        try {
            setIsLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/Patient/${sessionDetails.patientId}`,
            );

            if (!response.ok) {
                throw new Error("Failed to fetch patient data");
            }

            const data = await response.json();
            const radioMap: Record<string, "yes" | "no"> = {};

            data?.signedDocumentResponse?.forEach((item: any) => {
                radioMap[item.questionCode] = item.boolValue === 1 ? "yes" : "no";
            });

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
                    createdAt: data?.patient?.createdAt || "",
                    updatedAt: data?.patient?.updatedAt || "",
                    sex: data?.patient?.sex || "",
                },
                patientDemographic: {
                    patientId: data?.demographics?.patientId || 0,
                    ethnicity: data?.demographics?.ethnicity || "",
                    language: data?.demographics?.language || "",
                    race: data?.demographics?.race || "",
                    updatedAt: data?.demographics?.updatedAt || "",
                },
                patientEmployment: {
                    employerAddress: data?.employer?.employerAddress || "",
                    employerName: data?.employer?.employerName || "",
                    occupation: data?.employer?.occupation || "",
                    createdAt: data?.employer?.createdAt || "",
                },
                hipaa:
                    data?.hippa?.map((item: any) => ({
                        familyMemberName: item.familyMemberName || "",
                        relationship: item.relationship || "",
                        hipaaFamilyMemberId: item.hipaaFamilyMemberId || 0,
                        signedDocumentId: item.signedDocumentId || 0,
                    })) || [],
                insurance: {
                    insurancePlanId: data?.insurance?.insurancePlanId || "",
                    payerName: data?.insurance?.payerName || "",
                    planName: data?.insurance?.planName || "",
                    notes: data?.insurance?.notes || "",
                },
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
                    patientId: data?.patientInsurance?.patientId || 0,
                    insurancePlanId: data?.patientInsurance?.insurancePlanId || 0,
                    coverageType: data?.patientInsurance?.coverageType || "",
                    memberId: data?.patientInsurance?.memberId || "",
                    groupNumber: data?.patientInsurance?.groupNumber || "",
                    subscriberName: data?.patientInsurance?.subscriberName || "",
                    subscriberDOB: toInputDate(data?.patientInsurance?.subscriberDOB),
                    relationshipToPatient:
                        data?.patientInsurance?.relationshipToPatient || "",
                    isActive: data?.patientInsurance?.isActive ?? true,
                },
                radios: radioMap,
                intakePacket: {
                    intakePacketId: data?.intakePacket?.intakePacketId || 0,
                    patientId: data?.intakePacket?.patientId || 0,
                    packetDate: toInputDate(data?.intakePacket?.packetDate),
                    locationName: data?.intakePacket?.locationName || "",
                    officeId: data?.intakePacket?.officeId || 0,
                    createdAt: data?.intakePacket?.createdAt || "",
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
                    createdAt: data?.patientProvider?.createdAt || "",
                },
                signedDocuments: {
                    signedDocumentId: data?.signedDocument?.signedDocumentId || 0,
                    intakePacketId: data?.signedDocument?.intakePacketId || 0,
                    documentTypeId: data?.signedDocument?.documentTypeId || 0,
                    signedByName: data?.signedDocument?.signedByName || "",
                    signedByRole: data?.signedDocument?.signedByRole || "",
                    RepresentativeAuthority: data?.signedDocument?.representative || "",
                    signedAt: data?.signedDocument?.signedAt || "",
                    signatureCaptured: data?.signedDocument?.signatureCaptured ?? false,
                    notes: data?.signedDocument?.notes || "",
                    documentVersionId: data?.signedDocument?.documentVersionId,
                },
                unableToObtainSignature: {
                    unableId: data?.unableToObtainSignature?.unableId || 0,
                    signedDocumentId:
                        data?.unableToObtainSignature?.signedDocumentId || 0,
                    attemptDate:
                        data?.unableToObtainSignature?.attemptDate?.split("T")[0] || "",
                    reason: data?.unableToObtainSignature?.reason || "",
                    staffInitials: data?.unableToObtainSignature?.staffInitials || "",
                },
            });
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [sessionDetails?.patientId]);

    /**
     * Submits the consolidated form data object safely to the backend.
     */
    const submitFormData = async () => {
        if (!formData) {
            setError(new Error("No form data to submit"));
            return;
        }

        const signedDocumentResponses = Object.entries(formData?.radios || {}).map(
            ([questionCode, value]) => ({
                questionCode: questionCode,
                boolValue: value === "yes",
                responseType: "BOOLEAN",
                textValue: null,
                choiceValue: null,
                signedDocumentId: formData?.signedDocuments?.signedDocumentId,
            }),
        );

        try {
            setIsLoading(true);

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
                            : undefined,
                    }
                    : null,
                PatientProvider: formData.patientProvider,
                IntakePacket: {
                    ...formData.intakePacket,
                    packetDate:
                        formData.intakePacket.packetDate &&
                            formData.intakePacket.packetDate !== "0001-01-01"
                            ? toApiDate(formData.intakePacket.packetDate)
                            : undefined,
                },
                SignedDocument: {
                    ...formData.signedDocuments,
                    documentTypeId: formData?.signedDocuments?.documentTypeId || 1,
                    intakePacketId: formData?.intakePacket?.intakePacketId || 1,
                    signedByName: formData?.signedDocuments?.signedByName?.trim() || "",
                    signedByRole: formData?.signedDocuments?.signedByRole?.trim() || "",
                    signedAt: formData?.signedDocuments?.signedAt
                        ? toApiDate(formData?.signedDocuments?.signedAt)
                        : new Date().toISOString(),
                    signatureCaptured:
                        formData?.signedDocuments?.signatureCaptured ?? false,
                    notes: formData?.signedDocuments?.notes || "",
                },
                UnableToObtainSignature: formData?.unableToObtainSignature?.attemptDate
                    ? {
                        ...formData?.unableToObtainSignature,
                        attemptDate: toApiDate(
                            formData?.unableToObtainSignature?.attemptDate,
                        ),
                    }
                    : null,
                SignedDocumentResponses: signedDocumentResponses,
            };

            await postPatienForm(payload).unwrap();
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Generalized input handler for standard form events and checkboxes.
     */
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [sectionMap[name]]: {
                ...prev[sectionMap[name]],
                [name]: type === "checkbox" ? checked : value,
            },
        }));
    };

    // --- EFFECTS ---

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if (token) {
            getSessionDetails(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (sessionDetails?.patientId) {
            fetchFormData();
        }
    }, [fetchFormData, sessionDetails?.patientId]);

    return {
        formData,
        setFormData,
        isLoading,
        setIsLoading,
        error,
        setError,
        sectionMap,
        submitFormData,
        handleInput,
    };
};

export default useFormData;
