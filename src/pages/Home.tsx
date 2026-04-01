import React, { useState } from 'react'
import Navbar from '../components/Home/Navbar'
import SearchInput from '../components/UI/SearchInput'
import Table from '../components/Home/Table'
import { Modal } from '../components/Home/Modal';
import NewFormModal from '../components/Home/NewFormModal';
import { useGetDocumentsQuery } from '../redux/api/DocumentSlice';
import SendFormModal from '../components/Forms/SendFormModal';
import FloatingActionBar from '../components/Home/FloatingActionBar';
import IconButton from '../components/UI/IconButton';
import { FaEye } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import Loading from '../components/Home/Loading';

export const columns = (
    data: any[],
    selectedRows: number[],
    handleRowSelect: any,
    handleSelectAll: any,
    setSendModalOpen: any,
    setSelectedSingleRow: any,
    setSingleOpen: any
) => [
        {
            key: "select",
            title: (
                <input
                    type="checkbox"
                    onChange={() => handleSelectAll(data)}
                    checked={data && selectedRows.length === data.length && data.length > 0}
                />
            ),
            render: (_: any, row: any) => (
                <input
                    type="checkbox"
                    checked={selectedRows.includes(row.documentVersionId)}
                    onChange={() => handleRowSelect(row.documentVersionId)}
                />
            )
        },

        { key: "documentVersionId", title: "ID" },
        { key: "versionLabel", title: "Version Label" },

        {
            key: "documentType",
            title: "Document Type",
            render: (_: any, row: any) => row.documentType?.name || "-"
        },

        {
            key: "retiredDate",
            title: "Retired Date",
            render: (_: any, row: any) =>
                row.retiredDate
                    ? new Date(row.retiredDate).toLocaleDateString()
                    : "-"
        },
        {
            key: "Actions",
            title: "Actions",
            render: (_: any, row: any) => (
                <div className='flex flex-row gap-3 items-center'>
                    <IconButton icon={<FaEye />} onClick={() => {
                        setSelectedSingleRow(row);
                    }} />
                    <IconButton icon={<IoIosSend />} onClick={() => {
                        setSelectedSingleRow(row);
                        setSingleOpen(true);
                    }} />
                </div>
            )
        }
    ];

const Home = () => {

    const [newFormModalOpen, setNewFormModalOpen] = useState(false);

    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [selectedSingleRow, setSelectedSingleRow] = useState<any>(null);
    const { data = [], isLoading } = useGetDocumentsQuery("documents");
    const [singleOpen, setSingleOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // ✅ Row select
    const handleRowSelect = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    // ✅ Select all
    const handleSelectAll = (rows: any[]) => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map(r => r.documentVersionId));
        }
    };

    // ✅ Get selected template paths
    const getSelectedTemplatePaths = () => {
        return data
            .filter((row: any) => selectedRows.includes(row.documentVersionId))
            .map((row: any) => row.templatePath)
            .join(",");
    };

    // ✅ Send action
    const handleSend = () => {
        const templatePathString = getSelectedTemplatePaths();

        setSelectedTemplate(templatePathString);
        setSendModalOpen(true);
    };

    const getColumn = columns(data, selectedRows, handleRowSelect, handleSelectAll, setSendModalOpen, setSelectedSingleRow, setSingleOpen);

    return (
        <>
            {/* ✅ Send Modal */}
            <SendFormModal
                isOpen={sendModalOpen}
                onClose={() => setSendModalOpen(false)}
                templatePath={selectedTemplate}
            />

            <SendFormModal
                isOpen={singleOpen}
                onClose={() => setSingleOpen(false)}
                templatePath={singleOpen ? selectedSingleRow?.templatePath : ""}
            />

            {/* ✅ Floating Action Bar */}
            {selectedRows.length > 0 && (
                <FloatingActionBar
                    selectedCount={selectedRows.length}
                    onArchive={() => console.log('archive', selectedRows)}
                    onDelete={() => console.log('delete', selectedRows)}
                    onSend={handleSend}
                    onClear={() => setSelectedRows([])}
                />
            )}

            {/* New Form Modal */}
            <Modal isOpen={newFormModalOpen} onClose={() => setNewFormModalOpen(false)}>
                <NewFormModal newFormModalOpen={newFormModalOpen} setNewFormModalOpen={setNewFormModalOpen} />

            </Modal>

            <Navbar
            // newFormModalOpen={newFormModalOpen}
            // setNewFormModalOpen={setNewFormModalOpen}
            />

            {/* Table */}
            {isLoading ? (
                <Loading />
            ) : (
                <div className='w-screen md:w-[80%] mx-auto mt-6'>
                    <SearchInput />

                    <Table
                        columns={getColumn}
                        data={data}
                        className='mt-5 border-2 border-gray-300'
                    />
                </div>
            )}
        </>
    );
};

export default Home;