import { motion } from 'motion/react';

export interface Stat {
    label: string;
    value: string;
    color: string;
}

interface StatCardProps {
    stat: Stat;
    idx: number;
}

export function StatCard({ stat, idx }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 rounded-2xl bg-white shadow-sm border border-red-50"
        >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
    );
}
