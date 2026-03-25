// import React, { useState } from 'react'
// import Form1 from '../components/Forms/Form1'
// import NewPatientForm from '../components/Forms/NewPatientForm'
// import HIPAANotice from '../components/Forms/HIPPANotice'
// import HPVScreening from '../components/Forms/HPVScreening'
// import YourInsuranceCompany from '../components/Forms/YourInsuranceCompany'
// import PatientPaymentAgreement from '../components/Forms/PatientPaymentAgreement'
// import PaymentAndCollectionPolicy from '../components/Forms/PaymentAndCollectionPolicy'
// import PrivacyPracticesForm from '../components/Forms/PrivacyPracticesForm'

// const Forms = () => {
// const [patientData,setPatientData]=useState(null)
// // console.log(patientData)
//   return (
//     <div>
//         <Form1 setPatientData={setPatientData}/>
//         <NewPatientForm patientData={patientData}/>
//         <HIPAANotice patientData={patientData}/>
//         <HPVScreening patientData={patientData}/>
//         <YourInsuranceCompany patientData={patientData}/>
//         <PatientPaymentAgreement patientData={patientData}/>
//         <PaymentAndCollectionPolicy patientData={patientData}/>
//         <PrivacyPracticesForm patientData={patientData}/>
//     </div>
//   )
// }

// export default Forms

import React, { useEffect, useState } from 'react'
import Form1 from '../components/Forms/Form1'
import NewPatientForm from '../components/Forms/NewPatientForm'
import HIPAANotice from '../components/Forms/HIPPANotice'
import HPVScreening from '../components/Forms/HPVScreening'
import YourInsuranceCompany from '../components/Forms/YourInsuranceCompany'
import PatientPaymentAgreement from '../components/Forms/PatientPaymentAgreement'
import PaymentAndCollectionPolicy from '../components/Forms/PaymentAndCollectionPolicy'
import PrivacyPracticesForm from '../components/Forms/PrivacyPracticesForm'
import { useSearchParams } from 'react-router'

const Forms = () => {

  const [patientData, setPatientData] = useState<any>(null)

  const [formData, setFormData] = useState<any>({
    newPatient: {},
    hipaa: {},
    hpv: {},
    insurance: {},
    paymentAgreement: {},
    paymentPolicy: {},
    privacy: {}
  })

   const [patientId] = useSearchParams()

    console.log("Patient ID from URL:", patientId.get("patientId"))
    const patientIdParams = patientId.get("patientId")

    const getDetails=async()=>{
        try{
            if(patientIdParams){
            const response=await fetch(`https://localhost:7057/api/Patient/${patientIdParams}`)
            const data=await response.json()
            setPatientData(data)

//         // ✅ VERY IMPORTANT → fill ALL FORMS DATA
        setFormData({
          newPatient: {
            firstName: data?.patient?.firstName || "",
            middleInitial: data?.patient?.middleInitial || "",
            lastName: data?.patient?.lastName || "",
            addressLine1: data?.patient?.addressLine1 || "",
            city: data?.patient?.city || "",
            state: data?.patient?.state || "",
            zipCode: data?.patient?.zipCode || "",
            ssN_Last4: data?.patient?.ssN_Last4 || "",
            dateOfBirth: data?.patient?.dateOfBirth?.split("T")[0] || "",
            sex: data?.patient?.sex || "",
            maritalStatus: data?.patient?.maritalStatus || "",
            phonePrimary: data?.patient?.phonePrimary || "",
            phoneAlternate: data?.patient?.phoneAlternate || "",

            contactName: data?.emergency?.contactName || "",
            contactPhone: data?.emergency?.phone || "",
            relationship: data?.emergency?.relationship || "",

            pharmacyName: data?.pharmacy?.pharmacyName || "",
            pharmacyLocation: data?.pharmacy?.location || "",
            pharmacyPhone: data?.pharmacy?.phone || "",

            language: data?.demographics?.language || "",
            race: data?.demographics?.race || "",
            ethnicity: data?.demographics?.ethnicity || "",

            occupation: data?.employer?.occupation || "",
            employerName: data?.employer?.employerName || "",
            employerAddress: data?.employer?.employerAddress || "",

            payerName: data?.insurance?.payerName || "",
            planName: data?.insurance?.planName || "",

            emergencyContact:data?.emergency?.contactName || "",
            emergencyphone:data?.emergency?.phone || "",

            hipaaFamilyMember:
              data?.hippa?.length > 0 ? data.hippa[0].familyMemberName : "",
            hipaaRelationship:
              data?.hippa?.length > 0 ? data.hippa[0].relationship : "",

            primaryClinician: "",
            otherProviders: "",
            secondaryInsurance: "",
            selfPay: false,

            signature: "",
            signatureDate: ""
          },

          hipaa: 
            data?.hippa || []
,

          hpv: {
            // map hpv fields if available
          },

          insurance: {
            ...data?.insurance
          },

          paymentAgreement: {},

          paymentPolicy: {},

          privacy: {}
        })
            }
        }
        catch(e){
            console.error("Error fetching patient data:", e);
        }

       
    }

     useEffect(() => {
            getDetails()
        }, [])

  // 🔥 FINAL SUBMIT
  const handleSubmit = async () => {
    try {
      console.log("FINAL DATA:", formData)

      const res = await fetch("https://localhost:7057/api/submitAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      console.log("Response:", data)

    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>

      {/* EMAIL FETCH */}
      <Form1 setPatientData={setPatientData} setFormData={setFormData}/>

      {/* ALL FORMS */}
      <NewPatientForm patientData={patientData} formData={formData} setFormData={setFormData}/>
      <HIPAANotice patientData={patientData} formData={formData} setFormData={setFormData}/>
      <HPVScreening patientData={patientData} formData={formData} setFormData={setFormData}/>
      <YourInsuranceCompany patientData={patientData} formData={formData} setFormData={setFormData}/>
      <PatientPaymentAgreement formData={formData} setFormData={setFormData}/>
      <PaymentAndCollectionPolicy patientData={patientData} formData={formData} setFormData={setFormData}/>
      <PrivacyPracticesForm formData={formData} setFormData={setFormData}/>

      {/* 🔥 ONE SUBMIT */}
      <div className="text-center p-10">
        <button onClick={handleSubmit} className="bg-black text-white px-6 py-3">
          Submit All Forms
        </button>
        
      </div>

    </div>
  )
}

export default Forms