import React, { useState } from 'react'
import { motion } from 'framer-motion'

import Navbar from '../components/Home/Navbar'
import SearchInput from '../components/UI/SearchInput'
import { Modal } from '../components/Home/Modal'
import NewFormModal from '../components/Home/NewFormModal'
import { useGetDocumentsQuery, useGetDocumentTypesQuery, usePostDocumentVersionMutation } from '../redux/api/DocumentSlice'
import SendFormModal from '../components/Home/SendFormModal'
import FloatingActionBar from '../components/Home/FloatingActionBar'
import IconButton from '../components/UI/IconButton'
import { FaEye } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import Loading from '../components/Home/Loading'
import ReusableTable, { type ColumnDef } from '../components/UI/SubmissionTable'
import ArchiveFormModal from '../components/Home/ArcheiveFormModal'
import NYAdvanceDirective from '../components/Forms/NYAdvanceDirective'
import { useNavigate } from "react-router";
import Dropdown from '../components/UI/Dropdown'
import formTypes from '../data/formType.json'
import type { Form } from '../components/Home/FormCard'
import FormPreviewModal from '../components/Home/FormPreviewModal'

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
            onClick={() => {
              setSingleOpen(true)
              setSelectedSingleRow(row)
            }}
          />
          <IconButton
            icon={<IoIosSend />}
            onClick={() => {
              setSelectedSingleRow(row)
              setSendModalOpen(true)
            }}
          />
        </div>
      ),
    },
  ]


// ── Home ──────────────────────────────────────────────────────────────────────
const Home = () => {
  const [newFormModalOpen, setNewFormModalOpen] = useState(false)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedSingleRow, setSelectedSingleRow] = useState<any>(null)
  const [singleOpen, setSingleOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [onArchiveOpen, setOnArchiveOpen] = useState(false)

  // form states 
  const [label, setLabel] = useState('')
  const [documentType, setDocumentType] = useState<string>("")
  const [documentVersion, setDocumentVersion] = useState('')
  const [retiredDate, setRetiredDate] = useState<string>('')

  const navigate = useNavigate();

  const { data = [], isLoading } = useGetDocumentsQuery('documents')
  const { data: documentTypes = [] } = useGetDocumentTypesQuery("documentTypes")
  const [createDocumentVersion, { isLoading: isCreatingDocumentVersion, error: createDocumentVersionError }] = usePostDocumentVersionMutation()

  console.log("this is data kfalkdfjakdj", documentTypes)

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

  const formData: Form[] = data.map((row: any) => ({
    id: String(row.documentVersionId),
    name: row.versionLabel ?? String(row.documentVersionId),
    description: `Type: ${row.documentType?.name ?? '—'}`,
    link: `${window.location.origin}/forms/${row.templatePath}`,
    category: row.documentType?.name ?? 'Uncategorized',
  }))

  function onArche() {
    setOnArchiveOpen(!onArchiveOpen)
  }

  async function handleFormVersionSubmit(e: React.FormEvent) {
    e.preventDefault();
    try{
      const response = await createDocumentVersion({
        versionLabel: label,
        documentTypeId: Number(documentType),
        templatePath: documentVersion,
        retiredDate: retiredDate ? new Date(retiredDate).toISOString() : null
      }).unwrap()
      console.log("create document version response", response)
    }catch(err){
      console.error('Error submitting form version:', err)
    }
  }

  return (
    <>
      {/* Send modals */}
      <SendFormModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        facility={
          selectedRows?.length
            ? data
              .filter((row: any) => selectedRows.includes(row.documentVersionId))
              .map((row: any) => ({
                id: String(row.documentVersionId),
                name: row.versionLabel ?? String(row.documentVersionId),
                templatePath: row.templatePath,
              }))
            : selectedSingleRow
              ? data
                .filter(
                  (row: any) =>
                    row.documentVersionId === selectedSingleRow.documentVersionId
                )
                .map((row: any) => ({
                  id: String(row.documentVersionId),
                  name: row.versionLabel ?? String(row.documentVersionId),
                  templatePath: row.templatePath,
                }))
              : []
        }
      />
      {/* <SendFormModal
        isOpen={singleOpen}
        onClose={() => setSingleOpen(false)}
        // templatePath={singleOpen ? selectedSingleRow?.templatePath : ''}
      /> */}

      <FormPreviewModal isOpen={singleOpen} onClose={()=>setSingleOpen(false)} form={formData.find(f=>f.id === String(selectedSingleRow?.documentVersionId))??null} />

      <ArchiveFormModal forms={selectedRows} isOpen={onArchiveOpen} onClose={onArche} />

      {/* Floating action bar */}
      {selectedRows.length > 0 && (
        <FloatingActionBar
          selectedCount={selectedRows.length}
          onArchive={() => onArche()}
          onDelete={() => console.log('delete', selectedRows)}
          onSend={handleSend}
          onClear={() => setSelectedRows([])}

        />
      )}

      <Modal isOpen={newFormModalOpen} onClose={() => setNewFormModalOpen(false)}>
        <div className="p-8 bg-white rounded-lg w-full">
          <h1>Add form Version</h1>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 pb-4 border-b border-gray-200"
          >
            <p className="text-sm text-gray-600">Create a new form version to manage your documents</p>
          </motion.div>
          <form className="space-y-6" onSubmit={handleFormVersionSubmit}>
            {/* Label Input */}
            <div>
              <label htmlFor="label" className="block text-sm font-semibold text-gray-700 mb-2">
                Label
              </label>
              <input
                type="text"
                name="Label"
                id="label"
                onChange={e=>setLabel(e.target.value)}
                placeholder="Enter form label"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a5c38] focus:border-transparent transition-all"
              />
            </div>

            {/* Document Type */}
          <div className='flex flex-col justify-stretch gap-4'>
            <Dropdown
              title='Document type'
              id="documentType"
              list={documentTypes.map((doc: any) => ({ label: doc.name, value: doc.documentTypeId }))}
              selected={documentType}
              setSelect={setDocumentType}
              listContainerStyle={{ width: "100%" }}
            />

            {/* File Type */}

            <Dropdown
              title='File version'
              id="filetype"
              list={formTypes.map((doc: any) => ({ label: doc.name, value: doc.registry }))}
              selected={documentVersion}
              setSelect={setDocumentVersion}
              listContainerStyle={{ width: "100%" }}
            />
</div>

            {/* Retired Date */}
            <div>
              <label htmlFor="retiredDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Retired Date
              </label>
              <input
                type="date"
                id="retiredDate"
                name="retiredDate"
                onChange={e=>setRetiredDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a5c38] focus:border-transparent transition-all"
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3"
              >
                <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
                <p className="text-sm text-amber-800 leading-relaxed">
                If you don't select a retired date, the form will be active without any expiration. Patient signatures will also remain valid without expiration.
                </p>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-[#1a5c38] text-white font-semibold py-2.5 rounded-lg hover:bg-[#0f3d26] transition-colors mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isCreatingDocumentVersion}
              style={{ opacity: isCreatingDocumentVersion ? 0.6 : 1 }}
            >
              {isCreatingDocumentVersion ? 'Creating...' : 'Create Form Version'}
            </motion.button>
          </form>
        </div>
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
              Manage files and folders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Send and create new form with existing files
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