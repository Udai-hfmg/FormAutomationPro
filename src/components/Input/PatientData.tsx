import type React from "react"
import type { FinalFormData } from "../../hooks/useFormData"

 export type PatientDataProps={
    setPatientData:React.Dispatch<React.SetStateAction<any>>
    setFormData: React.Dispatch<React.SetStateAction<any>>
}

export type PatientData={
    patientData?: any
    formData?: FinalFormData | null
    setFormData: React.Dispatch<React.SetStateAction<any>>
}
