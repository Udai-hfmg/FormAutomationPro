import React from "react";
import { useLocation } from "react-router";
import TestForm from "./TestForm";

const PreviewPage = () => {
  const location = useLocation();
  const { template, formName, description, category, fileName } =
    location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* LEFT SIDE - FORM PREVIEW */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Form Preview
          </h2>

          <div className="border rounded-lg p-4 bg-gray-50 min-h-[500px]">
            <TestForm template={template} />
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS PANEL */}
        <div className="w-[320px] bg-white rounded-xl shadow-md p-6 flex flex-col gap-5">

          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Form Details
          </h2>

          {/* Form Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Form Name</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50 text-gray-700">
              {formName}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Description</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50 text-gray-700 min-h-[60px]">
              {description || "No description"}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Category</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50 text-gray-700">
              {category}
            </div>
          </div>

          {/* File */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Uploaded File</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50 text-gray-700 truncate">
              {fileName}
            </div>
          </div>

           <button
        // onClick={handleSubmit}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        Submit
      </button>

        </div>
      </div>
    </div>
  );
};

export default PreviewPage;