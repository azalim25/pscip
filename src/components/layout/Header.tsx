import React, { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';

export function Header() {
    const { signOut } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-[#f8f6f6]/80 backdrop-blur-md border-b border-red-100">
                <div className="flex items-center justify-between p-4 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6 text-slate-700" />
                        </button>
                        <h1 className="text-xl font-bold text-red-600 tracking-tight">
                            PSCIP <span className="text-slate-900 font-medium">Portal</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-red-50 rounded-full transition-colors relative">
                            <Bell className="w-6 h-6 text-slate-700" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm">
                            <User className="w-6 h-6" />
                        </div>
                        <button
                            onClick={signOut}
                            className="ml-2 p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
}
