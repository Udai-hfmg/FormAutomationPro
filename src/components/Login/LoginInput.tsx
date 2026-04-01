// LoginInput.tsx — icon fix: accept ReactNode not LucideIcon type
import React from 'react'

interface ILoginInputProps {
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  icon?: React.ReactNode    // ✅ ReactNode instead of LucideIcon — no type error
  error?: string
}

const LoginInput = ({ type, placeholder, value, onChange, label, icon, error }: ILoginInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium tracking-wide"
          style={{ color: 'var(--color-text-secondary, #6b7280)' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}  {/* ✅ render directly as ReactNode */}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full text-sm outline-none transition-all duration-200"
          style={{
            height: '44px',
            borderRadius: '11px',
            border: error ? '1px solid #f09595' : '1px solid rgba(0,0,0,0.1)',
            background: '#f9fafb',
            color: '#111',
            paddingLeft: icon ? '40px' : '14px',
            paddingRight: '14px',
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? '#E24B4A' : '#1a5c38'
            e.target.style.boxShadow   = `0 0 0 3px rgba(26,92,56,0.1)`
            e.target.style.background  = '#fff'
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#f09595' : 'rgba(0,0,0,0.1)'
            e.target.style.boxShadow   = 'none'
            e.target.style.background  = '#f9fafb'
          }}
        />
      </div>
      {error && <p className="text-xs" style={{ color: '#E24B4A' }}>{error}</p>}
    </div>
  )
}

export default LoginInput