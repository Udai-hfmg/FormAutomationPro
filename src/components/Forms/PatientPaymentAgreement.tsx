import React from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput, { type data } from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";
import useFormData from "../../hooks/useFormData";


const PatientPaymentAgreement = () => {

  const { formData, error, isLoading, setFormData, submitFormData, handleInput , handleHipaaChange } = useFormData()

  return (
    <FormContainer>
      <HeaderImage />

      <div className="max-w-4xl mx-auto p-6 sm:p-10 text-xs sm:text-sm text-black bg-white">

        {/* Title */}
        <h2 className="text-center font-semibold mb-1">
          Patient Payment Agreement and Health Insurance Waiver
        </h2>

        <p className="text-center mb-6">
          Please read the payment policy and <u><strong>initial</strong></u> before each numbered item and sign below.
        </p>

        {/* Sections — grid: [input col] [text col], text wraps only within its column */}
        <div className="space-y-5">

          {/* 1 */}
          <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-2">
            <div className="pt-0.5">
              <LineInput className="w-full" name="initials"  value={formData?.newPatient?.initials} onChange={(e) => handleInput(e, "newPatient")} />
            </div>
            <p className="text-justify leading-relaxed col-start-2">
              <strong>1. Insurance:</strong> All patients must complete our patient information form before seeing the provider. You
              must provide a copy of your driver's license and proof of currently valid health insurance. If you are not insured by
              a plan we participate with, payment in full is required at the time services are rendered. If you fail to provide us
              with the correct health insurance information in a timely manner, you will be responsible for the entire fee.
              Knowing your health insurance benefits (coverage) is your responsibility. Please contact your health insurance
              company with any questions you may have regarding your coverage.
            </p>
          </div>

          {/* 2 */}
          <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-2">
            <div className="pt-0.5">
              <LineInput className="w-full" name="initials" value={formData?.newPatient?.initials} onChange={(e) => handleInput(e, "newPatient")} />
            </div>
            <p className="text-justify leading-relaxed col-start-2">
              <strong>2. Co-payments and deductibles:</strong> All co-payments and deductibles must be paid at the time of service.
              The amounts of co-payments and deductibles are mandates by your health insurance company. Failure to pay your
              co-payments at the time of service, will result in a $15.00 additional charge. Any co-payments and/or deductibles
              that are unknown or undisclosed at the date of service shall be billed to patient when known. Payment of said
              amounts shall be due from patient upon receipt of bill.
            </p>
          </div>

          {/* 3 */}
          <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-2">
            <div className="pt-0.5">  
              <LineInput className="w-full" name="initials" value={formData?.newPatient?.initials} onChange={(e) => handleInput(e, "newPatient")} />
            </div>
            <p className="text-justify leading-relaxed col-start-2">
              <strong>3. Non-covered services:</strong> Please be aware that some and perhaps all of the services you receive may not
              be covered by your health insurance. You must pay for these services in full at the time of visit.
            </p>
          </div>

          {/* 4 */}
          <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-2">
            <div className="pt-0.5">
              <LineInput className="w-full" name="initials" value={formData?.newPatient?.initials} onChange={(e) => handleInput(e, "newPatient")} /> 
            </div>
            <p className="text-justify leading-relaxed col-start-2">
              <strong>4. Nonpayment:</strong> If your account if 60 days past due, you must make payment in full or make acceptable
              payment arrangements in order to continue as a patient and avoid collection activities. Please contact our office to
              make payment arrangements. In the event that any bill for medical services has not been paid within sixty (60)
              days from the billing data, you will be responsible for all legal and collection fees together with interest at the rate
              of 1.5% monthly. Horizon reserves the right to refer your account to a collection agency and/or discharge you as a
              patient if a balance remains unpaid without an acceptable payment arrangement.
            </p>
          </div>

          {/* 5 */}
          <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-2">
                        <div className="pt-0.5">
                          <LineInput className="w-full" name="initials" value={formData?.newPatient?.initials} onChange={(e) => handleInput(e, "newPatient")} />
            </div>
            <p className="text-justify leading-relaxed col-start-2">
              <strong>5. Missed appointments:</strong> Our policy is to charge $75.00 for missed appointments that are not canceled
              prior to 24 hours of your appointment time and $100.00 for missed procedures. These charges will be your
              responsibility and billed directly to you. Please help us to serve you better by keeping your regularly scheduled
              appointments.
            </p>
          </div>

        </div>

        {/* Final Statements */}
        <div className="mt-6 space-y-4 text-justify leading-relaxed">
          <p>
            I acknowledge and confirm that Horizon Medical Group, P.C. is agreeing to provide medical services to me in
            reliance on the contents and agreements in this Patient Payment Agreement and Health Insurance Waiver.
          </p>
          <p>
            I have read and understand the payment policy and agree to comply with its provisions.
          </p>
        </div>

        {/* Signature Row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-10">
          <div className="flex items-end gap-2 w-full">
            <label className="whitespace-nowrap text-xs sm:text-sm">Signature of patient or responsible party</label>
             <SignatureField className="flex-1" value={formData?.signature} onChange={(blob) => setFormData((prev: any) => ({ ...prev, signature: blob }))} />
          </div>
          <div className="flex items-end gap-2 w-full sm:w-56">
            <label className="whitespace-nowrap text-xs sm:text-sm">Date</label>
            <LineInput type="date" name="updatedAt" value={formData?.newPatient?.updatedAt} onChange={(e) => handleInput(e, "newPatient")}/>
          </div>
        </div>
           
      </div>
    </FormContainer>
  );
};

export default PatientPaymentAgreement;
