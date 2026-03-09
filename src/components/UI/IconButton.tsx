import React from 'react'
import { twMerge } from "tailwind-merge";


type Props = {
    title?: string,
    onClick: () => void,
    icon?: React.ReactNode,
    className?: string,
    loading?: boolean,
    disabled?: boolean
}

const IconButton = ({ title, onClick, icon, className, loading = false, disabled = false }: Props) => {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={twMerge(
        `text-gray-800 px-4 py-2 rounded-md hover:bg-blue-500/45 transition-colors duration-300 flex items-center gap-2`,
        className,
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {title}
    </button>
  )
}

export default IconButton