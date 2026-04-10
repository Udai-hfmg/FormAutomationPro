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


  const [patientId] = useSearchParams()

  console.log("Patient ID from URL:", patientId.get("patientId"))
  const patientIdParams = patientId.get("patientId")

  const { formData, error, isLoading, setFormData, submitFormData, handleInput } = useFormData()
  console.log("Data from useFormData hook:", error, isLoading)

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  return (
    <div>

      {/* EMAIL FETCH */}
      <Form1 formData={formData}
        setFormData={setFormData}
        handleInput={handleInput} />

      {/* ALL FORMS */}
      <NewPatientForm formData={formData}
        setFormData={setFormData}
        handleInput={handleInput} />
      <HIPAANotice
        formData={formData}
        setFormData={setFormData}
        handleInput={handleInput}   // optional
      />
      <HPVScreening patientData={formData} formData={formData} setFormData={setFormData} />
      <YourInsuranceCompany patientData={formData} formData={formData} setFormData={setFormData} />
      <PatientPaymentAgreement formData={formData} setFormData={setFormData} />
      <PaymentAndCollectionPolicy patientData={formData} formData={formData} setFormData={setFormData} />
      <PrivacyPracticesForm formData={formData} setFormData={setFormData} />

      {/* 🔥 ONE SUBMIT */}
      <div className="text-center p-10">
        {/* <button onClick={handleSubmit} className="bg-black text-white px-6 py-3">
          Submit All Forms
        </button> */}

      </div>

      <button className='px-4 py-2 bg-black text-white rounded-xl' onClick={() => submitFormData()}>Log Form Data</button>

    </div>
  )
}

export default Forms