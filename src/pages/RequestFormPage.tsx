// src/pages/RequestFormPage.tsx
import { useState } from "react";
import NewFormModal from "../components/Home/NewFormModal";

const RequestFormPage = () => {
    const [open, setOpen] = useState(true);
    return (
        <div className="min-h-screen bg-white">
            <NewFormModal newFormModalOpen={open} setNewFormModalOpen={setOpen} />
        </div>
    );
};

export default RequestFormPage;