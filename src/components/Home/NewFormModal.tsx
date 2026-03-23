import React, { useEffect, useState } from "react";
import Input from "../UI/Input";
import IconButton from "../UI/IconButton";
import Dropdown from "../UI/Dropdown";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";
import formList from '../../data/formType.json'

type Props = {
    newFormModalOpen: boolean,
    setNewFormModalOpen: (open: boolean) => void
}

const NewFormModal = ({ newFormModalOpen, setNewFormModalOpen }: Props) => {

    const [error, setError] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [selectedFileType , setSelectedFileType] = useState("")
    const [labelName, setLabelName] = React.useState('');
    const [fileType, setFileType] = React.useState('');
    const [retiredDate, setRetiredDate] = React.useState('');

    const [submitting, setSubmitting] = React.useState(false);

    const navigate = useNavigate();

    async function getPdfCategories() {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/DocumentType`);
            const data = await response.json();

            if (response.ok) {
                setCategories(data);
            } else {
                setError("Failed to fetch categories");
            }
        } catch {
            setError("An error occurred while fetching categories");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (newFormModalOpen) {
            getPdfCategories();
        }
    }, [newFormModalOpen]);

    const handleSubmit = async () => {
        if (!labelName.trim()) {
            toast.error("Label name is required.");
            return;
        }

        if (!selectedCategory) {
            toast.error("Category is required.");
            return;
        }

        if (!fileType.trim()) {
            toast.error("File type is required.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                labelName,
                category: selectedCategory,
                fileType,
                retiredDate
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/Form/create`,
                payload
            );

            navigate("/preview", {
                state: payload
            });

        } catch (err) {
            toast.error("Failed to create form.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Add New Form
                </h2>
                <p className="text-sm text-gray-500">
                    Provide form details to create a template.
                </p>
            </div>

            <div className="flex flex-col gap-4">

                <Input
                    id="labelName"
                    label="Label Name"
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                />

                <Dropdown
                    id="category"
                    name="category"
                    title="Category"
                    list={categories.map((cat: any) => ({
                        value: cat.code,
                        label: cat.name
                    }))}
                    selected={selectedCategory}
                    setSelect={(val) => setSelectedCategory(val)}
                    disabled={loading || categories.length === 0}
                />

                  <Dropdown
                    id="fileType"
                    name="fileType"
                    title="File Type"
                    list={formList.map((cat: any) => ({
                        value: cat.link,
                        label: cat.name
                    }))}
                    selected={selectedFileType}
                    setSelect={(val) => setSelectedFileType(val)}
                    disabled={loading || categories.length === 0}
                />

                <Input
                    id="retiredDate"
                    label="Retired Date"
                    type="date"
                    value={retiredDate}
                    onChange={(e) => setRetiredDate(e.target.value)}
                />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setNewFormModalOpen(false)}
                >
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