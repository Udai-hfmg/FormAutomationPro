import React, { useEffect, useState } from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput, { type data } from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";

const HPVScreening = ({ formData, setFormData, handleInput }:data) => {

  console.log(formData)
  const handleNameChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, name: value }));
  };
  function HeaderTitles() {
    return (
      <>
        <div className="font-bold">Women's Health Division</div>
        <div>30 Hatfield Lane, Suite 105</div>
        <div>Goshen, NY 10924</div>
      </>
    );
  }

  return (
    <FormContainer>
      <HeaderImage headerContent={<HeaderTitles />} />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-6 sm:pb-10 text-xs sm:text-sm text-black bg-white">

        {/* Title */}
        <h2 className="text-center font-semibold my-6 underline tracking-wide">
          HPV SCREENING
        </h2>

        {/* Intro Paragraph */}
        <p className="text-justify leading-relaxed mb-4">
          The Health Care Providers of Horizon Women's Health Care have adopted the policy of{" "}
          <u>Permitting Routine Pap Smear Screening to include HPV Testing</u>. This policy has been adopted in accordance to current screening
          guidelines from our governing bodies. This expanded screening protocol enables Horizon to provide the most
          current and up to date medical care to our patients. It is certainly possible that your insurance carrier may not
          cover the added cost of the HPV screening. We feel strongly that the guidelines that have been established are in
          accordance with current and forthcoming recommendations. Therefore, if indeed you agree to have the HPV
          screening and this test is not covered by your insurance carrier, the payment to the lab will be your responsibility,
          and this test is not covered by your insurance carrier, the payment to the lab will be your responsibility.
        </p>

        {/* Screening Protocol */}
        <p className="leading-relaxed mb-2">Please be advised that this is our screening protocol:</p>

        <ul className="list-none ml-0 space-y-1 mb-4 leading-relaxed">
          <li>All women 30 and older will automatically be screened for HPV.</li>
          <li>All women not in the above group can request to be screened for HPV.</li>
        </ul>

        {/* Patient Rights */}
        <p className="text-justify leading-relaxed mb-6">
          Obviously, every patient has the right to direct their care and refuse the HPV screening. If you choose to do so, it is
          the patient's responsibility to notify the healthcare provider at the time of the visit. In addition, every patient is
          offered the test.
        </p>

        {/* Agreement Section */}
        <p className="font-semibold mb-2">Agreement:</p>
        <p className="text-justify leading-relaxed mb-8">
          I have been notified by my healthcare provider that my insurance carrier may deny payment for the above-
          mentioned HPV screening. If this occurs, I understand that payment is my responsibility. I agree to be personally
          and fully responsible for payment.
        </p>

        {/* Date / Name / Signature */}
        <div className="space-y-4 mt-4">

          {/* Date */}
          <div className="flex items-end gap-2 w-full sm:w-72">
            <label className="whitespace-nowrap">Date:</label>
            <LineInput type="date" name="updatedAt" value={formData?.newPatient?.updatedAt} onChange={(e) => handleInput(e, "newPatient")}/>
          </div>

          {/* Name */}
          <div className="flex items-end gap-2 w-full sm:w-96">
            <label className="whitespace-nowrap">Name:</label>
             <LineInput name="firstName" value={formData?.newPatient?.firstName} onChange={(e) => handleInput(e, "newPatient")}/>
          </div>

          {/* Signature */}
          <div className="flex items-end gap-2 w-full sm:w-96">
            <label className="whitespace-nowrap">Signature:</label>

           <SignatureField className="flex-1"   value={formData?.signature} onChange={(blob) => setFormData((prev: any) => ({ ...prev, signature: blob }))} />
          </div>

        </div>

      </div>
    </FormContainer>
  );
};

export default HPVScreening;