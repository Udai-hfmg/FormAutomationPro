import React, { useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { ChevronRight, Building2, FolderOpen, Folder } from 'lucide-react'

import FormCard, { type Form } from './FormCard'
import { useGetArchivedFacilityIdsQuery, useGetArchivedFormsByIdsQuery } from '../../redux/api/DocumentSlice'



export interface Facility {

  officeid: string

  officeName: string

  state: string

  city: string 

  addressLine1: string

  addressLine2?: string

  isActive: boolean

  color?: 'green' | 'red' | 'green-light' | 'red-light'

  forms?: Form[]

  phone?: string

  zipcode?: string

}



interface FacilityFolderProps {

  facility: Facility

  index: number

  onSendForm: (form: Form, facility: Facility) => void

}



// Alternates green / red per facility for visual rhythm

const colorSchemes = {

  green: {

    iconBg: 'rgba(26,92,56,0.08)',

    iconBorder: 'rgba(26,92,56,0.2)',

    iconColor: '#1a5c38',

    dot: '#1a5c38',

    count: '#1a5c38',

    headerHover: 'rgba(26,92,56,0.03)',

    openBorder: 'rgba(26,92,56,0.25)',

  },

  red: {

    iconBg: 'rgba(155,28,58,0.08)',

    iconBorder: 'rgba(155,28,58,0.2)',

    iconColor: '#9b1c3a',

    dot: '#9b1c3a',

    count: '#9b1c3a',

    headerHover: 'rgba(155,28,58,0.03)',

    openBorder: 'rgba(155,28,58,0.25)',

  },

}



const FacilityFolder: React.FC<FacilityFolderProps> = ({ facility, index, onSendForm }) => {

  const [isOpen, setIsOpen] = useState(false)
  const [formCount, setFormCount] = useState(0)
  console.log("Rendering folder for facility", facility)
  const c = colorSchemes[index % 2 === 0 ? 'green' : 'red']

  const {data:archivedIds , isLoading:isArchivedIdsLoading , isError:isArchivedIdsError} = useGetArchivedFacilityIdsQuery(facility.officeid)
  console.log("Archived IDs for facility", facility.officeid, archivedIds)

  // get no of forms through facility id
  async function getFormCount() {
    try{
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/DocumentTypeVersion/form/count?id=${facility.officeid}`)
      const data = await response.json()
      setFormCount(data)
      console.log("Form count for facility", facility.officeid, data)
    }catch(error){
      console.error("Error fetching form count", error)
    }
  }

  useEffect(() => {
    if(facility.officeid){
      getFormCount()
    }
  }, [facility.officeid])
  
  return (

    <motion.div

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}

      className="rounded-2xl border bg-white overflow-hidden transition-all duration-300"

      style={{

        borderColor: isOpen ? c.openBorder : 'rgba(0,0,0,0.09)',

        boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.05)',

      }}

    >

      {/* Folder Header */}

      <button

        onClick={() => setIsOpen(v => !v)}

        className="w-full flex items-center gap-4 p-5 text-left transition-colors duration-200"

        style={{ backgroundColor: isOpen ? c.headerHover : 'transparent' }}

        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = c.headerHover}

        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = isOpen ? c.headerHover : 'transparent'}

      >

        {/* Folder Icon */}

        <div

          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"

          style={{ backgroundColor: c.iconBg, border: `1px solid ${c.iconBorder}` }}

        >

          <AnimatePresence mode="wait" initial={false}>

            {isOpen ? (

              <motion.div key="open" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.14 }}>

                <FolderOpen size={22} color={c.iconColor} />

              </motion.div>

            ) : (

              <motion.div key="closed" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.14 }}>

                <Folder size={22} color={c.iconColor} />

              </motion.div>

            )}

          </AnimatePresence>

        </div>



        {/* Info */}

        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2 mb-0.5">

            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot }} />

            <h3 className="text-base font-bold text-gray-800 truncate">{facility.officeName}</h3>

          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">

            <Building2 size={11} />

            <span>{facility.city}, {facility.state}</span>

            <span className="text-gray-300 mx-0.5">·</span>

            <span className="font-semibold" style={{ color: c.count }}>

              {formCount ?? 0} {formCount === 1 ? 'Form' : 'Forms'}

            </span>

          </div>

        </div>



        {/* Chevron */}

        <motion.div

          animate={{ rotate: isOpen ? 90 : 0 }}

          transition={{ duration: 0.2, ease: 'easeInOut' }}

          className="flex-shrink-0 text-gray-400"

        >

          <ChevronRight size={18} />

        </motion.div>

      </button>



      {/* Forms Grid */}

      <AnimatePresence initial={false}>

        {isOpen && (

          <motion.div

            key="forms"

            initial={{ height: 0, opacity: 0 }}

            animate={{ height: 'auto', opacity: 1 }}

            exit={{ height: 0, opacity: 0 }}

            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}

            className="overflow-hidden"

          >

            {/* Divider */}

            <div className="mx-5 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />

            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

              {(archivedIds || []).map((form, i) => (

                <FormCard

                  key={form.id}

                  form={{
                    id: form.id,
                    name: form.label,
                    description: "Archived Form",
                    category: "Archived",
                    link:"" , 
                    formIds:form.formIds
                  }}

                

                  index={i}

                  onSend={(f) => onSendForm(f, facility)}

                />

              ))}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.div>

  )

}



export default FacilityFolder