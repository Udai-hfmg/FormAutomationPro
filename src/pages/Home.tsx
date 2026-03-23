import React, { useState } from 'react'
import Navbar from '../components/Home/Navbar'
import SearchInput from '../components/UI/SearchInput'
import Table from '../components/Home/Table'
import { IoIosEye } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { Modal } from '../components/Home/Modal';
import NewFormModal from '../components/Home/NewFormModal';
import { useGetDocumentsQuery } from '../redux/api/DocumentSlice';

interface FormDataItem {
    id: string
    formName: string
    category: string
    description: string
    updated: string
}

export const dummyData: FormDataItem[] = [
    {
        id: 'form-001',
        formName: 'Employee Onboarding',
        category: 'HR',
        description: 'Collects new hire info, tax forms, and equipment requests.',
        updated: '2026-03-01',
    },
    {
        id: 'form-002',
        formName: 'Expense Reimbursement',
        category: 'Finance',
        description: 'Submit business expenses for approval and reimbursement.',
        updated: '2026-02-25',
    },
    {
        id: 'form-003',
        formName: 'IT Access Request',
        category: 'IT',
        description: 'Request system access and permissions for employees.',
        updated: '2026-03-03',
    },
    {
        id: 'form-004',
        formName: 'Facility Maintenance',
        category: 'Operations',
        description: 'Report facility issues and schedule maintenance tasks.',
        updated: '2026-01-15',

    },
    {
        id: 'form-005',
        formName: 'Campaign Brief',
        category: 'Marketing',
        description: 'Gather campaign requirements, targets, and assets.',
        updated: '2026-02-10',
    },
]

export const columns = (data: any[], selectedRows: number[], handleRowSelect: any, handleSelectAll: any) => [
    {
        key: "select",
        title: (
            <input
                type="checkbox"
                onChange={() => handleSelectAll(data)}
                checked={data&&selectedRows.length === data.length && data.length > 0}
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
    }
];

const Home = () => {

    const [forms, setForms] = React.useState<FormDataItem[]>(dummyData)
    const [newFormModalOpen, setNewFormModalOpen] = React.useState(false)

    const { data, isLoading, isError } = useGetDocumentsQuery("documents")
    const [selectedRows, setSelectedRows] = useState<number[]>([]);



    const handleRowSelect = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = (rows: any[]) => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map(r => r.documentVersionId));
        }
    };

    const getColumn = columns(data, selectedRows, handleRowSelect, handleSelectAll)

    return (
        <>
            {/* modals  */}
            <Modal isOpen={newFormModalOpen} onClose={() => setNewFormModalOpen(false)}>
                <NewFormModal newFormModalOpen={newFormModalOpen} setNewFormModalOpen={setNewFormModalOpen} />
               
            </Modal>

            <Navbar newFormModalOpen={newFormModalOpen} setNewFormModalOpen={setNewFormModalOpen} />

            {/* Table */}
            {isLoading ? <div>loading...</div> : <> {forms.length !== 0 ? <div className='w-screen md:w-[80%] mx-auto mt-6'>
                <SearchInput /><Table columns={getColumn} data={data} className='mt-5 border-2 border-gray-300 p' /> </div> : <p className='text-center mt-10 text-gray-500'>No forms available.</p>} </>}


        </>

    )
}

export default Home