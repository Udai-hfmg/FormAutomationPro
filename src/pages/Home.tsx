import React, { useState } from 'react'
import { motion } from 'framer-motion'

import Navbar from '../components/Home/Navbar'
import SearchInput from '../components/UI/SearchInput'
import { Modal } from '../components/Home/Modal'
import NewFormModal from '../components/Home/NewFormModal'
import { useGetDocumentsQuery } from '../redux/api/DocumentSlice'
import SendFormModal from '../components/Forms/SendFormModal'
import FloatingActionBar from '../components/Home/FloatingActionBar'
import IconButton from '../components/UI/IconButton'
import { FaEye } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import Loading from '../components/Home/Loading'
import ReusableTable, { type ColumnDef } from '../components/UI/SubmissionTable'
import NYAdvanceDirective from '../components/Forms/NYAdvanceDirective'
import { useNavigate } from "react-router-dom";

// ── Column definitions ────────────────────────────────────────────────────────
// ReusableTable uses: { key, label, render(row) }  ← no leading _ value arg
export const columns = (
  data: any[],
  selectedRows: number[],
  handleRowSelect: (id: number) => void,
  handleSelectAll: (rows: any[]) => void,
  setSendModalOpen: (v: boolean) => void,
  setSelectedSingleRow: (row: any) => void,
  setSingleOpen: (v: boolean) => void,
  navigate: (path: string) => void,
): ColumnDef<any>[] => [
  {
    key: 'select',
    label: '',           // no header text for checkbox column
    render: (row) => (
      <input
        type="checkbox"
        checked={selectedRows.includes(row.documentVersionId)}
        onChange={() => handleRowSelect(row.documentVersionId)}
      />
    ),
  },
  {
    key: 'documentVersionId',
    label: 'ID',
    sortable: true,
    render: (row) => (
      <span
        className="font-mono text-xs font-semibold px-2 py-1 rounded-lg"
        style={{ backgroundColor: 'rgba(26,92,56,0.06)', color: '#1a5c38' }}
      >
        {row.documentVersionId}
      </span>
    ),
  },
  {
    key: 'versionLabel',
    label: 'Version Label',
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-gray-700">{row.versionLabel ?? '—'}</span>
    ),
  },
  {
    key: 'documentType',
    label: 'Document Type',
    sortable: true,
    render: (row) => (
      <span className="text-xs text-gray-600">{row.documentType?.name ?? '—'}</span>
    ),
  },
  {
    key: 'retiredDate',
    label: 'Retired Date',
    sortable: true,
    render: (row) => (
      <span className="text-xs text-gray-500">
        {row.retiredDate
          ? new Date(row.retiredDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—'}
      </span>
    ),
  },
  {
    key: null,
    label: 'Actions',
    render: (row) => (
      <div className="flex flex-row gap-2 items-center">
        <IconButton
          icon={<FaEye />}
          onClick={() => {setSelectedSingleRow(row)
            navigate(row.templatePath)
          }}
        />
        <IconButton
          icon={<IoIosSend />}
          onClick={() => {
            setSelectedSingleRow(row)
            setSingleOpen(true)
          }}
        />
      </div>
    ),
  },
]


// ── Home ──────────────────────────────────────────────────────────────────────
const Home = () => {
  const [newFormModalOpen, setNewFormModalOpen] = useState(false)
  const [sendModalOpen, setSendModalOpen]       = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedSingleRow, setSelectedSingleRow] = useState<any>(null)
  const [singleOpen, setSingleOpen]             = useState(false)
  const [selectedRows, setSelectedRows]         = useState<number[]>([])

const navigate = useNavigate();

  const { data = [], isLoading } = useGetDocumentsQuery('documents')



  const handleRowSelect = (id: number) =>
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const handleSelectAll = (rows: any[]) =>
    setSelectedRows(
      selectedRows.length === rows.length ? [] : rows.map(r => r.documentVersionId)
    )

  const handleSend = () => {
    const templatePathString = data
      .filter((row: any) => selectedRows.includes(row.documentVersionId))
      .map((row: any) => row.templatePath)
      .join(',')
    setSelectedTemplate(templatePathString)
    setSendModalOpen(true)
  }

  const cols = columns(
    data,
    selectedRows,
    handleRowSelect,
    handleSelectAll,
    setSendModalOpen,
    setSelectedSingleRow,
    setSingleOpen,
    navigate
  )

  console.log('this is the template path',selectedTemplate);
  

  return (
    <>
      {/* Send modals */}
      <SendFormModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}     
        templatePath={selectedTemplate}
      />
      <SendFormModal
        isOpen={singleOpen}
        onClose={() => setSingleOpen(false)}
        templatePath={singleOpen ? selectedSingleRow?.templatePath : ''}
      />

      {/* Floating action bar */}
      {selectedRows.length > 0 && (
        <FloatingActionBar
          selectedCount={selectedRows.length}
          onArchive={() => console.log('archive', selectedRows)}
          onDelete={() => console.log('delete', selectedRows)}
          onSend={handleSend}
          onClear={() => setSelectedRows([])}
        />
      )}

      {/* New form modal */}
      <Modal isOpen={newFormModalOpen} onClose={() => setNewFormModalOpen(false)}>
        <NewFormModal
          newFormModalOpen={newFormModalOpen}
          setNewFormModalOpen={setNewFormModalOpen}
        />
      </Modal>

      <Navbar />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-screen md:w-[80%] mx-auto mt-6">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-7"
          >
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ color: '#1a5c38' }}
            >
              Form Submissions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all patient form sessions
            </p>
          </motion.div>

          {/* Select-all checkbox row */}
          <div className="flex flex-row justify-between gap-2 mb-3 px-1">
            <div className="flex items-center gap-2 mb-3 px-1">
            <input
              type="checkbox"
              onChange={() => handleSelectAll(data)}
              checked={data.length > 0 && selectedRows.length === data.length}
            />
            <span className="text-xs text-gray-500">Select all</span>
          </div>
        <motion.button
            onClick={() => setNewFormModalOpen(true)}
            className="bg-[#1a5c38] px-4 py-2 text-white font-bold rounded-xl hover:bg-[#0f3d26] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Add form +
        </motion.button>
          </div>
          

          {/* <SearchInput /> */}

          {/* ✅ ReusableTable replaces old Table */}
          <ReusableTable
            data={data}
            columns={cols}
            rowKey="documentVersionId"
            perPage={8}
            searchFields={['documentVersionId', 'versionLabel']}
          />
        </div>
      )}
    </>
  )
}

export default Home