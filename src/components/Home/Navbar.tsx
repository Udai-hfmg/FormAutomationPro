import React, { useRef, useState, useEffect } from 'react'
import IconButton from '../UI/IconButton'
import { VscNewFile } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { FiRefreshCw } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { HiOutlineLogout } from "react-icons/hi";
import { RiAccountCircleLine } from "react-icons/ri";
import { useNavigate } from 'react-router'
import { useAppData } from '../../context/AppDataContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAppData();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white text-gray-800 py-4 px-6 flex items-center justify-between items-center">
      <div>
        <img src="https://cdn.prod.website-files.com/65943a67d00c014c2d920492/65943bb45991d7c7423aada3_logo.webp" alt="Horizon family group" className='w-52' />
      </div>

      <div className='flex flex-row gap-3'>
        <IconButton title='Home' onClick={() => navigate('/')} icon={<CiHome />} />
        <IconButton title='Manage forms' onClick={() => navigate('/allforms')} icon={<VscNewFile />} />
        <IconButton title='Submissions' onClick={() => navigate('/submissions')} icon={<TbReportAnalytics />} />
        <IconButton title='Request New form' onClick={() => { }} icon={<VscNewFile />} />
        <IconButton onClick={() => navigate(0)} icon={<FiRefreshCw />} />
      </div>

      {/* User avatar + dropdown */}
      <div className='relative flex gap-4' ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          aria-label="User menu"
          aria-expanded={dropdownOpen}
          className='flex flex-row items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 cursor-pointer'
          style={{ background: dropdownOpen ? '#f3f4f6' : 'transparent', border: 'none' }}
        >
          <span
            className='flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 flex-shrink-0'
            style={{ background: '#1c5441', boxShadow: dropdownOpen ? '0 0 0 3px #1c544133' : 'none' }}
          >
            <FaRegUser size={15} />
          </span>
          <div className='text-left'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide leading-none'>Signed in as</p>
            <p className='text-sm font-semibold text-gray-800 truncate mt-0.5'>
              {user?.name ?? user?.email ?? 'User'}
            </p>
          </div>
        </button>


        {/* Dropdown panel */}
        {dropdownOpen && (
          <div
            className='absolute right-0 top-12 w-52 bg-white rounded-2xl overflow-hidden z-50'
            style={{
              boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              animation: 'fadeSlideDown 0.15s ease',
            }}
          >

            {/* Menu items */}
            <div className='py-1.5'>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
              >
                <span className='flex items-center justify-center w-7 h-7 rounded-xl bg-[#1c544115] text-[#1c5441]'>
                  <RiAccountCircleLine size={16} />
                </span>
                Profile
              </button>

              <div className='mx-3 my-1 border-t border-gray-100' />

              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'
              >
                <span className='flex items-center justify-center w-7 h-7 rounded-xl bg-red-50 text-red-500'>
                  <HiOutlineLogout size={16} />
                </span>
                Logout
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeSlideDown {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </nav>
  )
}

export default Navbar
