import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, FolderOpen, Layers } from 'lucide-react'
import FacilityFolder, { type Facility } from './FaciliyFolder'
import SendFormModal from './SendFormModal'
import type { Form } from './FormCard'

// ── Sample Data ────────────────────────────────────────────────────────────────
const FACILITIES: Facility[] = [
  {
    id: 'f1',
    name: 'DR Aro Facility',
    location: 'Goshen, New York',
    color: 'green',
    forms: [
      { id: 'f1-1', name: 'OBG forms', description: 'Collects demographics, insurance, and emergency contact details for first-time patients.', category: 'Intake' ,link:"/forms" },
    
    ],
  },

]

// ── Component ──────────────────────────────────────────────────────────────────
const FacilityFolders: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sendModal, setSendModal] = useState<{ form: Form; facility: Facility } | null>(null)

  const totalForms = FACILITIES.reduce((sum, f) => sum + f.forms.length, 0)

  const filtered = useMemo(() => {
    if (!search.trim()) return FACILITIES
    const q = search.toLowerCase()
    return FACILITIES
      .map(fac => ({
        ...fac,
        forms: fac.forms.filter(
          f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
        ),
      }))
      .filter(fac => fac.name.toLowerCase().includes(q) || fac.forms.length > 0)
  }, [search])

  return (
    <div className="min-h-screen bg-white text-gray-800">

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          {/* Top bar */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a5c38' }}>
                Patient Forms
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Select a facility folder and send forms directly to your patients
              </p>
            </div>

            {/* Stats badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <FolderOpen size={15} color="#1a5c38" />
                <span className="text-sm font-bold text-gray-700">{FACILITIES.length}</span>
                <span className="text-xs text-gray-400">Facilities</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Layers size={15} color="#9b1c3a" />
                <span className="text-sm font-bold text-gray-700">{totalForms}</span>
                <span className="text-xs text-gray-400">Forms</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.38 }}
            className="relative mt-5 max-w-sm"
          >
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search facilities or forms…"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none transition-colors duration-150 shadow-sm"
              onFocus={e => (e.target.style.borderColor = '#1a5c38')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </motion.div>
        </motion.div>

        {/* Folders List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((facility, i) => (
              <FacilityFolder
                key={facility.id}
                facility={facility}
                index={i}
                onSendForm={(form, fac) => setSendModal({ form, facility: fac })}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                <Search size={22} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No results found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Send Modal */}
      <SendFormModal
        isOpen={!!sendModal}
        onClose={() => setSendModal(null)}
        form={sendModal?.form ?? null}
        facility={sendModal?.facility ?? null}
      />
    </div>
  )
}

export default FacilityFolders