import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout, MapPin, Calendar, ShieldAlert, Save, ArrowLeft, Maximize, Ruler, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';
import { OccupancySelector } from '../components/dashboard/OccupancySelector';
import { CnaeSelector } from '../components/dashboard/CnaeSelector';

export default function NewProject() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [occupancy, setOccupancy] = useState('');
    const [deadline, setDeadline] = useState('');
    const [cnae, setCnae] = useState('');
    const [area, setArea] = useState('');
    const [height, setHeight] = useState('');
    const [occupancyLoad, setOccupancyLoad] = useState('');
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
                    occupancy,
                    cnae,
                    area: area ? parseFloat(area) : null,
                    height: height ? parseFloat(height) : null,
                    occupancy_load: occupancyLoad ? parseInt(occupancyLoad) : null,
                    deadline,
                    is_urgent: isUrgent,
                    user_id: session.user.id,
                    status: 'EM ANÁLISE'
                });

            if (insertError) throw insertError;

            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Erro ao criar projeto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f6f6] pb-24">
            <Header
                title="Novo Projeto"
                subtitle="Cadastre uma nova adequação PSCIP"
            />

            <main className="max-w-4xl mx-auto px-4 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden"
                >
                    <div className="p-8 border-b border-slate-50 bg-red-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-600/20">
                                <Layout className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Detalhes do Projeto</h2>
                                <p className="text-slate-500 text-sm font-medium">Preencha as informações técnicas do imóvel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Voltar</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex gap-3 border border-red-100 italic">
                                <ShieldAlert className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-10">
                            {/* Information Group 1 */}
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Título do Projeto</label>
                                    <div className="relative group">
                                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Ex: Reforma Shopping da Cidade"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Localização</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Ex: Centro, Bloco B"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Área Total</label>
                                        <div className="relative group">
                                            <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={area}
                                                onChange={(e) => setArea(e.target.value)}
                                                placeholder="0,00"
                                                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">m²</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Altura</label>
                                        <div className="relative group">
                                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                placeholder="0,00"
                                                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">m</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Information Group 2 */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Lotação (Pessoas)</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                            <input
                                                type="number"
                                                value={occupancyLoad}
                                                onChange={(e) => setOccupancyLoad(e.target.value)}
                                                placeholder="0"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Prazo Estimado</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                            <input
                                                type="text"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                                placeholder="Ex: 24 Out, 2024"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <OccupancySelector
                                    onSelect={(val) => setOccupancy(val)}
                                    selectedId={occupancy}
                                />

                                <CnaeSelector
                                    onSelect={(val) => setCnae(val)}
                                    selectedCnae={cnae}
                                />

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Prioridade Urgente?</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsUrgent(!isUrgent)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold ${isUrgent
                                            ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-inner'
                                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-red-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert className={`w-6 h-6 ${isUrgent ? 'text-orange-500' : 'text-slate-300'}`} />
                                            <span>{isUrgent ? 'Projeto Marcado como Urgente' : 'Prioridade Normal'}</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors ${isUrgent ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUrgent ? 'left-7' : 'left-1'}`} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 rounded-[2rem] transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-xl"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-7 h-7" />
                                        <span>Salvar Novo Projeto</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
