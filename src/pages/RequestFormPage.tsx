// src/pages/RequestFormPage.tsx
import { useState } from "react";
import NewFormModal from "../components/Home/NewFormModal";

const RequestFormPage = () => {
    const [open, setOpen] = useState(true);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <NewFormModal newFormModalOpen={open} setNewFormModalOpen={setOpen} />
        </div>
    );
};

export default RequestFormPage;