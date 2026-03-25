import React, { useEffect, useState } from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from "../Input/SignatureField";

const HIPAANotice = ({ patientData }: PatientData) => {

  const [formData, setFormData] = useState({
    radios: {
      copyOfPrivacyNotice: "",
      requestedCopy: "",
      privacyNotice: "",
      prescriptionInformation: "",
      permission: ""
    },
    familyMembers: ["", "", ""],
    name: "",
    date: "",
    signature: ""
  });

  // Load backend HIPAA data
  useEffect(() => {

    if (!patientData?.hippa) return;

    console.log("HIPAA backend data:", patientData);

    const rows = ["", "", ""];

    const data = Array.isArray(patientData.hippa)
      ? patientData.hippa
      : [patientData.hippa];

    data.forEach((item: any, index: number) => {

      if (index < 3) {
        rows[index] = `${item.familyMemberName} - ${item.relationship}`;
      }

    });

    setFormData(prev => ({
      ...prev,
      familyMembers: rows
    }));

  }, [patientData]);

  // Text input change
  const handleChange = (index: number, value: string) => {

    const updated = [...formData.familyMembers];
    updated[index] = value;

    setFormData(prev => ({
      ...prev,
      familyMembers: updated
    }));

  };

  // Radio change
  const handleRadioChange = (row: string, value: string) => {

    setFormData(prev => ({
      ...prev,
      radios: {
        ...prev.radios,
        [row]: value
      }
    }));

  };

  // Name change
  const handleNameChange = (value: string) => {

    setFormData(prev => ({
      ...prev,
      name: value
    }));

  };

  // Date change
  const handleDateChange = (value: string) => {

    setFormData(prev => ({
      ...prev,
      date: value
    }));

  };

  // Signature


  // Submit
  const handleSubmit = () => {

    console.log("FULL FORM DATA");
    console.log(formData);

  };

  return (
    <FormContainer>
      <HeaderImage />

      <div className="max-w-4xl mx-auto p-6 sm:p-10 text-xs sm:text-sm text-black bg-white">

        <div className="text-center mb-6">
          <p className="font-semibold">Horizon Family Medical Group</p>
          <h2 className="font-bold underline tracking-wide">
            HIPAA NOTICE OF PRIVACY PRACTICES
          </h2>
        </div>

        <div className="flex items-center mb-3">
          <span className="w-8 text-center font-semibold">Yes</span>
          <span className="w-8 text-center font-semibold ml-2">No</span>
        </div>

        {/* Row 1 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
            <input type="radio" name="row1" checked={formData.radios.copyOfPrivacyNotice==="yes"} onChange={()=>handleRadioChange("copyOfPrivacyNotice","yes")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
            <input type="radio" name="row1" checked={formData.radios.copyOfPrivacyNotice==="no"} onChange={()=>handleRadioChange("copyOfPrivacyNotice","no")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
          </div>
          <p className="flex-1 ml-4">I have been offered a copy of the Privacy Notice.</p>
        </div>

        {/* Row 2 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
            <input type="radio" name="row2" checked={formData.radios.requestedCopy==="yes"} onChange={()=>handleRadioChange("requestedCopy","yes")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
            <input type="radio" name="row2" checked={formData.radios.requestedCopy==="no"} onChange={()=>handleRadioChange("requestedCopy","no")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
          </div>
          <p className="flex-1 ml-4">I have requested / received / declined a copy.</p>
        </div>

        {/* Row 3 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
            <input type="radio" name="row3" checked={formData.radios.privacyNotice==="yes"} onChange={()=>handleRadioChange("privacyNotice","yes")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
            <input type="radio" name="row3" checked={formData.radios.privacyNotice==="no"} onChange={()=>handleRadioChange("privacyNotice","no")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
          </div>
          <p className="flex-1 ml-4">I have read the Privacy Notice.</p>
        </div>

        {/* Row 4 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
            <input type="radio" name="row4" checked={formData.radios.prescriptionInformation==="yes"} onChange={()=>handleRadioChange("prescriptionInformation","yes")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
            <input type="radio" name="row4" checked={formData.radios.prescriptionInformation==="no"} onChange={()=>handleRadioChange("prescriptionInformation","no")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
          </div>
          <p className="flex-1 ml-4">I give permission to obtain prescription information electronically.</p>
        </div>

        {/* Row 5 */}
        <div className="flex items-start mb-2">
          <div className="flex gap-2">
            <input type="radio" name="row5" checked={formData.radios.permission==="yes"} onChange={()=>handleRadioChange("permission","yes")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
            <input type="radio" name="row5" checked={formData.radios.permission==="no"} onChange={()=>handleRadioChange("permission","no")} className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500"/>
          </div>

          <div className="flex-1 ml-4">

            <p>I give permission to leave information with my family member(s):</p>

            <div className="space-y-3 mt-2">

              <LineInput
                className="w-full"
                value={formData.familyMembers[0]}
                onChange={(e:any)=>handleChange(0,e.target.value)}
              />

              <LineInput
                className="w-full"
                value={formData.familyMembers[1]}
                onChange={(e:any)=>handleChange(1,e.target.value)}
              />

              <LineInput
                className="w-full"
                value={formData.familyMembers[2]}
                onChange={(e:any)=>handleChange(2,e.target.value)}
              />

            </div>
          </div>
        </div>

        {/* Name + Date */}
        <div className="mt-10 space-y-5">

          <div className="flex gap-4">
            <label>Name:</label>
            <LineInput value={formData.name} onChange={(e:any)=>handleNameChange(e.target.value)} />
          </div>

          <div className="flex gap-4">
            <label>Date:</label>
            <LineInput type="date" value={formData.date} onChange={(e:any)=>handleDateChange(e.target.value)} />
          </div>

          <div className="flex gap-4">
            <label>Signature:</label>
            <SignatureField className="flex-1"  onChange={(dataUrl) =>
                setFormData((prev: any) => ({
                  ...prev,
                  signature: dataUrl
                }))}/>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>

        </div>

      </div>
    </FormContainer>
  );
};

export default HIPAANotice;