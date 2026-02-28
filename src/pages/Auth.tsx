import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldCheck, AlertCircle, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [numeroBM, setNumeroBM] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const constructSyntheticEmail = (bm: string) => `${bm.trim().toLowerCase()}@pscip.com`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const syntheticEmail = constructSyntheticEmail(numeroBM);

            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: syntheticEmail,
                    password,
                });
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Número BM ou senha incorretos.');
                    }
                    throw error;
                }
            } else {
                const { error } = await supabase.auth.signUp({
                    email: syntheticEmail,
                    password,
                    options: {
                        data: {
                            real_email: email,
                            numero_bm: numeroBM,
                        }
                    }
                });
                if (error) throw error;
                setSuccess('Cadastro realizado com sucesso! Você já pode fazer login.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro durante a autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="bg-red-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>

                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 relative z-10" />
                    <h1 className="text-3xl font-bold tracking-tight relative z-10">Portal PSCIP</h1>
                    <p className="text-red-100 mt-2 relative z-10">Acesso seguro a projetos de prevenção de incêndio</p>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {isLogin ? 'Acesso ao Portal' : 'Crie sua conta'}
                    </h2>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-start gap-3 text-sm">
                            <ShieldCheck className="w-5 h-5 shrink-0" />
                            <p>{success}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Número BM</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={numeroBM}
                                    onChange={(e) => setNumeroBM(e.target.value)}
                                    placeholder="Digite seu número BM"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite seu e-mail"
                                        required={!isLogin}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Entrar' : 'Criar Conta'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "Não tem uma conta? " : "Já possui uma conta? "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-red-600 font-bold hover:underline"
                            >
                                {isLogin ? 'Cadastre-se' : 'Entrar'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
