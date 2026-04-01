import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
// import PreviewPage from './components/Forms/PreviewPage'
import Forms from './pages/Forms'
import RenderForm from './components/Forms/RenderForm';
import Main from './pages/Main';
import FormSubmissionsTable from './pages/FormSubmission';
import PreviewPage from './pages/PreviewPage';
import Login from './pages/Login/Login';
import { AppDataProvider } from './context/AppDataContext';
import ProtectedRoute from './components/Home/ProtectedRoute';
import Profile from './pages/Profile';


function App() {

  return (
    <>
      <Toaster />


      <AppDataProvider>
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<Login />} />

          {/* Protected routes – redirect to /login if not authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Main />} />
            <Route path='/files' element={<Home />} />
            <Route path='/preview' element={<PreviewPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/forms' element={<Forms />} />
            <Route path='/forms/:formIds' element={<RenderForm />} />
            <Route path='/submissions' element={<FormSubmissionsTable />} />
          </Route>
        </Routes>
      </AppDataProvider>
    </>
  )
}

export default App
