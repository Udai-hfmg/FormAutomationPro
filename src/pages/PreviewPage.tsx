import React from 'react'
import Form1 from '../components/Forms/Form1'
import NewPatientForm from '../components/Forms/NewPatientForm'
import HIPAANotice from '../components/Forms/HIPPANotice'
import HPVScreening from '../components/Forms/HPVScreening'
import YourInsuranceCompany from '../components/Forms/YourInsuranceCompany'
import PaymentAndCollectionPolicy from '../components/Forms/PaymentAndCollectionPolicy'
import PatientPaymentAgreement from '../components/Forms/PatientPaymentAgreement'
import PrivacyPracticesForm from '../components/Forms/PrivacyPracticesForm'
import useFormData from '../hooks/useFormData'

const previewPage = () => {

     const {formData, error , isLoading, setFormData , submitFormData } = useFormData()
        console.log("Data from useFormData hook:", error, isLoading)
  return (<>
     <Form1 />
        
      {/* ALL FORMS */}
      <NewPatientForm />
      <HIPAANotice /> 
      <HPVScreening patientData={formData} formData={formData} setFormData={setFormData}/>
      <YourInsuranceCompany patientData={formData} formData={formData} setFormData={setFormData}/>
      <PatientPaymentAgreement formData={formData} setFormData={setFormData}/>
      <PaymentAndCollectionPolicy patientData={formData} formData={formData} setFormData={setFormData}/>
      <PrivacyPracticesForm formData={formData} setFormData={setFormData}/> 

      {/* 🔥 ONE SUBMIT */}
      
    
    </>
  )
}

export default previewPage