import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, Book } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { terminologyData } from '../data/terminologyData';

export default function Terminology() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return terminologyData.filter(item =>
            item.term.toLowerCase().includes(term) ||
            item.definition.toLowerCase().includes(term) ||
            item.id.includes(term)
        );
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-[#f8f6f6] pb-12">
            <Header
                title="ITO 02 - Terminologia"
                subtitle="Terminologia de proteção contra incêndio e pânico"
                showSearch={true}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Pesquise por termo ou definição..."
            />

            <main className="max-w-5xl mx-auto px-4 mt-8">
                {/* Stats / Info */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                            <Info className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total de Definições</p>
                            <p className="text-xl font-black text-slate-700">{filteredData.length}</p>
                        </div>
                    </div>
                </div>

                {/* Terminology List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                        <Book className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                                ITEM {item.id}
                                            </span>
                                            <h3 className="text-lg font-black text-slate-800 truncate">
                                                {item.term}
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                            {item.definition}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredData.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                            <div className="flex flex-col items-center gap-3">
                                <Search className="w-12 h-12 text-slate-200" />
                                <h4 className="text-lg font-bold text-slate-400">Nenhum termo encontrado</h4>
                                <p className="text-slate-400 text-sm">Tente pesquisar por palavras diferentes.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
