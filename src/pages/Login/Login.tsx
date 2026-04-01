// Login.tsx
import React, { useEffect } from 'react'
import LoginInput from '../../components/Login/LoginInput'
import { User, Lock } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { Navigate } from 'react-router'
import Loading from '../../components/Home/Loading'
import toast from 'react-hot-toast'

const Login = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const { isAuthenticated } = useAppData()
  const { login, appLoading, authLoading, error, setError } = useAppData() // get login function from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await login(username, password) // call login function from context with username and password
    // your login logic
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    }
  }, [error, setError])

  if (appLoading) {
    return <Loading />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: '#f3f4f6' }}>

      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white px-8 py-9 rounded-2xl"
          style={{ border: '0.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}>

          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-2.5 mb-7">
            <div className="w-13 h-13 rounded-xl flex items-center justify-center"
              style={{ width: '52px', height: '52px', background: '#1a5c38', borderRadius: '14px' }}>
              {/* Cross / medical icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="12" y="4" width="4" height="20" rx="2" fill="white" />
                <rect x="4" y="12" width="20" height="4" rx="2" fill="white" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-base font-medium text-gray-900">Form Automation Dashboard</h1>
              <p className="text-xs text-gray-400 mt-0.5">Secure staff portal · Horizon Health System</p>
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(0,0,0,0.06)', marginBottom: '24px' }} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <LoginInput
              type="text"
              placeholder="username or email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              label="Username or Email"
              icon={<User size={15} />}         // ✅ pass as JSX — no type error
            />
            <LoginInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Password"
              icon={<Lock size={15} />}         // ✅ pass as JSX
            />

            <button type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white mt-1.5 transition-colors disabled:opacity-50"
              style={{ height: '44px', borderRadius: '11px', background: '#1a5c38', border: 'none' }}
              onMouseEnter={e => !authLoading && (e.currentTarget.style.background = '#154d2f')}
              onMouseLeave={e => !authLoading && (e.currentTarget.style.background = '#1a5c38')}
            >
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={14} />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          Protected system · Unauthorized access is prohibited<br />
          <span style={{ color: '#1a5c38', fontWeight: 500 }}>Horizon Family medical group</span> · All rights reserved
        </p>
      </div>

    </div>
  )
}

export default Login