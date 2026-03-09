import React from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput from "../Input/FormInput";

const HIPAANotice = () => {
  return (
    <FormContainer>
      <HeaderImage />

      <div className="max-w-4xl mx-auto p-6 sm:p-10 text-xs sm:text-sm text-black bg-white">

        {/* Title */}
        <div className="text-center mb-6">
          <p className="font-semibold">Horizon Family Medical Group</p>
          <h2 className="font-bold underline tracking-wide">
            HIPAA NOTICE OF PRIVACY PRACTICES
          </h2>
        </div>

        {/* Column Headers */}
        <div className="flex items-center mb-3">
          <span className="w-8 text-center font-semibold">Yes</span>
          <span className="w-8 text-center font-semibold ml-2">No</span>
        </div>

        {/* Row 1 */}
        <div className="flex items-start mb-4">
        <div className="flex gap-2">
          <input type="radio" name="row1" value="yes" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          <input type="radio" name="row1" value="no" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          </div>
          <p className="flex-1 leading-relaxed ml-4">
            I have been offered a copy of the Privacy Notice (last page of packet).
          </p>
        </div>

        {/* Row 2 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
          <input type="radio" name="row2" value="yes" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          <input type="radio" name="row2" value="no" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          </div>
          <p className="flex-1 leading-relaxed ml-4">
            I have requested / received / declined a copy of the Privacy Notice.{" "}
            <span className="italic">(circle one)</span>
          </p>
        </div>

        {/* Row 3 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
          <input type="radio" name="row3" value="yes" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          <input type="radio" name="row3" value="no" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          </div>
          <p className="flex-1 leading-relaxed ml-4">
            I have read the Privacy Notice.
          </p>
        </div>

        {/* Row 4 */}
        <div className="flex items-start mb-4">
          <div className="flex gap-2">
          <input type="radio" name="row4" value="yes" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          <input type="radio" name="row4" value="no" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          </div>
          <p className="flex-1 leading-relaxed ml-4">
            I give permission for Horizon Family Medical Group to obtain prescription information
            electronically from any physician, pharmacy, or insurance company.
          </p>
        </div>

        {/* Row 5 */}
        <div className="flex items-start mb-2">
            <div className="flex gap-2">
          <input type="radio" name="row5" value="yes" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          <input type="radio" name="row5" value="no" className="appearance-none w-4 h-4 border border-black cursor-pointer checked:bg-blue-500" />
          </div>
          <div className="flex-1 leading-relaxed ml-4">
            <p className="mb-2">
              I give permission to leave information with my family member(s):
            </p>
            <p className="mb-2">Name of family member(s) and their relation:</p>
            <div className="space-y-3 mt-2">
              <LineInput className="w-full" />
              <LineInput className="w-full" />
              <LineInput className="w-full" />
            </div>
          </div>
        </div>

        {/* Acknowledgement Section */}
        <div className="mt-10 space-y-5">
          <p className="font-semibold underline">I acknowledge receipt of this notice:</p>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="flex items-end gap-2 flex-1">
              <label className="whitespace-nowrap">Name:</label>
              <LineInput className="flex-1" />
            </div>
            <div className="flex items-end gap-2 w-full sm:w-56">
              <label className="whitespace-nowrap">Date:</label>
              <LineInput type="date" className="flex-1" />
            </div>
          </div>

          <div className="flex items-end gap-2 w-full">
            <label className="whitespace-nowrap">Signature:</label>
            <LineInput className="flex-1" />
          </div>
        </div>

        {/* Representative Section */}
        <div className="mt-8 space-y-4">
          <p className="font-semibold underline">If you are signing as the patient's representative:</p>

          <div className="flex items-end gap-2 w-full">
            <label className="whitespace-nowrap">Name:</label>
            <LineInput className="flex-1" />
          </div>

          <div className="flex items-end gap-2 w-full">
            <label className="whitespace-nowrap">Describe your authority:</label>
            <LineInput className="flex-1" />
          </div>
        </div>

      </div>
    </FormContainer>
  );
};

export default HIPAANotice;