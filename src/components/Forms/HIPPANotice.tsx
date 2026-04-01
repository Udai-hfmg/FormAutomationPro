import React from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput, { type data } from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";
import useFormData from "../../hooks/useFormData";




const HIPAANotice = ({ formData, setFormData, handleInput }:data) => {

  // const {formData , setFormData , handleInput} = useFormData()

  const handleRadioChange = (field: string, value: "yes" | "no") => {
    console.log("RADIOS:", formData?.radios);
  setFormData((prev: any) => ({
    ...prev,
    radios: {
      ...(prev.radios || {}) ,
      [field]: value
    }
  }));
};


 

  // ── Reusable Yes/No radio pair — untouched ────────────────────────────────
  const RadioPair = ({ field }: { field: string }) => (
    <div className="flex gap-2 shrink-0">
      <input
        type="radio"
        name={field}
        checked={formData?.radios?.[field] === "yes"}
        onChange={() => handleRadioChange(field, "yes")}
        className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"
      />
      <input
        type="radio"
        name={field}
        checked={formData?.radios?.[field] === "no"}
        onChange={() => handleRadioChange(field, "no")}
        className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"
      />
    </div>
  );

  return (
    <FormContainer>
      <HeaderImage />

      <div className="max-w-4xl mx-auto p-4 sm:p-8 text-xs sm:text-sm text-black">

        {/* Title */}
        <div className="text-center mb-6">
          <p className="font-semibold">Horizon Family Medical Group</p>
          <h2 className="font-bold underline tracking-wide">
            HIPAA NOTICE OF PRIVACY PRACTICES
          </h2>
        </div>

        {/* Column headers */}
        <div className="flex items-center mb-3">
          <span className="w-8 text-center font-semibold">Yes</span>
          <span className="w-8 text-center font-semibold ml-2">No</span>
        </div>

        {/* Row 1 — updated text */}
        <div className="flex items-start mb-4">
          <RadioPair field="HIPAA_COPY_OFFERED" />
          <p className="flex-1 ml-4">
            I have been offered a copy of the Privacy Notice (last page of packet).
          </p>
        </div>

        {/* Row 2 — updated text */}
        <div className="flex items-start mb-4">
          <RadioPair field="HIPAA_COPY_STATUS" />
          <p className="flex-1 ml-4">
            I have requested/received/declined a copy of the Privacy Notice.{" "}
            <span className="italic">(circle one)</span>
          </p>
        </div>

        {/* Row 3 */}
        <div className="flex items-start mb-4">
         <RadioPair field="HIPAA_READ_NOTICE" />
          <p className="flex-1 ml-4">I have read the Privacy Notice.</p>
        </div>

        {/* Row 4 — updated text */}
        <div className="flex items-start mb-4">
          <RadioPair field="HIPAA_PRESCRIPTION_ALLOWED" />
          <p className="flex-1 ml-4">
            I give permission for Horizon Family Medical Group to obtain prescription information
            electronically from any physician, pharmacy, or insurance company.
          </p>
        </div>

        {/* Row 5 — Family members */}
        <div className="flex items-start mb-2">
          <RadioPair field="HIPAA_FAMILY_ALLOWED" />

          <div className="flex-1 ml-4">
            <p className="mb-1">I give permission to leave information with my family member(s)</p>
            {/* ADDED: label matching paper form */}
            <p className="mb-2 text-xs text-gray-700">Name of family member(s) and their relation:</p>

            {/* 3 rows — separate inputs */}
            <div className="space-y-2">
              {formData?.hipaa?.map((item:any) => (
                <div key={item.hipaaFamilyMemberId} className="flex gap-3">
                  <LineInput
                  name="familyMemberName"
                    className="flex-1"
                    placeholder="Full name"
                    value={item.familyMemberName}
                    onChange={handleInput}
                    
                  />
                  <LineInput
                  name="relationship"
                    className="flex-1"
                    placeholder="Relationship"
                    value={item.relationship}
                   onChange={handleInput}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ADDED: "I acknowledge receipt of this notice" section ── */}
        <div className="mt-10">
          <p className="font-semibold mb-4">I acknowledge receipt of this notice:</p>

          {/* Name + Date on SAME LINE — matches paper form */}
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div className="flex items-end gap-2 flex-1 min-w-[180px]">
              <label className="shrink-0">Name:</label>
              <LineInput
                className="flex-1"
                value={`${formData?.newPatient.firstName} ${formData?.newPatient.lastName}`}
                onChange={handleInput}
              />
            </div>
            <div className="flex items-end gap-2 w-52">
              <label className="shrink-0">Date:</label>
              <LineInput
                type="date"
                className="flex-1"
                value={formData?.newPatient?.date || ""}
               onChange={handleInput}
              />
            </div>
          </div>

          {/* Signature */}
          <div className="flex gap-4 items-start">
            <label className="shrink-0 pt-1">Signature:</label>
            <SignatureField
              className="flex-1"
              onChange={(dataUrl: string | null) =>
                setFormData((prev: any) => ({
                  ...prev,
                  signature: dataUrl,
                }))
              }
            />
          </div>
        </div>

        {/* ── ADDED: "If signing as patient's representative" section ── */}
        {/* <div className="mt-8 pt-4 border-t border-gray-300">
          <p className="font-semibold mb-4">
            If you are signing as the patient's representative:
          </p>

          Representative Name
          <div className="flex items-end gap-2 mb-4">
            <label className="shrink-0">Name:</label>
            <LineInput
              className="flex-1"
              value={formData.representativeName ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleRepresentativeNameChange(e.target.value)
              }
            />
          </div>

          {/* Describe your authority */}
          {/* <div className="flex items-end gap-2">
            <label className="shrink-0 whitespace-nowrap">Describe your authority:</label>
            <LineInput
              className="flex-1"
              value={formData.representativeAuthority ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleRepresentativeAuthorityChange(e.target.value)
              }
            />
          </div> */}
        {/* </div>  */}

      </div>
    </FormContainer>
  );
};

export default HIPAANotice;