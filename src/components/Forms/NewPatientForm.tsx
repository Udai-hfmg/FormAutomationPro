import React, { useState, useEffect } from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";

import type { data } from "../Input/FormInput";

type LineInputProps = {
  className?: string;
  type?: "text" | "email" | "tel" | "date" | "number";
  name?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LineInput = ({ className = "", type, name, value, onChange }: LineInputProps) => (
  <input
    type={type || "text"}
    name={name}
    value={value ?? ""}
    onChange={onChange}
    className={`border-b border-black outline-none px-1 w-full ${className}`}
  />
);

const NewPatientForm = ({formData,setFormData,handleInput}:data) => {

console.log('formData in NewPatientForm', formData)

  return (

    <FormContainer>

      <HeaderImage />

      <div className="max-w-4xl mx-auto p-4 sm:p-8 text-xs sm:text-sm text-black">

        <h2 className="text-center font-semibold mb-6">
          PATIENT REGISTRATION FORM
        </h2>

        {/* NAME */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1 min-w-[200px]">
            <label>First Name</label>
            <LineInput name="firstName" value={formData?.newPatient?.firstName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 w-20">
            <label>M</label>
            <LineInput name="middleInitial" value={formData?.newPatient?.middleInitial} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1 min-w-[200px]">
            <label>Last Name</label>
            <LineInput name="lastName" value={formData?.newPatient?.lastName} onChange={handleInput}/>
          </div>

        </div>

        {/* ADDRESS */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Address</label>
            <LineInput name="addressLine1" value={formData?.newPatient?.addressLine1} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 w-24">
            <label>Apt#</label>
            <LineInput name="apt" value={formData?.patientDemographic?.ethnicity} onChange={handleInput}/>
          </div>

        </div>

        {/* CITY STATE ZIP */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>City</label>
            <LineInput name="city" value={formData?.newPatient?.city} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>State</label>
            <LineInput name="state" value={formData?.newPatient?.state} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Zip Code</label>
            <LineInput name="zipCode" value={formData?.newPatient?.zipCode} onChange={handleInput}/>
          </div>

        </div>

        {/* SSN DOB */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2">
            <label>SS#</label>
            <LineInput name="ssnLast4" value={formData?.newPatient?.ssnLast4} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2">
            <label>Date of Birth</label>
            <LineInput type="date" name="dateOfBirth" value={formData?.newPatient?.dateOfBirth} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2">
            <label>Sex</label>
            <LineInput name="sex" value={formData?.newPatient?.sex} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2">
            <label>Marital Status</label>
            <LineInput name="maritalStatus" value={formData?.newPatient?.maritalStatus} onChange={handleInput}/>
          </div>

        </div>

        {/* PHONES */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Phone#</label>
            <LineInput name="phonePrimary" value={formData?.newPatient?.phonePrimary} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Alternative Phone#</label>
            <LineInput name="phoneAlternate" value={formData?.newPatient?.phoneAlternate} onChange={handleInput}/>
          </div>

        </div>

        {/* EMERGENCY */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Emergency Contact</label>
            <LineInput name="contactName" value={formData?.emergencyContact?.contactName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Phone#</label>
            <LineInput name="phone" value={formData?.emergencyContact?.phone} onChange={handleInput}/>
          </div>

        </div>

        {/* CLINICIAN */}

        <div className="flex items-end gap-2 mb-4">
          <label>Please list your primary care clinician:</label>
          <LineInput name="primaryClinician" value={formData?.patientPharmacy?.pharmacyName} onChange={handleInput}/>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <label>Please list any other providers involved in your care:</label>
          <LineInput name="otherProviders" value={formData?.patientPharmacy?.pharmacyName} onChange={handleInput}/>
        </div>

        {/* PHARMACY */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Pharmacy</label>
            <LineInput name="pharmacyName" value={formData?.patientPharmacy?.pharmacyName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Location</label>
            <LineInput name="pharmacyLocation" value={formData?.patientPharmacy?.location} onChange={handleInput}/>
          </div>

        </div>

        {/* DEMOGRAPHICS */}

        <p className="mb-2">
          New Government regulations require medical offices to ask the following questions:
        </p>

        <div className="flex flex-wrap gap-4 mb-6">

          <div className="flex items-end gap-2 flex-1">
            <label>Language</label>
            <LineInput name="language" value={formData?.patientDemographic?.language} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Race</label>
            <LineInput name="race" value={formData?.patientDemographic?.race} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Ethnicity</label>
            <LineInput name="ethnicity" value={formData?.patientDemographic?.ethnicity} onChange={handleInput}/>
          </div>

        </div>

        {/* EMPLOYER */}

        <h3 className="font-semibold mb-2">PATIENT EMPLOYER:</h3>

        <div className="flex items-end gap-2 mb-4">
          <label>Occupation</label>
          <LineInput name="occupation" value={formData?.patientEmployment?.occupation} onChange={handleInput}/>
        </div>

        <div className="flex items-end gap-2 mb-6">
          <label>Company Name & Address</label>
          <LineInput name="employerAddress" value={formData?.patientEmployment?.employerAddress} onChange={handleInput}/>
        </div>

        {/* INSURANCE */}

        <h3 className="font-semibold mb-2">MEDICAL INSURANCE INFORMATION</h3>

        <div className="flex flex-wrap gap-4 mb-6">

          <div className="flex items-end gap-2 flex-1">
            <label>Primary Insurance</label>
            <LineInput name="payerName" value={formData?.insurance?.payerName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Secondary Insurance</label>
            <LineInput name="secondaryInsurance" value={formData?.insurance?.insurancePlanId} onChange={handleInput}/>
          </div>

        </div>

        {/* SELF PAY */}

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            name="selfPay"
            checked={false}
            onChange={handleInput}
          />
          <label>Self Pay</label>
        </div>

        {/* SIGNATURE */}

        <div className="flex flex-wrap gap-6 items-end">

          <div className="flex items-end gap-2 flex-1">
            <label>SIGNATURE</label>
            {/* <SignatureField
              className="flex-1"
              onChange={(dataUrl)=>
                setFormData((prev:any)=>({
                  ...prev,
                  signature:dataUrl
                }))
              }
            /> */}
          </div>

          <div className="flex items-end gap-2 w-48">
            <label>DATE</label>
            <LineInput type="date" name="signatureDate" value={""} onChange={handleInput}/>
          </div>

        </div>
      </div>

    </FormContainer>
  );
};

export default NewPatientForm;




