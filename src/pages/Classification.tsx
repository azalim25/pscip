import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { occupancyData } from '../data/occupancyData';

export default function Classification() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return occupancyData.filter(item =>
            item.group.toLowerCase().includes(term) ||
            item.occupancy.toLowerCase().includes(term) ||
            item.division.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.examples.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-[#f8f6f6] pb-12">
            {/* Header */}
            <header className="bg-red-600 text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">Classificação</h1>
                                <p className="text-red-100 text-sm font-medium">Decreto 47.998/2020</p>
                            </div>
                        </div>

                        <div className="relative flex-1 max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Pesquise por grupo, divisão, descrição ou exemplos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-white/10 focus:bg-white/20 focus:ring-2 focus:ring-white placeholder-red-200 text-white outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Stats / Info */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                            <Info className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total de Itens</p>
                            <p className="text-xl font-black text-slate-700">{filteredData.length}</p>
                        </div>
                    </div>
                </div>

                {/* Classification Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-16">Grupo</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-48">Ocupação / Uso</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-20">Divisão</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-1/4">Descrição</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Exemplos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {filteredData.map((item, index) => (
                                        <motion.tr
                                            key={item.division}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-6 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 font-black text-sm">
                                                    {item.group}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-sm font-bold text-slate-700">{item.occupancy}</p>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                    {item.division}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                    {item.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex gap-2">
                                                    <HelpCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-slate-500 italic leading-relaxed">
                                                        {item.examples}
                                                    </p>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-12 h-12 text-slate-200" />
                                                <p className="text-slate-400 font-medium">Nenhum resultado encontrado para "{searchTerm}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
