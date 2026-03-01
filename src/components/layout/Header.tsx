import React, { useState } from 'react';
import { Menu, User, LogOut, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { ProfileModal } from './ProfileModal';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
    onSearchChange?: (val: string) => void;
    searchValue?: string;
    searchPlaceholder?: string;
}

export function Header({
    title,
    subtitle,
    showSearch,
    onSearchChange,
    searchValue,
    searchPlaceholder
}: HeaderProps) {
    const { signOut, profile } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const isHome = !title;

    return (
        <>
            <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${isHome ? 'bg-[#f8f6f6]/80 border-red-100' : 'bg-red-600 border-red-700 text-white shadow-lg'
                }`}>
                <div className={`flex items-center justify-between p-4 mx-auto w-full transition-all ${isHome ? 'max-w-5xl' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
                    }`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`p-2 rounded-lg transition-colors ${isHome ? 'hover:bg-red-50 text-slate-700' : 'hover:bg-white/10 text-white'
                                }`}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {isHome ? (
                            <h1 className="text-xl font-bold text-red-600 tracking-tight">
                                PSCIP <span className="text-slate-900 font-medium">Portal</span>
                            </h1>
                        ) : (
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold leading-tight">{title}</h1>
                                {subtitle && <p className="text-red-100 text-xs md:text-sm font-medium">{subtitle}</p>}
                            </div>
                        )}
                    </div>

                    {showSearch && (
                        <div className="hidden md:block relative flex-1 max-w-2xl px-6">
                            <Search className={`absolute left-10 top-1/2 -translate-y-1/2 w-5 h-5 ${isHome ? 'text-red-400' : 'text-red-300'
                                }`} />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none outline-none transition-all shadow-inner ${isHome
                                    ? 'bg-red-50 focus:ring-2 focus:ring-red-600 text-slate-900 placeholder-slate-400'
                                    : 'bg-white/10 focus:bg-white/20 focus:ring-2 focus:ring-white placeholder-red-200 text-white'
                                    }`}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className={`flex items-center gap-3 p-1.5 sm:pl-1.5 sm:pr-4 rounded-full transition-all group ${isHome
                                ? 'hover:bg-red-50 text-slate-700'
                                : 'hover:bg-white/10 text-white'
                                }`}
                        >
                            <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 ${isHome ? 'bg-red-600 text-white' : 'bg-white text-red-600'
                                }`}>
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="hidden sm:block text-left leading-tight">
                                <p className={`text-[10px] font-black uppercase tracking-wider opacity-70 ${isHome ? 'text-red-600' : 'text-red-100'}`}>
                                    {profile?.rank || 'Militar'}
                                </p>
                                <p className="text-sm font-bold truncate max-w-[120px]">
                                    {profile?.war_name || (profile?.full_name?.split(' ')[0]) || 'Perfil'}
                                </p>
                            </div>
                            <ChevronDown className={`hidden sm:block w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity ${isHome ? 'text-slate-400' : 'text-white'}`} />
                        </button>

                        <div className={`w-px h-8 hidden sm:block ${isHome ? 'bg-slate-200' : 'bg-white/20'}`} />

                        <button
                            onClick={signOut}
                            className={`p-2 rounded-full transition-colors ${isHome ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-500 text-white'
                                }`}
                            title="Sair da Conta"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search - only visible on small screens when showSearch is true */}
                {showSearch && (
                    <div className="md:hidden px-4 pb-4">
                        <div className="relative">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isHome ? 'text-red-400' : 'text-red-300'
                                }`} />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none outline-none transition-all shadow-inner ${isHome
                                    ? 'bg-red-50 focus:ring-2 focus:ring-red-600 text-slate-900'
                                    : 'bg-white/10 focus:bg-white/20 text-white'
                                    }`}
                            />
                        </div>
                    </div>
                )}
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </>
    );
}
