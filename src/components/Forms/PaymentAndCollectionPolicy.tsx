import React from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";
import LineInput from "../Input/FormInput";

const PaymentAndCollectionPolicy = () => {
  return (
    <FormContainer>
      <HeaderImage />

      <div className="max-w-4xl mx-auto p-4 sm:p-8 text-xs sm:text-sm text-black">

        {/* Title */}
        <h2 className="text-center font-semibold mb-6">
          PAYMENT AND COLLECTION POLICY
        </h2>

        {/* Paragraph 1 */}
        <p className="mb-4 leading-relaxed text-justify">
          Your co-payment or deductible is due at the time the healthcare
          services are rendered by Horizon Family Medical Group. Failure to
          make such timely payment or otherwise carry an open balance will
          result in a $15.00 charge to cover the additional costs associated
          with Horizon Family Medical Group billing for any balance due. This
          additional charge does not apply if you are covered by Medicare,
          Medicaid, or any other federal healthcare program.
        </p>

        {/* Paragraph 2 */}
        <p className="mb-4 leading-relaxed text-justify">
          I have read the above payment and collection policy regarding my
          financial responsibility to Horizon Family Medical Group for
          healthcare services.
        </p>

        {/* Paragraph 3 */}
        <p className="mb-4 leading-relaxed text-justify">
          I agree to pay my applicable co-payment or deductible at the time of
          service, or alternatively agree to pay any balance due in full plus
          the $15.00 additional charge within 30 days from the date of request
          statement.
        </p>

        {/* Paragraph 4 */}
        <p className="mb-4 leading-relaxed text-justify">
          I also agree that I may be subject to additional fees, costs, and
          interest if my balance due is sent to a collection agency.
        </p>

        {/* Paragraph 5 */}
        <p className="mb-10 leading-relaxed text-justify">
          I have been provided with a copy of Horizon Family Medical Group’s
          payment policy.
        </p>

        {/* Signature Section */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-8">

          <div className="flex items-end gap-2 w-full">
            <label className="whitespace-nowrap">
              Name of Patient
            </label>
            <LineInput className="flex-1" />
          </div>

          <div className="flex items-end gap-2 w-full sm:w-60">
            <label>Date</label>
            <LineInput type="date" className="flex-1" />
          </div>

        </div>

        {/* Signature Line */}
        <div className="mt-8">
          <label>
            Signature of Patient or Patient's Legal Representative
          </label>
          <LineInput className="w-full mt-2" />
        </div>

      </div>
    </FormContainer>
  );
};

export default PaymentAndCollectionPolicy;