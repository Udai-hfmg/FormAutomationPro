import React from 'react'
import IconButton from '../UI/IconButton'
import { VscNewFile } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { FiRefreshCw } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { CiHome } from "react-icons/ci";

type Props = {
    newFormModalOpen: boolean,
    setNewFormModalOpen: (open: boolean) => void,
}

const Navbar = ({ newFormModalOpen, setNewFormModalOpen }: Props) => {
  return (
    <nav className="w-full bg-white text-gray-800 py-4 px-6 flex items-center justify-between">
      <div>
        <img src="https://cdn.prod.website-files.com/65943a67d00c014c2d920492/65943bb45991d7c7423aada3_logo.webp" alt="Horizon family group" className='w-60' />
      </div>
      <div className='flex flex-row gap-3'>
        <IconButton title='Home' onClick={() =>{} } icon={<CiHome />} />
        <IconButton title='Request New form' onClick={() =>{} } icon={<VscNewFile />} />
        <IconButton title='Reports' onClick={() => alert('Login Clicked')} icon={<TbReportAnalytics />} />
        <IconButton onClick={() => alert('Login Clicked')} icon={<FiRefreshCw />} />
      </div>

      <div className='flex gap-4'>
        <IconButton className='bg-[#7e1b34] text-white hover:bg-[#5a1526]' icon={<IoAdd />} title='Add Form' onClick={() => setNewFormModalOpen(true)} />
        <IconButton className='bg-[#1c5441] text-white rounded-full  text-center' icon={<FaRegUser />} onClick={() => alert('Login Clicked')} />
      </div>
    </nav>
  )
}

export default Navbar