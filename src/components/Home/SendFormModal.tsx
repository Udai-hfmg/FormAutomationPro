import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Send, CheckCircle, FileText, Building2 } from 'lucide-react'
import {type  Form } from './FormCard'
import {type Facility } from './FaciliyFolder'

interface SendFormModalProps {
  isOpen: boolean
  onClose: () => void
  form: Form | null
  facility: Facility | null
}

const SendFormModal: React.FC<SendFormModalProps> = ({ isOpen, onClose, form, facility }) => {
  const [step, setStep] = useState<'compose' | 'success'>('compose')
  const [patientName, setPatientName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sendVia, setSendVia] = useState<'email' | 'sms'>('email')

  const canSend = patientName && (sendVia === 'email' ? email : phone)

  const handleSend = () => {
    if (!canSend) return
    setStep('success')
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('compose')
      setPatientName('')
      setEmail('')
      setPhone('')
    }, 300)
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-colors duration-150"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 18 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden pointer-events-auto"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)' }}>

              {/* Header — green stripe */}
              <div className="px-6 py-4 flex items-center justify-between"
                style={{ backgroundColor: '#1a5c38' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Send size={15} color="white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-tight">Send Form to Patient</h2>
                    <p className="text-xs text-white/60 mt-0.5 truncate max-w-[220px]">{form?.name}</p>
                  </div>
                </div>
                <button onClick={handleClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors duration-150">
                  <X size={15} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {step === 'compose' ? (
                  <motion.div
                    key="compose"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                    className="p-6 space-y-4"
                  >
                    {/* Form info pill */}
                    <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border"
                      style={{ backgroundColor: 'rgba(26,92,56,0.04)', borderColor: 'rgba(26,92,56,0.15)' }}>
                      <FileText size={14} color="#1a5c38" className="flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{form?.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Building2 size={11} className="text-gray-400" />
                          <p className="text-xs text-gray-400 truncate">{facility?.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Patient name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Patient Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)}
                          placeholder="Full name"
                          className={`${inputClass} pl-9 pr-4`}
                          style={{ borderColor: patientName ? 'rgba(26,92,56,0.4)' : undefined }}
                          onFocus={e => (e.target.style.borderColor = '#1a5c38')}
                          onBlur={e => (e.target.style.borderColor = patientName ? 'rgba(26,92,56,0.4)' : '#e5e7eb')}
                        />
                      </div>
                    </div>

                    {/* Send via toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Send via</label>
                      <div className="flex bg-gray-100 rounded-xl p-1">
                        {(['email', 'sms'] as const).map(opt => (
                          <button key={opt} onClick={() => setSendVia(opt)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                            style={sendVia === opt
                              ? { backgroundColor: '#1a5c38', color: 'white', boxShadow: '0 1px 4px rgba(26,92,56,0.3)' }
                              : { color: '#6b7280' }
                            }>
                            {opt === 'email' ? <Mail size={12} /> : <Phone size={12} />}
                            {opt === 'email' ? 'Email' : 'SMS'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        {sendVia === 'email' ? 'Email Address' : 'Phone Number'}
                      </label>
                      <div className="relative">
                        {sendVia === 'email'
                          ? <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          : <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        }
                        <input
                          type={sendVia === 'email' ? 'email' : 'tel'}
                          value={sendVia === 'email' ? email : phone}
                          onChange={e => sendVia === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                          placeholder={sendVia === 'email' ? 'patient@email.com' : '+1 (555) 000-0000'}
                          className={`${inputClass} pl-9 pr-4`}
                          onFocus={e => (e.target.style.borderColor = '#1a5c38')}
                          onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors duration-150">
                        Cancel
                      </button>
                      <motion.button
                        whileHover={canSend ? { scale: 1.02 } : {}}
                        whileTap={canSend ? { scale: 0.97 } : {}}
                        onClick={handleSend}
                        disabled={!canSend}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150"
                        style={{
                          backgroundColor: canSend ? '#1a5c38' : '#d1fae5',
                          color: canSend ? 'white' : '#6b7280',
                          cursor: canSend ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <Send size={14} />
                        Send Form
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="p-8 flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 18 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: 'rgba(26,92,56,0.1)', border: '2px solid rgba(26,92,56,0.2)' }}
                    >
                      <CheckCircle size={30} color="#1a5c38" />
                    </motion.div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">Form Sent Successfully!</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-semibold text-gray-700">{form?.name}</span> was sent to
                    </p>
                    <p className="text-sm font-bold mb-6" style={{ color: '#1a5c38' }}>{patientName}</p>
                    <button onClick={handleClose}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-150"
                      style={{ backgroundColor: '#1a5c38' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#155030')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#1a5c38')}
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SendFormModal