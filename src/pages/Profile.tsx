import React from 'react';
import { useAppData } from '../context/AppDataContext';
import Navbar from '../components/Home/Navbar';
import { motion } from 'framer-motion';
import { RiAccountCircleLine } from 'react-icons/ri';
import { MdOutlineEmail, MdBadge, MdAccessTime } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';

export default function Profile() {
    const { user } = useAppData();

    if (!user) return null; // handled by ProtectedRoute, but good for TS narrowing

    // Formatter for dates
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            {/* Top Navbar so they can navigate back */}
            <Navbar />

            <div className="pt-12 px-4 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Header Card */}
                    <div className="bg-white rounded-[28px] p-8 mb-6 relative overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.04)] border border-gray-100/80">
                        {/* Decorative background flair */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1c5441] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-7 relative z-10">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-[#1c5441] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#1c5441]/20 border-[3px] border-white ring-1 ring-gray-100">
                                <span className="text-4xl font-bold tracking-wide">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name || 'User Name'}</h1>
                                <p className="text-gray-500 font-medium text-sm">{user.email || 'Email not provided'}</p>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${user.isExpired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                        {user.isExpired ? 'Session Expired' : 'Active Session'}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                                        {user.type || 'Standard'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white rounded-[28px] p-8 shadow-[0_4px_32px_rgba(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden">
                        <h2 className="text-lg font-bold text-gray-900 mb-7 flex items-center gap-2.5">
                            <RiAccountCircleLine className="text-[#1c5441]" size={22} />
                            Profile Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <InfoField
                                icon={<MdBadge size={20} />}
                                label="Full Name"
                                value={user.name}
                            />

                            <InfoField
                                icon={<MdOutlineEmail size={20} />}
                                label="Email Address"
                                value={user.email}
                            />

                            <InfoField
                                icon={<RiAccountCircleLine size={20} />}
                                label="Account Identifier"
                                value={user.account}
                            />

                            <InfoField
                                icon={<BiCategory size={20} />}
                                label="Session Type"
                                value={user.type}
                                capitalize
                            />

                            <div className="md:col-span-2">
                                <InfoField
                                    icon={<MdAccessTime size={20} />}
                                    label="Session Expires At"
                                    value={formatDate(user.expiresAt)}
                                />
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

const InfoField = ({ icon, label, value, capitalize }: { icon: React.ReactNode, label: string, value?: string, capitalize?: boolean }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#fafafa] border border-gray-100/50 transition-colors hover:bg-gray-50 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 text-[#1c5441] opacity-80 group-hover:scale-105 transition-transform duration-300">
            {icon}
        </div>
        <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className={`text-sm font-medium text-gray-800 break-all ${capitalize ? 'capitalize' : ''}`}>{value || '—'}</p>
        </div>
    </div>
);
