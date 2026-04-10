import React from 'react';
import { AlertCircle, XSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
    message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = "An unknown error occurred" }) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white text-gray-800">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-5 max-w-sm w-full text-center"
            >
                {/* Icon */}
                <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#fcebeb', border: '1px solid #f09595', boxShadow: '0 8px 16px rgba(226, 75, 74, 0.12)' }}
                >
                    <AlertCircle size={28} color="#E24B4A" />
                </div>

                {/* Title */}
                <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: '#A32D2D' }}>
                        Unable to load content
                    </h2>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                        Something went wrong while processing your request. Please check the details below.
                    </p>
                </div>

                {/* Error message box */}
                <div 
                    className="w-full flex items-start gap-2.5 px-4 py-3.5 rounded-xl text-left"
                    style={{ background: '#fafafa', border: '1px solid #f09595' }}
                >
                    <XSquare size={16} color="#E24B4A" className="flex-shrink-0 mt-0.5" />
                    <span className="font-mono text-xs leading-relaxed" style={{ color: '#993556' }}>
                        {message}
                    </span>
                </div>

                <hr className="w-full border-gray-100 my-1" />

                {/* Actions */}
                <button
                    onClick={() => window.location.reload()}
                    className="w-full h-11 rounded-xl text-sm font-semibold text-white transition-colors"
                    style={{ background: '#1a5c38', boxShadow: '0 4px 12px rgba(26, 92, 56, 0.2)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#154d2f')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#1a5c38')}
                >
                    Reload Page
                </button>
            </motion.div>
        </div>
    );
};

export default ErrorState;
