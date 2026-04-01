// components/SubmissionsTable.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
export type SortDir = 'asc' | 'desc' | null

export interface ColumnDef<T> {
  key: keyof T | null
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode   // custom cell renderer
}

export interface ReusableTableProps<T extends { [key: string]: any }> {
  data: T[]
  columns: ColumnDef<T>[]
  rowKey: keyof T               // unique identifier field e.g. 'sessionId'
  perPage?: number
  searchFields?: (keyof T)[]    // which fields to search across
}

// ── Sort Icon ─────────────────────────────────────────────────────────────────
function SortIcon<T>({ col, sortKey, sortDir }: {
  col: keyof T
  sortKey: keyof T | null
  sortDir: SortDir
}) {
  if (sortKey !== col) return <ChevronsUpDown size={13} className="text-gray-300 ml-1" />
  if (sortDir === 'asc')  return <ChevronUp   size={13} style={{ color: '#1a5c38' }} className="ml-1" />
  if (sortDir === 'desc') return <ChevronDown  size={13} style={{ color: '#1a5c38' }} className="ml-1" />
  return null
}

// ── Reusable Table ────────────────────────────────────────────────────────────
function ReusableTable<T extends { [key: string]: any }>({
  data,
  columns,
  rowKey,
  perPage = 8,
  searchFields = [],
}: ReusableTableProps<T>) {
  const [search, setSearch]   = useState('')
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [page, setPage]       = useState(1)

  const handleSort = (key: keyof T) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir(null) }
  }

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  const filtered = data
    .filter(row => {
      if (!search || searchFields.length === 0) return true
      const q = search.toLowerCase()
      return searchFields.some(field =>
        String(row[field] ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      {/* ── Search ── */}
      {searchFields.length > 0 && (
        <div className="relative mb-4 w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search…"
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none w-full shadow-sm"
            onFocus={e => (e.target.style.borderColor = '#1a5c38')}
            onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* Head */}
            <thead>
              <tr style={{ backgroundColor: 'rgba(26,92,56,0.05)', borderBottom: '1px solid rgba(26,92,56,0.12)' }}>
                {columns.map(col => (
                  <th
                    key={String(col.key ?? col.label)}
                    className="px-4 py-3 text-left text-xs font-bold tracking-wide whitespace-nowrap select-none"
                    style={{ color: '#1a5c38' }}
                  >
                    {col.sortable && col.key ? (
                      <button
                        onClick={() => handleSort(col.key as keyof T)}
                        className="inline-flex items-center hover:opacity-75 transition-opacity"
                      >
                        {col.label}
                        <SortIcon<T>
                          col={col.key as keyof T}
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </button>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence initial={false}>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Search size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No records found</p>
                        <p className="text-gray-400 text-xs">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, i) => (
                    <motion.tr
                      key={String(row[rowKey])}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="group border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors duration-150"
                    >
                      {columns.map(col => (
                        <td
                          key={String(col.key ?? col.label)}
                          className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600"
                        >
                          {/* Use custom renderer if provided, otherwise raw value */}
                          {col.render
                            ? col.render(row)
                            : '—'
                          }
                        </td>
                      ))}
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
              Showing{' '}
              <span className="font-semibold text-gray-600">
                {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-600">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReusableTable