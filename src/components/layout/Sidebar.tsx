import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, ScrollText, ChevronRight, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { signOut } = useAuth();
    const location = useLocation();

    const menuItems = [
        { label: 'Painel', path: '/', icon: Layout },
        { label: 'Classificações', path: '/classification', icon: ScrollText },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar Content */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-red-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Layout className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg leading-tight">Menu Principal</h2>
                                    <p className="text-red-100 text-xs font-medium">PSCIP Portal</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 mt-4 space-y-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive
                                                ? 'bg-red-50 text-red-600'
                                                : 'hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                            <span className="font-bold">{item.label}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-100">
                            <button
                                onClick={() => {
                                    signOut();
                                    onClose();
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold group"
                            >
                                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span>Sair da Conta</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
