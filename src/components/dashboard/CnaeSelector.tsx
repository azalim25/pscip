import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Layout } from 'lucide-react';
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-600/20">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Selecionar CNAE</h3>
                                        <p className="text-slate-500 text-sm font-medium">Busque por código ou descrição da atividade</p>
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
                                        placeholder="Digite para filtrar os resultados..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-50 transition-all font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pt-0">
                                <div className="grid gap-3">
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
                                                className={`w-full flex items-center gap-6 p-6 rounded-[1.5rem] transition-all group text-left border-2 ${selectedCnae === item.code
                                                    ? 'bg-red-50 border-red-200 text-red-600 shadow-inner'
                                                    : 'bg-white border-slate-50 hover:border-red-100 hover:bg-slate-50 text-slate-700 hover:shadow-lg hover:shadow-red-600/5'
                                                    }`}
                                            >
                                                <div className={`shrink-0 p-4 rounded-2xl transition-all ${selectedCnae === item.code ? 'bg-red-600 text-white rotate-12 scale-110 shadow-lg shadow-red-600/30' : 'bg-slate-100 text-slate-400 group-hover:bg-red-100 group-hover:text-red-600'
                                                    }`}>
                                                    {selectedCnae === item.code ? (
                                                        <Check className="w-7 h-7 stroke-[3px]" />
                                                    ) : (
                                                        <Layout className="w-7 h-7" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0 pr-4">
                                                    <span className={`text-xl font-black mb-1 ${selectedCnae === item.code ? 'text-red-600' : 'text-slate-900 group-hover:text-red-600'}`}>
                                                        {item.code === 'N/A' ? 'Não se aplica' : item.code}
                                                    </span>
                                                    {item.code !== 'N/A' && (
                                                        <span className={`text-base font-medium leading-relaxed ${selectedCnae === item.code ? 'text-red-500/80' : 'text-slate-500'}`}>
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all hidden md:block">
                                                    <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/20">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                <Search className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <p className="text-xl font-bold text-slate-800">Nenhum CNAE encontrado</p>
                                            <p className="font-medium mt-2">Tente buscar por outro código ou palavra-chave</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer hint */}
                            <div className="p-6 bg-slate-50/50 text-center text-slate-400 text-sm font-bold border-t border-slate-100">
                                DICIONÁRIO DE ATIVIDADES ECONÔMICAS - PSCIP
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
