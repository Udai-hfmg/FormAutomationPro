import React from 'react'
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div className='w-full mx-auto'>
        <div className='relative'>
            <FaSearch className='absolute left-3 top-3 text-gray-500' />
            <input type="text" placeholder='Search...' className='w-full pl-10 border border-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        </div>

    </div>
  )
}

export default SearchInput