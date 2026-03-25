import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, Download, CheckCircle2, Clock, XCircle, AlertCircle,
  Search, ChevronUp, ChevronDown, ChevronsUpDown, FileText,
  Filter, RefreshCw
} from 'lucide-react'
import Navbar from '../components/Home/Navbar'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface FormSubmission {
  sessionId: string
  patientId: string
  formName: string
  status: 'completed' | 'pending' | 'expired' | 'failed'
  expiresIn: string        // e.g. "2d 4h", "Expired", "Never"
  filledAt: string | null  // ISO string or null if not filled
  createdAt: string        // ISO string
  link: string
}

type SortKey = keyof Pick<FormSubmission, 'sessionId' | 'patientId' | 'status' | 'expiresIn' | 'filledAt' | 'createdAt'>
type SortDir = 'asc' | 'desc' | null

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const DUMMY_SUBMISSIONS: FormSubmission[] = [
//   { sessionId: 'SES-00142', patientId: 'PAT-8821', formName: 'New Patient Registration',  status: 'completed', expiresIn: 'Never',   filledAt: '2025-03-18T10:23:00Z', createdAt: '2025-03-17T09:00:00Z', link: '/forms' },
//   { sessionId: 'SES-00143', patientId: 'PAT-4410', formName: 'HIPAA Consent',              status: 'pending',   expiresIn: '1d 6h',  filledAt: null,                   createdAt: '2025-03-18T11:15:00Z', link: 'https://example.com/forms/hipaa' },
//   { sessionId: 'SES-00144', patientId: 'PAT-3302', formName: 'Medical History Form',       status: 'expired',   expiresIn: 'Expired', filledAt: null,                   createdAt: '2025-03-10T08:00:00Z', link: 'https://example.com/forms/medical-history' },
//   { sessionId: 'SES-00145', patientId: 'PAT-7719', formName: 'Urgent Care Intake',         status: 'completed', expiresIn: 'Never',   filledAt: '2025-03-19T14:05:00Z', createdAt: '2025-03-19T13:50:00Z', link: 'https://example.com/forms/urgent-care' },
//   { sessionId: 'SES-00146', patientId: 'PAT-1155', formName: 'Annual Wellness Questionnaire', status: 'pending', expiresIn: '3d 2h', filledAt: null,                   createdAt: '2025-03-19T09:30:00Z', link: 'https://example.com/forms/wellness' },
//   { sessionId: 'SES-00147', patientId: 'PAT-9934', formName: 'PHQ-9 Depression Screener',  status: 'completed', expiresIn: 'Never',   filledAt: '2025-03-20T16:40:00Z', createdAt: '2025-03-20T15:00:00Z', link: 'https://example.com/forms/phq9' },
//   { sessionId: 'SES-00148', patientId: 'PAT-6670', formName: 'Cardiac Risk Assessment',    status: 'failed',    expiresIn: 'Expired', filledAt: null,                   createdAt: '2025-03-12T10:00:00Z', link: 'https://example.com/forms/cardiac' },
//   { sessionId: 'SES-00149', patientId: 'PAT-2281', formName: 'GAD-7 Anxiety Scale',        status: 'completed', expiresIn: 'Never',   filledAt: '2025-03-21T09:55:00Z', createdAt: '2025-03-21T09:00:00Z', link: 'https://example.com/forms/gad7' },
//   { sessionId: 'SES-00150', patientId: 'PAT-5543', formName: 'Insurance Verification',     status: 'pending',   expiresIn: '12h',    filledAt: null,                   createdAt: '2025-03-21T12:00:00Z', link: 'https://example.com/forms/insurance' },
//   { sessionId: 'SES-00151', patientId: 'PAT-8830', formName: 'Consent to Treat (Minor)',   status: 'completed', expiresIn: 'Never',   filledAt: '2025-03-22T11:10:00Z', createdAt: '2025-03-22T10:30:00Z', link: 'https://example.com/forms/consent-minor' },
//   { sessionId: 'SES-00152', patientId: 'PAT-3317', formName: 'Discharge Instructions',     status: 'expired',   expiresIn: 'Expired', filledAt: null,                   createdAt: '2025-03-13T07:00:00Z', link: 'https://example.com/forms/discharge' },
//   { sessionId: 'SES-00153', patientId: 'PAT-7701', formName: 'School Physical Form',       status: 'pending',   expiresIn: '2d 8h',  filledAt: null,                   createdAt: '2025-03-22T14:00:00Z', link: 'https://example.com/forms/school-physical' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (iso: string | null) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const statusConfig = {
  completed: { label: 'Completed', icon: CheckCircle2, bg: 'rgba(26,92,56,0.08)',   border: 'rgba(26,92,56,0.25)',   text: '#1a5c38',  dot: '#1a5c38'  },
  pending:   { label: 'Pending',   icon: Clock,        bg: 'rgba(202,138,4,0.08)',   border: 'rgba(202,138,4,0.3)',   text: '#b45309',  dot: '#d97706'  },
  expired:   { label: 'Expired',   icon: XCircle,      bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)',text: '#6b7280',  dot: '#9ca3af'  },
  failed:    { label: 'Failed',    icon: AlertCircle,  bg: 'rgba(155,28,58,0.08)',   border: 'rgba(155,28,58,0.25)', text: '#9b1c3a',  dot: '#9b1c3a'  },
}

