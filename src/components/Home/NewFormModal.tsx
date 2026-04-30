import React, { useEffect, useState } from "react";
import Input from "../UI/Input";
import IconButton from "../UI/IconButton";
import Dropdown from "../UI/Dropdown";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import { AppDataContext } from "../../context/AppDataContext";

type Props = {
  newFormModalOpen: boolean;
  setNewFormModalOpen: (open: boolean) => void;
};

const NewFormModal = ({ newFormModalOpen, setNewFormModalOpen }: Props) => {
  const [formName, setFormName] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [facilities, setFacilities] = useState<{ value: string; label: string }[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = React.useContext(AppDataContext)!;
  const navigate = useNavigate();

  const categorie = {
    "1": "Intake",
    "2": "Clinical",
    "3": "Administrative",
  };

  async function fetchDropdowns() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Admin`);
      const data = await res.json();

      setFacilities(
        data.map((f: any) => ({
          value: String(f.officeId),
          label: f.officeName,
        }))
      );

      setCategories(
        Object.entries(categorie).map(([id, name]) => ({
          value: id,
          label: name,
        }))
      );
    } catch {
      toast.error("Failed to load form options.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (newFormModalOpen) fetchDropdowns();
  }, [newFormModalOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return toast.error("Form name is required.");
    if (!selectedFacility) return toast.error("Please select a facility.");
    if (!selectedCategory) return toast.error("Please select a category.");
    if (!uploadedFile) return toast.error("Please upload a document.");

    const userEmail = user?.email;
    if (!userEmail) return toast.error("Session expired. Please login again.");

    const facilityLabel =
      facilities.find(f => f.value === selectedFacility)?.label ?? selectedFacility;

    const categoryLabel =
      categories.find(c => c.value === selectedCategory)?.label ?? selectedCategory;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("From", userEmail);
      formData.append("Subject", `New Form Request: ${formName} — ${facilityLabel}`);
      formData.append("Body", notes || "New form request submitted");
      formData.append("FormName", formName);
      formData.append("FacilityName", facilityLabel);
      formData.append("CategoryName", categoryLabel);
      formData.append("Notes", notes);
      formData.append("SubmittedBy", userEmail);
      formData.append("File", uploadedFile);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/Admin/send-mail`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Failed");

      toast.success("Form request submitted!");
      navigate("/");
    } catch {
      toast.error("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!newFormModalOpen) return null;

  return (
    <>
<div className="flex flex-col min-h-screen">

      <Navbar />
      <div className="min-h-screen bg-white px-6 py-8">
        <div className="max-w-5xl mx-auto">

          {/* 🔥 Header (same as submissions page) */}
          <div className="mb-7">
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ color: "#1a5c38" }}
            >
              Submit a Form Request
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload your document and provide details — we’ll build it for you.
            </p>
          </div>

          {/* 🔥 Main Card */}
          <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-6">

            <div className="flex flex-col gap-5">

              {/* Form Name */}
              <Input
                id="formName"
                label="Form name"
                placeholder="e.g. Patient intake form — North facility"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  id="facility"
                  name="facility"
                  title="Facility"
                  list={facilities}
                  selected={selectedFacility}
                  setSelect={setSelectedFacility}
                  disabled={loading || facilities.length === 0}
                />
                <Dropdown
                  id="category"
                  name="category"
                  title="Category"
                  list={categories}
                  selected={selectedCategory}
                  setSelect={setSelectedCategory}
                  disabled={loading || categories.length === 0}
                />
              </div>

              {/* Upload */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Upload document
                </label>

                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition text-center"
                >
                  <span className="text-2xl">📄</span>
                  <span className="text-sm text-gray-500">
                    Click to upload or drag & drop
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, DOCX up to 20 MB
                  </span>
                </label>

                <input
                  id="fileUpload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {uploadedFile && (
                  <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full w-fit mt-1">
                    📄 {uploadedFile.name}
                  </span>
                )}
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Notes{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>

                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none min-h-[90px] focus:outline-none focus:ring-1 focus:ring-[#1a5c38]"
                  placeholder="Any special fields or instructions…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>

                <IconButton
                  title="Submit request"
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                  className="bg-[#1a5c38] text-white hover:bg-[#15492d] px-5 py-2 rounded-lg shadow"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default NewFormModal;