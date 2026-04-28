import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Send, Eye, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { type Form } from './FormCard'

interface FormPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  form: Form | Form[] | null
  onSend?: (form: Form) => void
}

const FormPreviewModal: React.FC<FormPreviewModalProps> = ({ isOpen, onClose, form, onSend }) => {
  const [iframeState, setIframeState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [currentFormIndex, setCurrentFormIndex] = useState(0)

  const forms = Array.isArray(form) ? form : (form ? [form] : [])
  const currentForm = forms[currentFormIndex]
  const isMultiple = forms.length > 1


  console.log("Opening preview modal for form(s)", forms)
  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setIframeState('loading')
      setCurrentFormIndex(0)
    }, 300)
  }

  const handleSendFromPreview = () => {
    if (currentForm && onSend) {
      onSend(currentForm)
      handleClose()
    }
  }

  const getEmbedUrl = (formLink: string) => {
    try {
      if(Array.isArray(form)){
        const url = formLink
        return window.location.origin + "/forms/" + form.map(f=>f.link).join(",")
      }
      const url =formLink
      return url.toString()
    } catch {
      return formLink
    }
  }

  const handlePrevious = () => {
    setCurrentFormIndex(prev => (prev === 0 ? forms.length - 1 : prev - 1))
    setIframeState('loading')
  }

  const handleNext = () => {
    setCurrentFormIndex(prev => (prev === forms.length - 1 ? 0 : prev + 1))
    setIframeState('loading')
  }

  return (
    <AnimatePresence>
      {isOpen && currentForm && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div
              className="w-full max-w-4xl pointer-events-auto flex flex-col rounded-2xl overflow-hidden bg-white"
              style={{
                height: 'min(88vh, 800px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.22), 0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
                style={{ backgroundColor: '#1a5c38' }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Eye size={15} color="white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate leading-tight">{currentForm.name}</p>
                    <p className="text-xs text-white/55 mt-0.5 truncate">
                      {currentForm.category} · Preview
                      {isMultiple && ` · ${currentFormIndex + 1} of ${forms.length}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {isMultiple && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors duration-150"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors duration-150"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  <a
                    href={currentForm.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/15 transition-all duration-150"
                  >
                    <ExternalLink size={12} />
                    <span className="hidden sm:inline">Open</span>
                  </a>

                  {onSend && (
                    <button
                      onClick={handleSendFromPreview}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
                      onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'white', color: '#1a5c38' })}
                      onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' })}
                    >
                      <Send size={12} />
                      Send
                    </button>
                  )}

                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors duration-150"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* ── URL bar ── */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-2 px-3 py-1 bg-white border border-gray-200 rounded-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(26,92,56,0.25)' }}>
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                      <path d="M6 1a5 5 0 100 10A5 5 0 006 1z" stroke="#1a5c38" strokeWidth="1" fill="none"/>
                      <path d="M6 3.5v2.5l1.5 1.5" stroke="#1a5c38" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 truncate font-mono">{getEmbedUrl(currentForm.link)}</span>
                </div>
              </div>

              {/* ── iframe area ── */}
              <div className="relative flex-1 min-h-0 bg-gray-50">
                <AnimatePresence>
                  {iframeState === 'loading' && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10"
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: 'rgba(26,92,56,0.08)', border: '1px solid rgba(26,92,56,0.15)' }}>
                        <Loader2 size={22} color="#1a5c38" className="animate-spin" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Loading form…</p>
                      <p className="text-xs text-gray-400 mt-0.5">This may take a moment</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {iframeState === 'error' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10 p-8"
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: 'rgba(155,28,58,0.08)', border: '1px solid rgba(155,28,58,0.2)' }}>
                        <AlertCircle size={22} color="#9b1c3a" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Can't load preview</p>
                      <p className="text-xs text-gray-400 text-center max-w-xs mb-4">
                        This form can't be embedded. Open it directly in a new tab to view it.
                      </p>
                      <a
                        href={currentForm.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors duration-150"
                        style={{ backgroundColor: '#1a5c38' }}
                      >
                        <ExternalLink size={14} />
                        Open in New Tab
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>

                <iframe
                  key={`${currentForm.link}-${currentFormIndex}`}
                  src={getEmbedUrl(currentForm.link)}
                  title={currentForm.name}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeState('loaded')}
                  onError={() => setIframeState('error')}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  style={{ display: iframeState === 'error' ? 'none' : 'block' }}
                />
              </div>

              {/* ── Footer ── */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white flex-shrink-0">
                <p className="text-xs text-gray-400">
                  Previewing · <span className="font-medium text-gray-600">{currentForm.name}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClose}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    Close
                  </button>
                  {onSend && (
                    <button
                      onClick={handleSendFromPreview}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors duration-150"
                      style={{ backgroundColor: '#1a5c38' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#155030')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#1a5c38')}
                    >
                      <Send size={12} />
                      Send to Patient
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FormPreviewModal