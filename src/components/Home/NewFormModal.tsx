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

// ✅ Helper to decode JWT and extract email


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

    const categorie = {
        "1": "Intake",
        "2": "Clinical",
        "3": "Administrative",
    };

    const { user } = React.useContext(AppDataContext)!;
    console.log('this is the user ', user?.email);

    const navigate = useNavigate();

    async function fetchDropdowns() {
        setLoading(true);
        try {
            const facRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Admin`);
            const facData = await facRes.json();

            setFacilities(
                facData.map((f: any) => ({ value: String(f.officeId), label: f.officeName }))
            );
            setCategories(
                Object.entries(categorie).map(([id, name]) => ({ value: id, label: name }))
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
        if (!userEmail) return toast.error("Could not identify your account. Please log in again.");

        const facilityLabel =
            facilities.find(f => f.value === selectedFacility)?.label ?? selectedFacility;

        const categoryLabel =
            categories.find(c => c.value === selectedCategory)?.label ?? selectedCategory;

        try {
            setSubmitting(true);

            // ✅ SINGLE API CALL with FormData
            const formData = new FormData();

            formData.append("From", userEmail);
            formData.append("Subject", `New Form Request: ${formName} — ${facilityLabel}`);
            formData.append("Body", notes || "New form request submitted"); // ✅ ADD THIS
            formData.append("FormName", formName);
            formData.append("FacilityName", facilityLabel);
            formData.append("CategoryName", categoryLabel);
            formData.append("Notes", notes);
            formData.append("SubmittedBy", userEmail);

            formData.append("File", uploadedFile); // 🔥 IMPORTANT

            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/Admin/send-mail`,
                {
                    method: "POST",
                    body: formData, // ❗ NO headers
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send request");
            }

            toast.success("Form request submitted! We'll be in touch.");
            navigate("/");
        } catch (err) {
            toast.error("Failed to submit request.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };
    if (!newFormModalOpen) return null;

    return (
        <>
            <div className="flex flex-col gap-8">
                <Navbar />
                <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col gap-5">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Submit a form request</h2>
                        <p className="text-sm text-gray-500">
                            Upload the document and fill in the details — our team will build it for you.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Input
                            id="formName"
                            label="Form name"
                            placeholder="e.g. Patient intake form — North facility"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
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

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Upload document</label>
                            <label
                                htmlFor="fileUpload"
                                className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition text-center"
                            >
                                <span className="text-2xl">📄</span>
                                <span className="text-sm text-gray-500">Click to upload or drag & drop</span>
                                <span className="text-xs text-gray-400">PDF, DOCX up to 20 MB</span>
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                accept=".pdf,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {uploadedFile && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit mt-1">
                                    📄 {uploadedFile.name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">
                                Notes for the dev team{" "}
                                <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                                placeholder="Any special fields, logic, or instructions we should know about…"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <p className="text-xs text-gray-400">
                            ℹ️ Once submitted, our team will review and follow up with the completed form.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t">
                        <button
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>
                        <IconButton
                            title="Submit request"
                            onClick={handleSubmit}
                            loading={submitting}
                            disabled={submitting}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-lg shadow"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewFormModal;