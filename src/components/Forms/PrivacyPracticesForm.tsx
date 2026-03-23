import React from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput from "../Input/FormInput";
import type { PatientData } from "../Input/PatientData";
import SignatureField from '../Input/SignatureField'

const PrivacyPracticesForm = ({patientData}:PatientData) => {
  return (
    <FormContainer>
         <HeaderImage />
      <div className="max-w-4xl mx-auto p-4 sm:p-8 text-xs sm:text-sm text-black">

        {/* Title */}
        <h2 className="text-center font-semibold mb-2">
          NOTICE OF PRIVACY PRACTICES
        </h2>

        <h3 className="text-center font-semibold mb-6">
          Patient Acknowledgment of Receipt of Notice
        </h3>

        {/* Paragraph */}
        <p className="mb-6 leading-relaxed">
          This is to acknowledge that I have been provided with Horizon Family
          Medical Group’s Notice of Privacy Practices. Should I have any
          questions regarding the Notice of Privacy Practices, I understand
          that I can contact the Practice’s Privacy Office at 845-651-1423.
        </p>

        {/* Signature Section */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
         <div className="relative w-full overflow-visible">
  <label className="whitespace-nowrap ">Patient Signature</label>
  <SignatureField className="flex-1" onChange={(dataUrl) => console.log(dataUrl)} />
</div>

          <div className="flex items-end gap-2 w-full sm:w-60">
            <label>Date</label>
            <LineInput type="date" className="flex-1" />
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-black my-8"></div>

        {/* Internal Use Section */}
        <h3 className="text-center font-semibold mb-4">
          For Internal Use Only
        </h3>

        <p className="mb-6 leading-relaxed">
          I attempted to obtain patient acknowledgment but was unable to do so
          for the reason set forth below:
        </p>

        {/* Internal Fields */}
        <div className="space-y-6">

          <div className="flex items-end gap-2 w-full sm:w-60">
            <label>Date</label>
            <LineInput type="date" className="flex-1" />
          </div>

          <div>
            <label>Reason</label>
            <LineInput className="w-full mt-1" />
          </div>

          <div className="flex items-end gap-2 w-full sm:w-40">
            <label>Initials</label>
            <LineInput className="flex-1" />
          </div>

        </div>

      </div>
       {/* <PatientSignaturePad /> */}
    </FormContainer>
  );
};

export default PrivacyPracticesForm;