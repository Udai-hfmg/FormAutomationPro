import React from 'react'
import Navbar from '../components/Home/Navbar'
import FacilityFolders from '../components/Home/FacilityFolders'

const Main = () => {
  return (
    <>
    <Navbar newFormModalOpen={false} setNewFormModalOpen={() => {}} />
    <FacilityFolders/>
    </>
  )
}

export default Main