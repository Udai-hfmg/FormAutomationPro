import {Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import PreviewPage from './components/Forms/PreviewPage'
import Forms from './pages/Forms'
import RenderForm from './components/Forms/RenderForm';
import Main from './pages/Main';

function App() {

  return (
    <>
      <Toaster />

    {/* <Form1/>
    <NewPatientForm/> */}
    {/* <TestForm/> */}
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='/files' element={<Home/>}/>
      <Route path='/preview' element={<PreviewPage/>}/>
      {/* <Route path='/test' element={<TestForm/>}/> */}
      <Route path='/forms' element={<Forms/>} />
      <Route path='/forms/:formIds' element={<RenderForm/>} />
    </Routes>
    </>
  )
}

export default App
