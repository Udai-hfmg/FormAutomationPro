import React, { useEffect, useState } from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput, { type data } from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";
import useFormData from "../../hooks/useFormData";

const YourInsuranceCompany = () => {

  const { formData, error, isLoading, setFormData, submitFormData, handleInput , handleHipaaChange } = useFormData()

  return (
    <FormContainer>
      <HeaderImage />

      <div className="max-w-4xl mx-auto p-6 sm:p-10 text-xs sm:text-sm text-black bg-white">

        {/* Title */}
        <h2 className="text-center font-semibold mb-6 underline">
          YOUR INSURANCE COMPANY
        </h2>

        {/* Intro Paragraph */}
        <p className="text-justify leading-relaxed mb-4">
          In the past few years, the number of different health insurance programs has increased at an amazing
          rate. Even within one company, there may be several programs with varying benefits and requirements.
          There is no way that we can possibly know, or keep up-to-date with, each program's provisions.
        </p>

        {/* Bullet Points */}
        <ul className="list-disc list-outside ml-6 space-y-1 mb-4 leading-relaxed">
          <li>Some programs require that a specific facility be used for your diagnostic imaging or tests.</li>
          <li>Some programs require pre-authorization, while others do not.</li>
          <li>Some insurance companies require patients to notify them of hospital admissions or trips to the emergency room.</li>
          <li>Some programs require specific information regarding hospitalizations.</li>
        </ul>

        {/* Responsibility Section */}
        <p className="leading-relaxed mb-2">It is your responsibility to know:</p>

        <ol className="list-none ml-0 space-y-3 mb-4 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[1.5rem]">1.</span>
            <span>Whether this office is participating with your particular plan and program</span>
          </li>
        </ol>

        <p className="font-semibold mb-2">AND</p>

        <ol className="list-none ml-0 space-y-3 mb-6 leading-relaxed" start={2}>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[1.5rem]">2.</span>
            <span>
              To advise this office of your program's requirements in advance, each and every time we
              provide a service. We will do our very best to comply with any reasonable requirements that
              your program may have.
            </span>
          </li>
        </ol>

        {/* Disclaimer Paragraphs */}
        <p className="text-justify leading-relaxed mb-4">
          Please understand that if we have not been advised in advance of your program's requirements or
          conditions and we provide a service or use laboratory that is outside the program, then you will be
          responsible for the appropriate fees.
        </p>

        <p className="text-justify leading-relaxed mb-4">
          In addition, there are times that we may not be able to obtain a consultant or laboratory that is
          participating with your program. It will be up to you to work this out with your insurance company.
        </p>

        <p className="text-justify leading-relaxed mb-6">
          These are not our regulations; they are your insurance company's regulations and unless you follow
          them carefully, the insurance company may decline all or part of your claim. Your insurance carrier
          should have provided you with a phone number for you to use if you have any questions about
          coverage.
        </p>

        {/* Acknowledgement */}
        <p className="leading-relaxed mb-6">
          I acknowledge receipt of this information.
        </p>

        {/* Signature Row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-4">

          <div className="flex items-end gap-2 w-full">
            <label className="whitespace-nowrap">Signature:</label>

          <SignatureField className="flex-1"   value={typeof formData?.signature === 'string' ? null : formData?.signature} onChange={(blob) => setFormData((prev: any) => ({ ...prev, signature: blob }))} />
            

          </div>

          <div className="flex items-end gap-2 w-full sm:w-56">
            <label className="whitespace-nowrap">Date:</label>

            <LineInput type="date" name="updatedAt" value={formData?.newPatient?.updatedAt} onChange={(e) => handleInput(e, "newPatient")}/>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-xs italic">
          Horizon Medical Group, P.C.
        </p>

      </div>
    </FormContainer>
  );
};

export default YourInsuranceCompany;