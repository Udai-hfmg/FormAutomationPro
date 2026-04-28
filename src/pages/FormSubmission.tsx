import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, Download, CheckCircle2, Clock, XCircle, AlertCircle,
  FileText, Filter, RefreshCw, Search
} from 'lucide-react'
import Navbar from '../components/Home/Navbar'
import ReusableTable, { type ColumnDef } from '../components/UI/SubmissionTable'
import { useGetSubmissionDocumentQuery } from '../redux/api/DocumentSlice'
import SearchFacility from '../components/Home/SearchFacility'
import { useLazyGetSessionbyOfficeIdsQuery } from '../redux/api/PatienSlice'

// ── API shape (raw from backend) ──────────────────────────────────────────────
interface ApiSubmission {
  sessionId: string
  patientId: number | null
  senderId: number
  formIds: string
  status: 0 | 1 | 2          // 0 = pending, 1 = completed, 2 = expired
  expiresAt: string
  createdAt: string
}

// ── UI shape (what the table consumes) ───────────────────────────────────────
export interface FormSubmission {
  sessionId: string
  patientId: string
  senderId: string
  formIds: string
  status: 'pending' | 'completed' | 'expired'
  expiresIn: string           // computed e.g. "2d 4h" | "Expired"
  expiresAt: string
  createdAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<number, FormSubmission['status']> = {
  0: 'pending',
  1: 'completed',
  2: 'expired',
}

const fmt = (iso: string | null) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  )
}

