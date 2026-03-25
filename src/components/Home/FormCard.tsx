import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, Send } from 'lucide-react'

export interface Form {
  id: string
  name: string
  description: string
    link:string,
  category: string
}

interface FormCardProps {
  form: Form
  onSend: (form: Form) => void
  index: number
}

const FormCard: React.FC<FormCardProps> = ({ form, onSend, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#1a5c38]/40 hover:shadow-md transition-all duration-200"
    >
      {/* Green accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[#1a5c38] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 w-9 h-9 rounded-lg bg-[#1a5c38]/8 border border-[#1a5c38]/20 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(26,92,56,0.07)' }}>
            <FileText size={16} color="#1a5c38" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{form.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{form.description}</p>
            <div className="flex items-center gap-1.5 mt-2">
            
              <span className="text-gray-300 mx-0.5">·</span>
              <span className="text-xs font-medium" style={{ color: '#9b1c3a' }}>{form.category}</span>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSend(form) }}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:text-white"
          style={{
            backgroundColor: 'rgba(26,92,56,0.08)',
            border: '1px solid rgba(26,92,56,0.25)',
            color: '#1a5c38',
          }}
          onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: '#1a5c38', color: 'white' })}
          onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(26,92,56,0.08)', color: '#1a5c38' })}
        >
          <Send size={11} />
          Send
        </button>
      </div>
    </motion.div>
  )
}

export default FormCard