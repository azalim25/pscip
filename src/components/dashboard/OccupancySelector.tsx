import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, ShieldAlert, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { occupancyData, OccupancyType } from '../../data/occupancyData';

interface OccupancySelectorProps {
    onSelect: (occupancy: string) => void;
    selectedId?: string;
}

export function OccupancySelector({ onSelect, selectedId }: OccupancySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOccupancy = occupancyData.find(o => o.division === selectedId);

    const filteredOccupancies = occupancyData.filter(o =>
        o.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.occupancy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (occupancy: OccupancyType) => {
        onSelect(occupancy.division);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Classificação por Ocupação (Decreto 47.998/2020)
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all bg-white ${isOpen ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-100 hover:border-red-200'
                    }`}
            >
                <div className="flex flex-col items-start overflow-hidden text-left">
                    {selectedOccupancy ? (
                        <>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black border border-red-100">
                                    {selectedOccupancy.division}
                                </span>
                                <span className="font-bold text-slate-900 truncate">
                                    {selectedOccupancy.description}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium truncate w-full uppercase tracking-tight">
                                {selectedOccupancy.group} - {selectedOccupancy.occupancy}
                            </span>
                        </>
                    ) : (
                        <span className="text-slate-400 font-medium italic">Pesquise por tipo, grupo ou divisão...</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-600/20">
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Classificação por Ocupação</h3>
                                        <p className="text-slate-500 text-sm font-medium italic">Baseado no Decreto Estadual Nº 47.998/2020</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="p-6 md:p-8 pb-4">
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Busque por código (A-1), tipo (residencial) ou grupo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-50 transition-all font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pt-0">
                                <div className="grid gap-3">
                                    {filteredOccupancies.length > 0 ? (
                                        filteredOccupancies.map((o) => (
                                            <button
                                                key={o.division}
                                                type="button"
                                                onClick={() => handleSelect(o)}
                                                className={`w-full flex items-center gap-6 p-6 rounded-[2rem] transition-all group text-left border-2 ${selectedId === o.division
                                                    ? 'bg-red-50 border-red-200 text-red-600 shadow-inner'
                                                    : 'bg-white border-slate-50 hover:border-red-100 hover:bg-slate-50 text-slate-700 hover:shadow-xl hover:shadow-red-600/5'
                                                    }`}
                                            >
                                                <div className={`shrink-0 p-4 rounded-2xl transition-all font-black font-mono text-lg min-w-[70px] text-center ${selectedId === o.division ? 'bg-red-600 text-white rotate-6 scale-110 shadow-lg shadow-red-600/30 border-none' : 'bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 border border-slate-200 group-hover:border-red-200'
                                                    }`}>
                                                    {o.division}
                                                </div>
                                                <div className="flex flex-col min-w-0 pr-4">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className={`text-xl font-black ${selectedId === o.division ? 'text-red-600' : 'text-slate-900 group-hover:text-red-600'}`}>
                                                            {o.description}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-widest ${selectedId === o.division ? 'bg-red-200/50 border-red-300 text-red-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                                            Grupo {o.group.split(' ')[1] || o.group}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`text-sm font-bold uppercase tracking-tight ${selectedId === o.division ? 'text-red-500/80' : 'text-slate-500/80'}`}>
                                                            {o.occupancy}
                                                        </span>
                                                        {o.examples && (
                                                            <div className="flex items-start gap-1.5 mt-1 opacity-70">
                                                                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                                <span className="text-xs italic font-medium line-clamp-2 leading-relaxed">
                                                                    Ex: {o.examples}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all hidden lg:block">
                                                    <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/20">
                                                        <Check className="w-6 h-6 stroke-[3px]" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                <Search className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <p className="text-xl font-bold text-slate-800">Nenhuma ocupação encontrada</p>
                                            <p className="font-medium mt-2">Tente buscar por código de divisão, tipo ou grupo</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer hint */}
                            <div className="p-6 bg-slate-50/50 text-center text-slate-400 text-xs font-black tracking-widest border-t border-slate-100 flex items-center justify-center gap-2">
                                <div className="h-[1px] w-12 bg-slate-200" />
                                TABELA DE CLASSIFICAÇÕES - PSCIP - DECRETO 47.998/2020
                                <div className="h-[1px] w-12 bg-slate-200" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