// ── Sub-components ────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: FormSubmission['status'] }> = ({ status }) => {
  const c = statusConfig[status]
  const Icon = c.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <Icon size={11} />
      {c.label}
    </span>
  )
}

const SortIcon: React.FC<{ col: SortKey; sortKey: SortKey | null; sortDir: SortDir }> = ({ col, sortKey, sortDir }) => {
  if (sortKey !== col) return <ChevronsUpDown size={13} className="text-gray-300 ml-1" />
  if (sortDir === 'asc')  return <ChevronUp   size={13} style={{ color: '#1a5c38' }} className="ml-1" />
  if (sortDir === 'desc') return <ChevronDown  size={13} style={{ color: '#1a5c38' }} className="ml-1" />
  return null
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
const SubmissionPreviewModal: React.FC<{
  submission: FormSubmission | null
  onClose: () => void
}> = ({ submission, onClose }) => {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const handleClose = () => {
    onClose()
    setTimeout(() => { setLoaded(false); setErrored(false) }, 300)
  }

  return (
    <AnimatePresence>
      {submission && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div
              className="w-full max-w-3xl pointer-events-auto flex flex-col rounded-2xl overflow-hidden bg-white"
              style={{ height: 'min(86vh, 760px)', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0" style={{ backgroundColor: '#1a5c38' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Eye size={15} color="white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{submission.formName}</p>
                    <p className="text-xs text-white/55 mt-0.5">{submission.sessionId} · {submission.patientId}</p>
                  </div>
                </div>
                <button onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors duration-150">
                  ✕
                </button>
              </div>

              {/* URL bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex gap-1.5">
                  {['bg-red-400/60','bg-yellow-400/60','bg-green-400/60'].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                </div>
                <div className="flex-1 mx-2 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-400 font-mono truncate">{submission.link}</span>
                </div>
              </div>

              {/* iframe */}
              <div className="relative flex-1 min-h-0 bg-gray-50">
                {!loaded && !errored && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                      style={{ backgroundColor: 'rgba(26,92,56,0.08)', border: '1px solid rgba(26,92,56,0.15)' }}>
                      <RefreshCw size={18} color="#1a5c38" className="animate-spin" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Loading submission…</p>
                  </div>
                )}
                {errored && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50 p-8">
                    <AlertCircle size={28} color="#9b1c3a" className="mb-2" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">Can't load preview</p>
                    <a href={submission.link} target="_blank" rel="noopener noreferrer"
                      className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: '#1a5c38' }}>Open in New Tab</a>
                  </div>
                )}
                <iframe
                  key={submission.link}
                  src={submission.link}
                  title={submission.formName}
                  className="w-full h-full border-0"
                  onLoad={() => setLoaded(true)}
                  onError={() => setErrored(true)}
                  style={{ display: errored ? 'none' : 'block' }}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-shrink-0">
                <StatusBadge status={submission.status} />
                <button onClick={handleClose}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                  style={{ backgroundColor: '#1a5c38' }}>Close</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
const FormSubmissionsTable: React.FC = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FormSubmission['status'] | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [preview, setPreview] = useState<FormSubmission | null>(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir(null) }
  }

  const handleDownload = (sub: FormSubmission) => {
    const content = [
      `Session ID: ${sub.sessionId}`,
      `Patient ID: ${sub.patientId}`,
      `Form: ${sub.formName}`,
      `Status: ${sub.status}`,
      `Expires In: ${sub.expiresIn}`,
      `Filled At: ${fmt(sub.filledAt)}`,
      `Created At: ${fmt(sub.createdAt)}`,
      `Link: ${sub.link}`,
    ].join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${sub.sessionId}-${sub.patientId}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const filtered = DUMMY_SUBMISSIONS
    .filter(s => {
      const q = search.toLowerCase()
      const matchSearch = !q || s.sessionId.toLowerCase().includes(q) || s.patientId.toLowerCase().includes(q) || s.formName.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Stats
  const stats = {
    total: DUMMY_SUBMISSIONS.length,
    completed: DUMMY_SUBMISSIONS.filter(s => s.status === 'completed').length,
    pending:   DUMMY_SUBMISSIONS.filter(s => s.status === 'pending').length,
    expired:   DUMMY_SUBMISSIONS.filter(s => s.status === 'expired' || s.status === 'failed').length,
  }

  const COLS: { key: SortKey | null; label: string; sortable?: boolean }[] = [
    { key: 'sessionId',  label: 'Session ID',  sortable: true },
    { key: 'patientId',  label: 'Patient ID',  sortable: true },
    { key: null,         label: 'Form',        sortable: false },
    { key: 'status',     label: 'Status',      sortable: true },
    { key: 'expiresIn',  label: 'Expires In',  sortable: false },
    { key: 'filledAt',   label: 'Filled At',   sortable: true },
    { key: 'createdAt',  label: 'Created At',  sortable: true },
    { key: null,         label: 'Actions',     sortable: false },
  ]

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-7"
        >
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a5c38' }}>
            Form Submissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all patient form sessions</p>
        </motion.div>

        {/* ── Stat cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            { label: 'Total',     value: stats.total,     color: '#1a5c38', bg: 'rgba(26,92,56,0.06)',   border: 'rgba(26,92,56,0.15)'   },
            { label: 'Completed', value: stats.completed, color: '#1a5c38', bg: 'rgba(26,92,56,0.06)',   border: 'rgba(26,92,56,0.15)'   },
            { label: 'Pending',   value: stats.pending,   color: '#b45309', bg: 'rgba(202,138,4,0.06)',  border: 'rgba(202,138,4,0.2)'   },
            { label: 'Expired / Failed', value: stats.expired, color: '#9b1c3a', bg: 'rgba(155,28,58,0.06)', border: 'rgba(155,28,58,0.15)' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl px-4 py-3 border"
              style={{ backgroundColor: s.bg, borderColor: s.border }}
            >
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-4"
        >
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search session, patient, form…"
              className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none w-64 shadow-sm"
              onFocus={e => (e.target.style.borderColor = '#1a5c38')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={13} className="text-gray-400" />
            {(['all', 'completed', 'pending', 'expired', 'failed'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 border"
                style={statusFilter === s
                  ? { backgroundColor: '#1a5c38', color: 'white', borderColor: '#1a5c38' }
                  : { backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                }
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'rgba(26,92,56,0.05)', borderBottom: '1px solid rgba(26,92,56,0.12)' }}>
                  {COLS.map(col => (
                    <th
                      key={col.label}
                      className="px-4 py-3 text-left text-xs font-bold tracking-wide whitespace-nowrap select-none"
                      style={{ color: '#1a5c38' }}
                    >
                      {col.sortable && col.key ? (
                        <button
                          onClick={() => handleSort(col.key as SortKey)}
                          className="inline-flex items-center hover:opacity-75 transition-opacity"
                        >
                          {col.label}
                          <SortIcon col={col.key as SortKey} sortKey={sortKey} sortDir={sortDir} />
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Search size={20} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium text-sm">No submissions found</p>
                          <p className="text-gray-400 text-xs">Try adjusting your search or filter</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((sub, i) => (
                      <motion.tr
                        key={sub.sessionId}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className="group border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors duration-150"
                      >
                        {/* Session ID */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-semibold px-2 py-1 rounded-lg"
                            style={{ backgroundColor: 'rgba(26,92,56,0.06)', color: '#1a5c38' }}>
                            {sub.sessionId}
                          </span>
                        </td>

                        {/* Patient ID */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-medium text-gray-600">{sub.patientId}</span>
                        </td>

                        {/* Form name */}
                        <td className="px-4 py-3.5 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <FileText size={13} color="#9b1c3a" className="flex-shrink-0" />
                            <span className="text-xs font-medium text-gray-700 leading-snug line-clamp-1">{sub.formName}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <StatusBadge status={sub.status} />
                        </td>

                        {/* Expires in */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-xs font-medium ${sub.expiresIn === 'Expired' ? 'text-gray-400 line-through' : sub.expiresIn === 'Never' ? 'text-gray-400' : 'text-amber-600'}`}>
                            {sub.expiresIn}
                          </span>
                        </td>

                        {/* Filled at */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500">
                          {sub.filledAt
                            ? <span style={{ color: '#1a5c38' }} className="font-medium">{fmt(sub.filledAt)}</span>
                            : <span className="text-gray-300">—</span>
                          }
                        </td>

                        {/* Created at */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500">
                          {fmt(sub.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {/* Preview */}
                            <button
                              onClick={() => setPreview(sub)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                              style={{ backgroundColor: 'rgba(155,28,58,0.07)', border: '1px solid rgba(155,28,58,0.2)', color: '#9b1c3a' }}
                              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: '#9b1c3a', color: 'white' })}
                              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(155,28,58,0.07)', color: '#9b1c3a' })}
                              title="Preview submission"
                            >
                              <Eye size={12} />
                              <span className="hidden lg:inline">Preview</span>
                            </button>

                            {/* Download */}
                            <button
                              onClick={() => handleDownload(sub)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                              style={{ backgroundColor: 'rgba(26,92,56,0.07)', border: '1px solid rgba(26,92,56,0.22)', color: '#1a5c38' }}
                              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: '#1a5c38', color: 'white' })}
                              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(26,92,56,0.07)', color: '#1a5c38' })}
                              title="Download submission"
                            >
                              <Download size={12} />
                              <span className="hidden lg:inline">Download</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-gray-600">{filtered.length}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                    style={n === page
                      ? { backgroundColor: '#1a5c38', color: 'white' }
                      : { color: '#6b7280', border: '1px solid #e5e7eb' }
                    }
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Modal */}
      <SubmissionPreviewModal submission={preview} onClose={() => setPreview(null)} />
    </div>
    </>
  )
}

export default FormSubmissionsTable