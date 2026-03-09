import React, { useEffect } from "react";
import Input from "../UI/Input";
import IconButton from "../UI/IconButton";
import Dropdown from "../UI/Dropdown";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router"

type Props = {
    newFormModalOpen: boolean,
    setNewFormModalOpen: (open: boolean) => void
}

const NewFormModal = ({ newFormModalOpen, setNewFormModalOpen }: Props) => {

    const [error, setError] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [file, setFile] = React.useState<File | null>(null);
    const [formName, setFormName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [uploading, setUploading] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const navigate = useNavigate();
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);
        setFileName(file.name);
        setUploading(true);
        setTimeout(() => setUploading(false), 1500);
    };

    async function getPdfCategories() {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/DocumentType`);
            const data = await response.json();
            console.log("Fetched categories:", data);
            if (response.ok) {
                setCategories(data);
            } else {
                setError("Failed to fetch categories");
            }
        } catch (err) {
            setError("An error occurred while fetching categories");
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (newFormModalOpen) {
            getPdfCategories();
        }
    }, [newFormModalOpen])

    //api for creating form template
   async function createFormTemplate() {
    setSubmitting(true);
    if (!file) {
        setError("Please upload a form file.");
        toast.error("Please upload a form file.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/File/create-template`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const template = response.data.template || response.data;

        // Navigate to editor page and pass data
        navigate("/preview", {
            state: {
                template,
                formName,
                description,
                category: selectedCategory,
                fileName
            }
        });

    } catch (err) {
        setError("An error occurred while creating form template");
        toast.error("An error occurred while creating form template");
        console.error("Error creating form template:", err);
    }finally {
        setSubmitting(false);
    }
}

    //submit handler to send form data to backend
    const handleSubmit = async () => {
        
        if (!file) {
            setError("Please upload a form file.");
            toast.error("Please upload a form file.");
            return;
        }
        if (!formName.trim()) {
            setError("Form name is required.");
            toast.error("Form name is required.");
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("formName", formName);
        formData.append("description", description);

        console.log("Submitting form with data:", {
            file,
            formName,
            description,
            category: selectedCategory,
        });

        await createFormTemplate();

    }



    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Add New Form
                </h2>
                <p className="text-sm text-gray-500">
                    Upload a form and provide details to generate a digital template.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Upload Section */}
                {(() => {
                    const FileUploader: React.FC = () => {


                        return (
                            <label
                                htmlFor="formFile"
                                className="flex-1 min-h-[220px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                            >
                                <input
                                    id="formFile"
                                    type="file"
                                    className="hidden"
                                    onChange={handleChange}
                                />

                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl">
                                    +
                                </div>

                                <div className="text-center">
                                    {uploading ? (
                                        <p className="font-medium text-gray-700">Uploading...</p>
                                    ) : fileName ? (
                                        <>
                                            <p className="font-medium text-gray-700 truncate max-w-xs">
                                                {fileName}
                                            </p>
                                            <p className="text-xs text-gray-500">Tap to change</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-medium text-gray-700">Upload Form</p>
                                            <p className="text-xs text-gray-500">PDF, Image or Document</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        );
                    };

                    return <FileUploader />;
                })()}

                {/* Form Fields */}
                <div className="flex-1 flex flex-col gap-4">
                    <Input
                        id="formName"
                        label="Form Name"
                        value={formName}
                        onChange={(e) => { setFormName(e.target.value) }}
                    />

                    <Dropdown
                        id="category"
                        name="category"
                        title="Category"
                        list={categories.map((cat: any) => ({ value: cat.code, label: cat.name }))}
                        selected={selectedCategory}
                        setSelect={(val) => setSelectedCategory(val)}
                        disabled={loading || categories.length === 0}
                        listContainerClassName="max-h-60"
                        listContainerStyle={{ maxHeight: '240px' }}

                    />

                    <Input
                        id="description"
                        label="Description"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" onClick={() => setNewFormModalOpen(false)}>
                    Cancel
                </button>

                <IconButton
                    title="Create Form"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={submitting}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg shadow" 

                />
            </div>
        </div>
    );
};

export default NewFormModal;