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
import type { PatientDto } from '../DTOs/Patient'
import useFormData from '../hooks/useFormData'
import Loading from '../components/Home/Loading'
import ErrorState from '../components/UI/ErrorState'


const Forms = () => {

  const { formData, error, isLoading, setFormData, submitFormData, handleInput , handleHipaaChange } = useFormData()

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  return (
    <div>

      {/* EMAIL FETCH */}
      <Form1  />

      {/* ALL FORMS */}
      <NewPatientForm />
      <HIPAANotice
         // optional
      />
      <HPVScreening />

      <YourInsuranceCompany  />

      <PatientPaymentAgreement  />

      <PaymentAndCollectionPolicy  />
        
      <PrivacyPracticesForm />

      {/* 🔥 ONE SUBMIT */}
      <div className="text-center p-10">
        {/* <button onClick={handleSubmit} className="bg-black text-white px-6 py-3">
          Submit All Forms
        </button> */}

      </div>

      <button className='px-4 py-2 bg-black text-white rounded-xl' onClick={() => submitFormData()}>Submit forms</button>

    </div>
  )
}

export default Forms