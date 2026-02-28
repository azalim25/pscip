import { LayoutDashboard, FileText, Calendar, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

function NavItem({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-red-600 scale-110' : 'text-slate-400 hover:text-red-400'}`}>
            <div className="w-6 h-6">
                {icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            {active && <motion.div layoutId="nav-active" className="w-1 h-1 bg-red-600 rounded-full mt-0.5" />}
        </button>
    );
}

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-red-50 px-6 pb-8 pt-3 z-50">
            <div className="max-w-xl mx-auto flex items-center justify-around">
                <NavItem icon={<LayoutDashboard />} label="Painel" active />
                <NavItem icon={<FileText />} label="Relatórios" />
                <NavItem icon={<Calendar />} label="Agenda" />
                <NavItem icon={<Settings />} label="Ajustes" />
            </div>
        </nav>
    );
}
