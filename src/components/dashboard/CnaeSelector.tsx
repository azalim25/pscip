import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cnaeData, CnaeItem } from '../../data/cnaeData';

interface CnaeSelectorProps {
    onSelect: (cnae: string) => void;
    selectedCnae?: string;
}

export function CnaeSelector({ onSelect, selectedCnae }: CnaeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedItem = cnaeData.find(item => item.code === selectedCnae);

    const filteredData = cnaeData.filter(item =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                CNAE (Classificação de Atividades Econômicas)
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all bg-white ${isOpen ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-100 hover:border-red-200'
                    }`}
            >
                <div className="flex flex-col items-start overflow-hidden text-left">
                    {selectedItem ? (
                        <>
                            <span className="font-bold text-slate-900 truncate w-full">
                                {selectedItem.code === 'N/A' ? 'Não se aplica' : selectedItem.code}
                            </span>
                            {selectedItem.code !== 'N/A' && (
                                <span className="text-xs text-slate-500 truncate w-full">{selectedItem.description}</span>
                            )}
                        </>
                    ) : (
                        <span className="text-slate-400 font-medium italic">Selecione o CNAE</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[60] overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar por código ou descrição..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-600 transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => {
                                            onSelect(item.code);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-1 last:mb-0 group text-left ${selectedCnae === item.code
                                                ? 'bg-red-50 text-red-600'
                                                : 'hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${selectedCnae === item.code ? 'bg-red-100' : 'bg-slate-100 group-hover:bg-red-50'
                                            }`}>
                                            {selectedCnae === item.code ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <div className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold truncate">{item.code === 'N/A' ? 'Não se aplica' : item.code}</span>
                                            {item.code !== 'N/A' && (
                                                <span className="text-sm opacity-70 truncate">{item.description}</span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="py-12 text-center text-slate-400">
                                    <p className="font-medium">Nenhum CNAE encontrado</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
