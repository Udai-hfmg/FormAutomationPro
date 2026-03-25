import React, { useState, useEffect } from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";

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

const NewPatientForm = ({ patientData }: PatientData) => {

  const [formData, setFormData] = useState<any>({});

  /* LOAD DATA FROM BACKEND */

  useEffect(() => {

    if (!patientData) return;

    setFormData({

      /* PATIENT */

      firstName: patientData?.patient?.firstName || "",
      middleInitial: patientData?.patient?.middleInitial || "",
      lastName: patientData?.patient?.lastName || "",
      addressLine1: patientData?.patient?.addressLine1 || "",
      city: patientData?.patient?.city || "",
      state: patientData?.patient?.state || "",
      zipCode: patientData?.patient?.zipCode || "",
      ssN_Last4: patientData?.patient?.ssN_Last4 || "",
      dateOfBirth: patientData?.patient?.dateOfBirth?.split("T")[0] || "",
      sex: patientData?.patient?.sex || "",
      maritalStatus: patientData?.patient?.maritalStatus || "",
      phonePrimary: patientData?.patient?.phonePrimary || "",
      phoneAlternate: patientData?.patient?.phoneAlternate || "",

      /* EMERGENCY */

      contactName: patientData?.emergency?.contactName || "",
      contactPhone: patientData?.emergency?.phone || "",
      relationship: patientData?.emergency?.relationship || "",

      /* PHARMACY */

      pharmacyName: patientData?.pharmacy?.pharmacyName || "",
      pharmacyLocation: patientData?.pharmacy?.location || "",
      pharmacyPhone: patientData?.pharmacy?.phone || "",

      /* DEMOGRAPHICS */

      language: patientData?.demographics?.language || "",
      race: patientData?.demographics?.race || "",
      ethnicity: patientData?.demographics?.ethnicity || "",

      /* EMPLOYER */

      occupation: patientData?.employer?.occupation || "",
      employerName: patientData?.employer?.employerName || "",
      employerAddress: patientData?.employer?.employerAddress || "",

      /* INSURANCE */

      payerName: patientData?.insurance?.payerName || "",
      planName: patientData?.insurance?.planName || "",

      /* HIPAA */

      hipaaFamilyMember:
        patientData?.hippa?.length > 0
          ? patientData.hippa[0].familyMemberName
          : "",

      hipaaRelationship:
        patientData?.hippa?.length > 0
          ? patientData.hippa[0].relationship
          : "",

      primaryClinician: "",
      otherProviders: "",
      secondaryInsurance: "",
      selfPay: false,

      signature: "",
      signatureDate: ""

    });

  }, [patientData]);

  /* INPUT HANDLER */

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const handleSubmit = () => {

    console.log("Updated Patient Data:", formData);

  };

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
            <LineInput name="firstName" value={formData.firstName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 w-20">
            <label>M</label>
            <LineInput name="middleInitial" value={formData.middleInitial} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1 min-w-[200px]">
            <label>Last Name</label>
            <LineInput name="lastName" value={formData.lastName} onChange={handleInput}/>
          </div>

        </div>

        {/* ADDRESS */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Address</label>
            <LineInput name="addressLine1" value={formData.addressLine1} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 w-24">
            <label>Apt#</label>
            <LineInput name="apt" value={formData.apt} onChange={handleInput}/>
          </div>

        </div>

        {/* CITY STATE ZIP */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>City</label>
            <LineInput name="city" value={formData.city} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>State</label>
            <LineInput name="state" value={formData.state} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Zip Code</label>
            <LineInput name="zipCode" value={formData.zipCode} onChange={handleInput}/>
          </div>

        </div>

        {/* SSN DOB */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2">
            <label>SS#</label>
            <LineInput name="ssN_Last4" value={formData.ssN_Last4} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2">
            <label>Date of Birth</label>
            <LineInput type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2">
            <label>Sex</label>
            <LineInput name="sex" value={formData.sex} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2">
            <label>Marital Status</label>
            <LineInput name="maritalStatus" value={formData.maritalStatus} onChange={handleInput}/>
          </div>

        </div>

        {/* PHONES */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Phone#</label>
            <LineInput name="phonePrimary" value={formData.phonePrimary} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Alternative Phone#</label>
            <LineInput name="phoneAlternate" value={formData.phoneAlternate} onChange={handleInput}/>
          </div>

        </div>

        {/* EMERGENCY */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Emergency Contact</label>
            <LineInput name="contactName" value={formData.contactName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Phone#</label>
            <LineInput name="contactPhone" value={formData.contactPhone} onChange={handleInput}/>
          </div>

        </div>

        {/* CLINICIAN */}

        <div className="flex items-end gap-2 mb-4">
          <label>Please list your primary care clinician:</label>
          <LineInput name="primaryClinician" value={formData.primaryClinician} onChange={handleInput}/>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <label>Please list any other providers involved in your care:</label>
          <LineInput name="otherProviders" value={formData.otherProviders} onChange={handleInput}/>
        </div>

        {/* PHARMACY */}

        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-end gap-2 flex-1">
            <label>Pharmacy</label>
            <LineInput name="pharmacyName" value={formData.pharmacyName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Location</label>
            <LineInput name="pharmacyLocation" value={formData.pharmacyLocation} onChange={handleInput}/>
          </div>

        </div>

        {/* DEMOGRAPHICS */}

        <p className="mb-2">
          New Government regulations require medical offices to ask the following questions:
        </p>

        <div className="flex flex-wrap gap-4 mb-6">

          <div className="flex items-end gap-2 flex-1">
            <label>Language</label>
            <LineInput name="language" value={formData.language} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Race</label>
            <LineInput name="race" value={formData.race} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Ethnicity</label>
            <LineInput name="ethnicity" value={formData.ethnicity} onChange={handleInput}/>
          </div>

        </div>

        {/* EMPLOYER */}

        <h3 className="font-semibold mb-2">PATIENT EMPLOYER:</h3>

        <div className="flex items-end gap-2 mb-4">
          <label>Occupation</label>
          <LineInput name="occupation" value={formData.occupation} onChange={handleInput}/>
        </div>

        <div className="flex items-end gap-2 mb-6">
          <label>Company Name & Address</label>
          <LineInput name="employerAddress" value={formData.employerAddress} onChange={handleInput}/>
        </div>

        {/* INSURANCE */}

        <h3 className="font-semibold mb-2">MEDICAL INSURANCE INFORMATION</h3>

        <div className="flex flex-wrap gap-4 mb-6">

          <div className="flex items-end gap-2 flex-1">
            <label>Primary Insurance</label>
            <LineInput name="payerName" value={formData.payerName} onChange={handleInput}/>
          </div>

          <div className="flex items-end gap-2 flex-1">
            <label>Secondary Insurance</label>
            <LineInput name="secondaryInsurance" value={formData.secondaryInsurance} onChange={handleInput}/>
          </div>

        </div>

        {/* SELF PAY */}

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            name="selfPay"
            checked={formData.selfPay || false}
            onChange={handleInput}
          />
          <label>Self Pay</label>
        </div>

        {/* SIGNATURE */}

        <div className="flex flex-wrap gap-6 items-end">

          <div className="flex items-end gap-2 flex-1">
            <label>SIGNATURE</label>
            <SignatureField
              className="flex-1"
              onChange={(dataUrl)=>
                setFormData((prev:any)=>({
                  ...prev,
                  signature:dataUrl
                }))
              }
            />
          </div>

          <div className="flex items-end gap-2 w-48">
            <label>DATE</label>
            <LineInput type="date" name="signatureDate" value={formData.signatureDate} onChange={handleInput}/>
          </div>

        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Submit
          </button>
        </div>

      </div>

    </FormContainer>
  );
};

export default NewPatientForm;