import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldCheck, AlertCircle, User as UserIcon, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'signup' | 'forgot-password';

export function Auth() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [numeroBM, setNumeroBM] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (mode === 'login') {
                // 1. Find email associated with BM number from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('numero_bm', numeroBM.trim())
                    .maybeSingle();

                if (profileError) throw profileError;

                // For security reasons, don't tell the user if the BM number exists or not
                // unless it's strictly necessary. But here we need the email to proceed.
                if (!profile) {
                    throw new Error('Número BM não encontrado ou não cadastrado.');
                }

                // 2. Sign in with found email
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: profile.email,
                    password,
                });

                if (signInError) {
                    if (signInError.message.includes('Invalid login credentials')) {
                        throw new Error('Número BM ou senha incorretos.');
                    }
                    throw signInError;
                }
            } else if (mode === 'signup') {
                // 1. Sign up with real email in Supabase Auth
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            numero_bm: numeroBM.trim(),
                        }
                    }
                });

                if (signUpError) throw signUpError;

                if (authData.user) {
                    // 2. Create entry in our profiles mapping table
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({
                            id: authData.user.id,
                            numero_bm: numeroBM.trim(),
                            email: email.trim()
                        });

                    if (profileError) {
                        // If profile fails, we might have a ghost user. 
                        // In a real app we'd handle this better, but for now we throw.
                        throw profileError;
                    }
                }

                setSuccess('Cadastro realizado com sucesso! Verifique seu e-mail se necessário ou faça login.');
                setMode('login');
            } else if (mode === 'forgot-password') {
                // If they provided a BM number, we should find their email first
                let targetEmail = email.trim();

                if (!targetEmail && numeroBM) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('email')
                        .eq('numero_bm', numeroBM.trim())
                        .maybeSingle();

                    if (profile) {
                        targetEmail = profile.email;
                    }
                }

                if (!targetEmail) {
                    throw new Error('Por favor, informe seu e-mail ou Número BM para recuperar a senha.');
                }

                const { error: resetError } = await supabase.auth.resetPasswordForEmail(targetEmail, {
                    redirectTo: `${window.location.origin}/auth`,
                });

                if (resetError) throw resetError;
                setSuccess('Se o e-mail existir em nossa base, um link de recuperação será enviado em instantes.');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro durante a operação.');
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
                    <div className="flex items-center justify-between mb-6">
                        {mode === 'forgot-password' && (
                            <button
                                onClick={() => setMode('login')}
                                className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        <h2 className={`text-2xl font-bold ${mode === 'forgot-password' ? 'flex-1 text-center pr-8' : 'w-full text-center'}`}>
                            {mode === 'login' ? 'Acesso ao Portal' : mode === 'signup' ? 'Crie sua conta' : 'Recuperar Senha'}
                        </h2>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-start gap-3 text-sm font-medium">
                            <ShieldCheck className="w-5 h-5 shrink-0" />
                            <p>{success}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Show Numero BM for login, signup, and optionally for forgot password */}
                        {mode !== 'forgot-password' && (
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
                        )}

                        {/* Show E-mail for signup and forgot password */}
                        {(mode === 'signup' || mode === 'forgot-password') && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite seu e-mail"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {mode !== 'forgot-password' && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-slate-700">Senha</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot-password')}
                                            className="text-xs text-red-600 hover:underline font-bold"
                                        >
                                            Esqueceu a senha?
                                        </button>
                                    )}
                                </div>
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
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar Conta' : 'Enviar Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {mode === 'login' ? "Não tem uma conta? " : mode === 'signup' ? "Já possui uma conta? " : ""}
                            {(mode === 'login' || mode === 'signup') && (
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="text-red-600 font-bold hover:underline"
                                >
                                    {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
                                </button>
                            )}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
