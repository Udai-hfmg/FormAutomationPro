import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Send, Eye } from 'lucide-react'
import FormPreviewModal from './FormPreviewModal'
import { useGetArchivedFormsByIdsQuery } from '../../redux/api/DocumentSlice'

export interface Form {
  id: string
  name: string
  description: string
  link: string
  category: string , 
  formIds:number[]
}

interface FormCardProps {
  form: Form
  onSend: (form: Form) => void
  onPreview?: (form: Form) => void
  index: number
}

const FormCard: React.FC<FormCardProps> = ({ form, onSend, onPreview, index }) => {

    const [isOpen , setIsOpen] = React.useState(false)
    const {data:archivedForms , isLoading:isArchivedFormsLoading , isError:isArchivedFormsError} = useGetArchivedFormsByIdsQuery(form.formIds ?? [], {skip: !form.formIds || form.formIds.length === 0})
    console.log("Archived forms for facility", archivedForms)

    const selectedArchivedForm = archivedForms?.map((f: any)=>({
      id:f.documentVersionId,
      name:f.versionLabel,
      templatePath:f.templatePath,
    }))

    console.log("Transformed archived forms", selectedArchivedForm)

    const transformedArchivedForms: Form[] = selectedArchivedForm?.map((f: any) => ({
      id: f.id,
      name: f.name,
      description: '',
      link: f.templatePath || '',
      category: form.category,
      formIds: [],
    })) || []

  return (
    <>
      <FormPreviewModal isOpen={isOpen}  onClose={() => {setIsOpen(false)}} form={transformedArchivedForms} />
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#1a5c38]/40 hover:shadow-md transition-all duration-200"
    >
      {/* Green accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[#1a5c38] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(26,92,56,0.07)', border: '1px solid rgba(26,92,56,0.15)' }}
        >
          <FileText size={16} color="#1a5c38" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{form.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{form.description}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs font-medium" style={{ color: '#9b1c3a' }}>{form.category}</span>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {/* Preview */}
        <button
          onClick={(e) => {setIsOpen(true) }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
          style={{
            backgroundColor: 'rgba(155,28,58,0.06)',
            border: '1px solid rgba(155,28,58,0.2)',
            color: '#9b1c3a',
          }}
          onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: '#9b1c3a', color: 'white' })}
          onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'rgba(155,28,58,0.06)', color: '#9b1c3a' })}
        >
          <Eye size={11} />
          Preview
        </button>

        {/* Send */}
        <button
          onClick={(e) => { e.stopPropagation(); onSend(selectedArchivedForm) }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
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
    </>
  )
}

export default FormCard