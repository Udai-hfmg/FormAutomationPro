import React from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";

const HIPAANotice = ({ patientData, formData, setFormData }: PatientData) => {

  const patient = patientData?.patient || {};

  const data: any[] = Array.isArray(formData.hipaa)
    ? formData.hipaa
    : Object.values(formData.hipaa || {});

  // Always render exactly 3 rows
  const rows = [0, 1, 2].map((i) => ({
    familyMemberName: data[i]?.familyMemberName ?? "",
    relationship: data[i]?.relationship ?? data[i]?.relationship ?? "",
  }));

  // ── Existing handlers — untouched ─────────────────────────────────────────
  const handleFieldChange = (
    index: number,
    field: "familyMemberName" | "relationship",
    value: string
  ) => {
    const updated = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    const normalized = updated.map((row) => ({
      familyMemberName: row.familyMemberName,
      relationship: row.relationship,
    }));
    setFormData((prev: any) => ({
      ...prev,
      hipaa: normalized,
    }));
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      radios: {
        ...prev.radios,
        [field]: value,
      },
    }));
  };

  const handleNameChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, name: value }));
  };

  const handleDateChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, date: value }));
  };

  // ── NEW handlers for missing fields — stored in hipaa ────────────────────
  const handleRepresentativeNameChange = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      hipaa: Array.isArray(prev.hipaa)
        ? prev.hipaa
        : {
            ...prev.hipaa,
            representativeName: value,
          },
      representativeName: value, // also at top level for easy access
    }));
  };

  const handleRepresentativeAuthorityChange = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      representativeAuthority: value,
    }));
  };

  console.log(formData);

  // ── Reusable Yes/No radio pair — untouched ────────────────────────────────
  const RadioPair = ({ name, field }: { name: string; field: string }) => (
    <div className="flex gap-2 shrink-0">
      <input
        type="radio"
        name={name}
        checked={formData.radios?.[field] === "yes"}
        onChange={() => handleRadioChange(field, "yes")}
        className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"
      />
      <input
        type="radio"
        name={name}
        checked={formData.radios?.[field] === "no"}
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
          <RadioPair name="row1" field="copyOfPrivacyNotice" />
          <p className="flex-1 ml-4">
            I have been offered a copy of the Privacy Notice (last page of packet).
          </p>
        </div>

        {/* Row 2 — updated text */}
        <div className="flex items-start mb-4">
          <RadioPair name="row2" field="requestedCopy" />
          <p className="flex-1 ml-4">
            I have requested/received/declined a copy of the Privacy Notice.{" "}
            <span className="italic">(circle one)</span>
          </p>
        </div>

        {/* Row 3 */}
        <div className="flex items-start mb-4">
          <RadioPair name="row3" field="privacyNotice" />
          <p className="flex-1 ml-4">I have read the Privacy Notice.</p>
        </div>

        {/* Row 4 — updated text */}
        <div className="flex items-start mb-4">
          <RadioPair name="row4" field="prescriptionInformation" />
          <p className="flex-1 ml-4">
            I give permission for Horizon Family Medical Group to obtain prescription information
            electronically from any physician, pharmacy, or insurance company.
          </p>
        </div>

        {/* Row 5 — Family members */}
        <div className="flex items-start mb-2">
          <RadioPair name="row5" field="permission" />

          <div className="flex-1 ml-4">
            <p className="mb-1">I give permission to leave information with my family member(s)</p>
            {/* ADDED: label matching paper form */}
            <p className="mb-2 text-xs text-gray-700">Name of family member(s) and their relation:</p>

            {/* 3 rows — separate inputs */}
            <div className="space-y-2">
              {rows.map((row, index) => (
                <div key={index} className="flex gap-3">
                  <LineInput
                    className="flex-1"
                    placeholder="Full name"
                    value={row.familyMemberName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(index, "familyMemberName", e.target.value)
                    }
                  />
                  <LineInput
                    className="flex-1"
                    placeholder="Relationship"
                    value={row.relationship}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(index, "relationship", e.target.value)
                    }
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
                value={`${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleNameChange(e.target.value)
                }
              />
            </div>
            <div className="flex items-end gap-2 w-52">
              <label className="shrink-0">Date:</label>
              <LineInput
                type="date"
                className="flex-1"
                value={formData.date ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleDateChange(e.target.value)
                }
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
        <div className="mt-8 pt-4 border-t border-gray-300">
          <p className="font-semibold mb-4">
            If you are signing as the patient's representative:
          </p>

          {/* Representative Name */}
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
          <div className="flex items-end gap-2">
            <label className="shrink-0 whitespace-nowrap">Describe your authority:</label>
            <LineInput
              className="flex-1"
              value={formData.representativeAuthority ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleRepresentativeAuthorityChange(e.target.value)
              }
            />
          </div>
        </div>

      </div>
    </FormContainer>
  );
};

export default HIPAANotice;