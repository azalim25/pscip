import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Shield, Building2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth, Profile } from '../../contexts/AuthContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RANKS = [
    'Coronel', 'Tenente-Coronel', 'Major', 'Capitão', '1° Tenente', '2° Tenente',
    'Aspirante', 'Cadete', 'Subtenente', '1° Sargento', '2° Sargento', '3° Sargento',
    'Cabo', 'Soldado', 'Soldado 2° Classe'
];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { profile, user, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [warName, setWarName] = useState('');
    const [rank, setRank] = useState('');
    const [email, setEmail] = useState('');
    const [unit, setUnit] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setWarName(profile.war_name || '');
            setRank(profile.rank || '');
            setEmail(profile.email || '');
            setUnit(profile.unit || '');
        }
    }, [profile, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // 1. Update profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    war_name: warName,
                    rank: rank,
                    email: email,
                    unit: unit
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 2. Update Supabase Auth email if it changed
            if (email !== profile?.email) {
                const { error: authError } = await supabase.auth.updateUser({ email });
                if (authError) throw authError;
            }

            await refreshProfile();
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 bg-red-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold leading-tight">Perfil do Militar</h2>
                                    <p className="text-red-100 text-xs font-medium">Gerencie suas informações pessoais</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex gap-3 border border-red-100">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold flex gap-3 border border-green-100">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    Perfil atualizado com sucesso!
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nome Completo</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nome de Guerra</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={warName}
                                            onChange={(e) => setWarName(e.target.value)}
                                            placeholder="Seu nome de guerra"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Posto/Graduação</label>
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                            <select
                                                value={rank}
                                                onChange={(e) => setRank(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 appearance-none pointer-events-auto"
                                            >
                                                <option value="" disabled>Selecione...</option>
                                                {RANKS.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Número BM</label>
                                        <div className="relative group grayscale">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={profile?.numero_bm || ''}
                                                readOnly
                                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-100 outline-none font-bold text-slate-500 cursor-not-allowed"
                                                title="O Número BM não pode ser alterado"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">E-mail</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Unidade</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            placeholder="Ex: 1º BBM"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Salvar Alterações</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
