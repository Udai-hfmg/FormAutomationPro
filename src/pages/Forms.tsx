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
const [patientData,setPatientData]=useState(null)
// console.log(patientData)
  return (
    <div>
        <Form1 setPatientData={setPatientData}/>
        <NewPatientForm patientData={patientData}/>
        <HIPAANotice patientData={patientData}/>
        <HPVScreening patientData={patientData}/>
        <YourInsuranceCompany patientData={patientData}/>
        <PatientPaymentAgreement patientData={patientData}/>
        <PaymentAndCollectionPolicy patientData={patientData}/>
        <PrivacyPracticesForm patientData={patientData}/>
    </div>
  )
}

export default Forms