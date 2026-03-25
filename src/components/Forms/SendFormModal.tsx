import React from "react";
import { IoCopyOutline } from "react-icons/io5";

interface SendFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  templatePath: string;
}

const SendFormModal: React.FC<SendFormModalProps> = ({
  isOpen,
  onClose,
  templatePath,
}) => {
  const [patientName, setPatientName] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [facilityId, setFacilityId] = React.useState("");

  const formLink = `${window.location.origin}/forms/${templatePath}`;

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(formLink);
  };

  const handleSend = () => {
    const payload = {
      patientName,
      dob,
      facilityId,
      templatePath,
      formLink
    };

    console.log("Send Form Payload", payload);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[520px] rounded-xl shadow-xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Send Form</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Patient Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Patient Name
          </label>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* DOB */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Facility */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Facility ID
          </label>
          <input
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            placeholder="Enter facility id"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Link Section */}
        <div className="mb-5">
          <label className="text-sm text-gray-600 mb-1 block">
            Form Link
          </label>

          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
            <input
              value={formLink}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <button
              onClick={copyLink}
              className="text-gray-600 hover:text-black"
            >
              <IoCopyOutline size={18} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            className="px-4 py-2 bg-[#7e1b34] text-white rounded-lg hover:opacity-90"
          >
            Send Form
          </button>

        </div>

      </div>
    </div>
  );
};

export default SendFormModal;