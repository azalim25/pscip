import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { occupancyData, OccupancyType } from '../../data/occupancyData';

interface OccupancySelectorProps {
    onSelect: (occupancy: string) => void;
    selectedId?: string;
}

export function OccupancySelector({ onSelect, selectedId }: OccupancySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOccupancy = occupancyData.find(o => o.id === selectedId);

    const filteredOccupancies = occupancyData.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (occupancy: OccupancyType) => {
        onSelect(occupancy.id);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-bold text-slate-700 mb-2">Classificação por Ocupação</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between pl-4 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-left"
            >
                <span className={selectedOccupancy ? "text-slate-900 font-medium" : "text-slate-400"}>
                    {selectedOccupancy ? `${selectedOccupancy.id} - ${selectedOccupancy.description}` : "Pesquise por tipo ou divisão..."}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-[110] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Ex: residencial, A-1, comércio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                            {filteredOccupancies.length > 0 ? (
                                filteredOccupancies.map((o) => (
                                    <button
                                        key={o.id}
                                        type="button"
                                        onClick={() => handleSelect(o)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-red-50 group flex items-start justify-between transition-colors"
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-slate-700 group-hover:text-red-600 flex items-center gap-2">
                                                <span className="bg-slate-100 group-hover:bg-red-100 text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors">
                                                    {o.id}
                                                </span>
                                                {o.description}
                                            </div>
                                        </div>
                                        {selectedId === o.id && <Check className="w-4 h-4 text-red-600 self-center" />}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-slate-400 text-sm italic">
                                    Nenhuma ocupação encontrada
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
