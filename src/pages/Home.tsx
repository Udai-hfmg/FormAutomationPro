import React from 'react'
import Navbar from '../components/Home/Navbar'
import SearchInput from '../components/UI/SearchInput'
import Table from '../components/Home/Table'
import { IoIosEye } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { Modal } from '../components/Home/Modal';
import NewFormModal from '../components/Home/NewFormModal';

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

export const columns = [
    { key: "id", title: "ID" },
    { key: "formName", title: "Form Name" },
    { key: "category", title: "Category" },
    { key: "description", title: "Description" },
    { key: "updated", title: "Last Updated" },
    {
        key: "actions",
        title: "Actions",
        render: (_: any, row: any) => (
            <div className="flex gap-3">
                <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => console.log(row)}
                >
                    <IoIosEye className='text-xl' />
                </button>
                <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => console.log(row)}
                >
                    <IoIosSend className='text-xl' />
                </button>
            </div>
        ),
    },
];

const Home = () => {

    const [forms, setForms] = React.useState<FormDataItem[]>(dummyData)
    const [newFormModalOpen, setNewFormModalOpen] = React.useState(false)
    return (
        <>
        {/* modals  */}
        <Modal isOpen={newFormModalOpen} onClose={() => setNewFormModalOpen(false)}>
                <NewFormModal newFormModalOpen={newFormModalOpen} setNewFormModalOpen={setNewFormModalOpen} />
            </Modal>

            <Navbar newFormModalOpen={newFormModalOpen} setNewFormModalOpen={setNewFormModalOpen} />
            
            {/* Table */}

            {forms.length !== 0 ? <div className='w-screen md:w-[80%] mx-auto mt-6'>
                <SearchInput /><Table columns={columns} data={forms} className='mt-5 border-2 border-gray-300 p' /> </div> : <p className='text-center mt-10 text-gray-500'>No forms available.</p>}

        </>
    )
}

export default Home