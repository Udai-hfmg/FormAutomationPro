import { useEffect, useMemo, useState } from "react"
import type { PatientDemographicDto } from "../DTOs/patienDetails"
import type { HipaaFamilyMemberDto, PatientDto } from "../DTOs"
import type { InsurancePlanDto } from "../DTOs/insurance_plan"
import type { EmergencyContactDto } from "../DTOs/emegrency"
import type { PatientPharmacyDto } from "../DTOs/patientPharmacy"
import { usePostPatientInfoMutation } from "../redux/api/PatienSlice"


//interface that merge all DTos into one big DTO that has all possible fields that any form might need. This will be sent to the backend on final submit
export interface FinalFormData {
  newPatient: PatientDto,
  patientDemographic: PatientDemographicDto , 
  patientEmployment: any
  hipaa: HipaaFamilyMemberDto
  hpv: any
  insurance: InsurancePlanDto
  paymentAgreement: any
  paymentPolicy: any
  privacy: any , 
  emergencyContact: EmergencyContactDto,
  patientPharmacy: PatientPharmacyDto
  
}

const buildMap = (formData: FinalFormData): Record<string, keyof FinalFormData> => {
    const map: Record<string, keyof FinalFormData> = {}
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            for(const field in formData[key as keyof FinalFormData]) {
                map[field] = key as keyof FinalFormData
            }
        }
    }
    return map
}

const useFormData = ()=>{

    //state to hold form data
    const [formData, setFormData] = useState<FinalFormData | null>(
    {
        newPatient: {
            firstName: "",
            middleInitial: "",
            lastName: "",
            addressLine1: "",
            city: "",
            state: "",
            zipCode: "",
            ssnLast4: "",
            dateOfBirth: "",
        },
        patientDemographic: {
            patientId: 0,
            ethnicity: "",
            language: "",
            race: "",
            updatedAt: "",
        },
        patientEmployment: {},
        hipaa: {
            familyMemberName: "",
            relationship: "",
            hipaaFamilyMemberId: 0,
            signedDocumentId: 0,
        },
        hpv: {},
        insurance: {
            insurancePlanId: 0,
            payerName: "",
            planName: "",
            notes: "",
        },
        paymentAgreement: {},
        paymentPolicy: {},
        privacy: {},
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
    })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const [postPatienForm] = usePostPatientInfoMutation()

    //function to fetch data from backend and populate formData state
    const fetchFormData = async (patientId: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`https://localhost:7057/api/Patient/${patientId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch patient data")
            }
            const data = await response.json()
            //populate formData state with data from backend
            setFormData({
                newPatient: {
                    firstName: data?.patient?.firstName || "",
                    middleInitial: data?.patient?.middleInitial || "",
                    lastName: data?.patient?.lastName || "",
                    addressLine1: data?.patient?.addressLine1 || "",
                    city: data?.patient?.city || "",
                    state: data?.patient?.state || "",
                    zipCode: data?.patient?.zipCode || "",
                    ssnLast4: data?.patient?.ssN_Last4 || "",
                    dateOfBirth: data?.patient?.dateOfBirth?.split("T")[0] || "",
                },
                patientDemographic: {
                    // Initialize with default values or values from data
                    patientId: data?.demographics?.patientId || 0,
                    ethnicity: data?.demographics?.ethnicity || "",
                    language: data?.demographics?.language || "",
                    race: data?.demographics?.race || "",
                    updatedAt: data?.demographics?.updatedAt || "",
                },
                patientEmployment: {
                    // Initialize with default values or values from data

                },
                hipaa: {
                    familyMemberName: data?.hipaa?.familyMemberName || "",
                    relationship: data?.hipaa?.relationship || "",
                    hipaaFamilyMemberId: data?.hipaa?.hipaaFamilyMemberId || "",
                    signedDocumentId: data?.hipaa?.signedDocumentId || "",
                    // Initialize with default values or values from data
                },
                hpv: {
                    // Initialize with default values or values from data
                },
                insurance: {
                    insurancePlanId: data?.insurance?.insurancePlanId || "",
                    payerName: data?.insurance?.payerName || "",
                    planName: data?.insurance?.planName || "",
                    notes: data?.insurance?.notes || "",
                    // Initialize with default values or values from data
                },
                paymentAgreement: {
                    // Initialize with default values or values from data
                },
                paymentPolicy: {
                    // Initialize with default values or values from data
                },
                privacy: {
                    // Initialize with default values or values from data
                } , 
                emergencyContact:{
                    contactName: data?.emergency?.contactName || "",
                    relationship: data?.emergency?.relationship || "",
                    phone: data?.emergency?.phone || "",
                    isPrimary: data?.emergency?.isPrimary || 0,
                    patientId: data?.emergency?.patientId || 0,
                    emergencyContactId: data?.emergency?.emergencyContactId || 0,
                } , 
                patientPharmacy:{
                    pharmacyName: data?.pharmacy?.pharmacyName || "",
                    location: data?.pharmacy?.location || "",
                    phone: data?.pharmacy?.phone || "",
                    isPreferred: data?.pharmacy?.isPreferred || true,
                    patientId: data?.pharmacy?.patientId || 0,
                    patientPharmacyId: data?.pharmacy?.patientPharmacyId || 0,
                }
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
    useEffect(()=>{
        const patientId = new URLSearchParams(window.location.search).get("patientId")
        console.log("Patient ID from URL in useEffect:", patientId)
        if (patientId) {
            fetchFormData(patientId)
        } else {
            setIsLoading(false)
        }
    },[])

    // Add this function inside useFormData(), after fetchFormData

const submitFormData = async () => {
    if (!formData) {
        setError(new Error("No form data to submit"))
        return
    }
    try {
        setIsLoading(true)
        await postPatienForm(formData).unwrap()
    } catch (err) {
        setError(err as Error)
    } finally {
        setIsLoading(false)
    }
}

    

    return {formData, setFormData, isLoading, setIsLoading, error, setError , sectionMap , submitFormData}
}


export default useFormData