// Compute human-readable time remaining from expiresAt
const computeExpiresIn = (expiresAt: string, status: FormSubmission['status']): string => {
  if (status === 'completed') return 'Never'
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const totalMins = Math.floor(diff / 60000)
  const days = Math.floor(totalMins / 1440)
  const hours = Math.floor((totalMins % 1440) / 60)
  const mins = totalMins % 60
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

// Map API → UI shape
const mapSubmission = (s: ApiSubmission): FormSubmission => {
  const status = STATUS_MAP[s.status] ?? 'pending'
  return {
    sessionId: s.sessionId,
    patientId: s.patientId != null ? `${s.patientId}` : '—',
    senderId: `${s.senderId}`,
    formIds: s.formIds,
    status,
    expiresIn: computeExpiresIn(s.expiresAt, status),
    expiresAt: s.expiresAt,
    createdAt: s.createdAt,
  }
}

// ── Status badge ──────────────────────────────────────────────────────────────
const statusConfig = {
  completed: { label: 'Completed', icon: CheckCircle2, bg: 'rgba(26,92,56,0.08)', border: 'rgba(26,92,56,0.25)', text: '#1a5c38' },
  pending: { label: 'Pending', icon: Clock, bg: 'rgba(202,138,4,0.08)', border: 'rgba(202,138,4,0.3)', text: '#b45309' },
  expired: { label: 'Expired', icon: XCircle, bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)', text: '#6b7280' },
}

const StatusBadge: React.FC<{ status: FormSubmission['status'] }> = ({ status }) => {
  const c = statusConfig[status]
  const Icon = c.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <Icon size={11} /> {c.label}
    </span>
  )
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

  const previewLink = submission
    ? `/subforms?token=${submission.sessionId}&preview=true`
    : ''

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
                    <p className="text-sm font-bold text-white truncate">Forms: {submission.formIds}</p>
                    <p className="text-xs text-white/55 mt-0.5">
                      {submission.sessionId.slice(0, 8)}… · {submission.patientId}
                    </p>
                  </div>
                </div>
                <button onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors">
                  ✕
                </button>
              </div>

              {/* URL bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex gap-1.5">
                  {['bg-red-400/60', 'bg-yellow-400/60', 'bg-green-400/60'].map(c =>
                    <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  )}
                </div>
                <div className="flex-1 mx-2 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-400 font-mono">{previewLink}</span>
                </div>
              </div>

              {/* iframe */}
              <div className="relative flex-1 min-h-0 bg-gray-50">
                {!loaded && !errored && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50">
                    <RefreshCw size={18} color="#1a5c38" className="animate-spin mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Loading submission…</p>
                  </div>
                )}
                {errored && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50 p-8">
                    <AlertCircle size={28} color="#9b1c3a" className="mb-2" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">Can't load preview</p>
                    <a href={previewLink} target="_blank" rel="noopener noreferrer"
                      className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: '#1a5c38' }}>Open in New Tab</a>
                  </div>
                )}
                <iframe
                  key={previewLink}
                  src={previewLink}
                  title="Form Preview"
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
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
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
  const [preview, setPreview] = useState<FormSubmission | null>(null)
  const [statusFilter, setStatusFilter] = useState<FormSubmission['status'] | 'all'>('all')
  const [officeId, setOfficeId] = useState<number[]>([])

  const { data: rawData, isLoading, isError } = useGetSubmissionDocumentQuery("submissions")
  const [getsubmissionsByOfficeIds, { data: filteredData, isLoading: isFilteredLoading, isError: isFilteredError }] = useLazyGetSessionbyOfficeIdsQuery()
  // Map + filter by status pill


  // Stat cards derived from ALL data (before status filter)
  const all = (rawData ?? []).map(mapSubmission)
  const stats = {
    total: all.length,
    completed: all.filter((s: any) => s.status === 'completed').length,
    pending: all.filter((s: any) => s.status === 'pending').length,
    expired: all.filter((s: any) => s.status === 'expired').length,
  }

  const handleDownload = (sub: FormSubmission) => {
    const url = `/subforms?token=${sub.sessionId}&preview=true`
    const popup = window.open(url, '_blank', 'width=900,height=700')
    if (!popup) return

    popup.addEventListener('load', () => {
      // Wait for React + data fetch to finish rendering
      setTimeout(() => {
        popup.focus()
        popup.print()
      }, 2500)          // bump up if your form is slow to load
    })
  }

  useEffect(() => {
    if (officeId.length > 0) {
      getsubmissionsByOfficeIds(officeId)
    }
  }, [officeId])

  const sourceData = officeId.length > 0 ? filteredData : rawData

  const submissions: FormSubmission[] = (sourceData ?? [])
    .map(mapSubmission)
    .filter((s: any) => statusFilter === 'all' || s.status === statusFilter)

  console.log("Mapped submissions", submissions)

  // ── Column definitions ────────────────────────────────────────────────────
  const columns: ColumnDef<FormSubmission>[] = [
    {
      key: 'sessionId',
      label: 'Session ID',
      sortable: true,
      render: (row: FormSubmission) => (
        <span className="font-mono text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ backgroundColor: 'rgba(26,92,56,0.06)', color: '#1a5c38' }}>
          {row.sessionId.slice(0, 8)}…
        </span>
      ),
    },
    {
      key: 'patientId',
      label: 'Patient ID',
      sortable: true,
      render: (row: FormSubmission) => (
        <span className="font-mono text-xs font-medium text-gray-600">{row.patientId}</span>
      ),
    },
    {
      key: 'senderId',
      label: 'Sender ID',
      sortable: true,
      render: (row: FormSubmission) => (
        <span className="font-mono text-xs font-medium text-gray-500">{row.senderId}</span>
      ),
    },
    {
      key: 'formIds',
      label: 'Form IDs',
      sortable: false,
      render: (row: FormSubmission) => (
        <div className="flex items-center gap-1.5">
          <FileText size={13} color="#9b1c3a" className="flex-shrink-0" />
          <span className="text-xs font-medium text-gray-700">{row.formIds}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row: FormSubmission) => <StatusBadge status={row.status} />,
    },
    {
      key: 'expiresIn',
      label: 'Expires In',
      sortable: false,
      render: (row: FormSubmission) => (
        <span className={`text-xs font-medium ${row.expiresIn === 'Expired' ? 'text-gray-400 line-through' :
            row.expiresIn === 'Never' ? 'text-gray-400' : 'text-amber-600'
          }`}>
          {row.expiresIn}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (row: FormSubmission) => <span className="text-xs text-gray-500">{fmt(row.createdAt)}</span>,
    },
    {
      key: null,
      label: 'Actions',
      render: (row: FormSubmission) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPreview(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{ backgroundColor: 'rgba(155,28,58,0.07)', border: '1px solid rgba(155,28,58,0.2)', color: '#9b1c3a' }}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: '#9b1c3a', color: 'white' })}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(155,28,58,0.07)', color: '#9b1c3a' })}
          >
            <Eye size={12} /><span className="hidden lg:inline">Preview</span>
          </button>
          <button
            onClick={() => handleDownload(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{ backgroundColor: 'rgba(26,92,56,0.07)', border: '1px solid rgba(26,92,56,0.22)', color: '#1a5c38' }}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: '#1a5c38', color: 'white' })}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(26,92,56,0.07)', color: '#1a5c38' })}
          >
            <Download size={12} /><span className="hidden lg:inline">Download</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }} className="mb-7">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a5c38' }}>
              Form Submissions
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage all patient form sessions</p>
          </motion.div>

          {/* Stat cards */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: stats.total, color: '#1a5c38', bg: 'rgba(26,92,56,0.06)', border: 'rgba(26,92,56,0.15)' },
              { label: 'Completed', value: stats.completed, color: '#1a5c38', bg: 'rgba(26,92,56,0.06)', border: 'rgba(26,92,56,0.15)' },
              { label: 'Pending', value: stats.pending, color: '#b45309', bg: 'rgba(202,138,4,0.06)', border: 'rgba(202,138,4,0.2)' },
              { label: 'Expired', value: stats.expired, color: '#9b1c3a', bg: 'rgba(155,28,58,0.06)', border: 'rgba(155,28,58,0.15)' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-xl px-4 py-3 border"
                style={{ backgroundColor: s.bg, borderColor: s.border }}>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Status filter pills */}
          <div className='flex flex-row justify-between'>
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {(['all', 'completed', 'pending', 'expired'] as const).map(s => (
                <button key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 border"
                  style={statusFilter === s
                    ? { backgroundColor: '#1a5c38', color: 'white', borderColor: '#1a5c38' }
                    : { backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                  }>
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className='w-1/4 scroll-auto h-10'>
              <SearchFacility ids={officeId} setFacilityIds={setOfficeId} />

            </div>
          </div>

          {/* Loading / Error states */}
          {(isLoading || isFilteredLoading) && (
            <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Loading submissions…</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center py-20 text-red-400 gap-2">
              <AlertCircle size={16} />
              <span className="text-sm">Failed to load submissions</span>
            </div>
          )}

          {!(isLoading || isFilteredLoading) && !(isError || isFilteredError) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}>
              <ReusableTable<FormSubmission>
                data={submissions}
                columns={columns}
                rowKey="sessionId"
                perPage={8}
                searchFields={['sessionId', 'patientId', 'senderId', 'formIds']}
              />
            </motion.div>
          )}
        </div>

        <SubmissionPreviewModal submission={preview} onClose={() => setPreview(null)} />
      </div>
    </>
  )
}

export default FormSubmissionsTable