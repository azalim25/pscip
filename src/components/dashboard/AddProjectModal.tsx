import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, MapPin, Calendar, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectAdded: () => void;
}

export function AddProjectModal({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) {
    const { session } = useAuth();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('projects')
                .insert({
                    title,
                    location,
                    deadline,
                    is_urgent: isUrgent,
                    user_id: session.user.id,
                    status: 'EM ANÁLISE'
                });

            if (insertError) throw insertError;

            onProjectAdded();
            onClose();
            // Reset form
            setTitle('');
            setLocation('');
            setDeadline('');
            setIsUrgent(false);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar projeto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-red-600 p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Layout className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Novo Projeto</h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex gap-2">
                                    <ShieldAlert className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Título do Projeto</label>
                                <div className="relative">
                                    <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ex: Reforma Shopping da Cidade"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Localização</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Ex: Centro, Bloco B"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Prazo / Data</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                            placeholder="Ex: 24 Out, 2024"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Urgente?</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsUrgent(!isUrgent)}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 transition-all font-bold ${isUrgent
                                                ? 'border-orange-500 bg-orange-50 text-orange-600'
                                                : 'border-slate-100 bg-slate-50 text-slate-400'
                                            }`}
                                    >
                                        <ShieldAlert className="w-5 h-5" />
                                        {isUrgent ? 'Sim' : 'Não'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Criar Projeto'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
