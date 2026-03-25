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

import React, { useState } from 'react'
import Form1 from '../components/Forms/Form1'
import NewPatientForm from '../components/Forms/NewPatientForm'
import HIPAANotice from '../components/Forms/HIPPANotice'
import HPVScreening from '../components/Forms/HPVScreening'
import YourInsuranceCompany from '../components/Forms/YourInsuranceCompany'
import PatientPaymentAgreement from '../components/Forms/PatientPaymentAgreement'
import PaymentAndCollectionPolicy from '../components/Forms/PaymentAndCollectionPolicy'
import PrivacyPracticesForm from '../components/Forms/PrivacyPracticesForm'

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