import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Layout, MapPin, Calendar, ShieldAlert, ArrowLeft,
    Maximize, Ruler, Users, Landmark, Layers, Droplets, Flame,
    Check, AlertTriangle, Building2, Tag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/layout/Header';

interface ProjectDetails {
    id: string;
    title: string;
    location: string;
    occupancy: string;
    cnae: string;
    area: number;
    height: number;
    occupancy_load: number;
    deadline: string;
    is_urgent: boolean;
    is_heritage: boolean;
    has_distinct_basement_use: boolean;
    has_liquid_fuel: boolean;
    has_lpg: boolean;
    risk_level: string;
    status: string;
}

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProject() {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProject(data);
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.message || 'Erro ao carregar projeto');
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#f8f6f6] p-8">
                <div className="max-w-xl mx-auto bg-white p-8 rounded-[2rem] shadow-xl text-center">
                    <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Projeto não encontrado</h2>
                    <p className="text-slate-500 mb-6">{error || 'O projeto solicitado não existe.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-red-700"
                    >
                        Voltar para o Painel
                    </button>
                </div>
            </div>
        );
    }

    const risk = project.risk_level?.split(' ').pop();

    return (
        <div className="min-h-screen bg-[#f8f6f6] pb-24">
            <Header
                title={project.title}
                subtitle="Visualizar características do projeto"
            />

            <main className="max-w-5xl mx-auto px-4 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Hero Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Voltar para o Painel</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider ${project.status === 'APROVADO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {project.status}
                            </div>
                            {risk && risk !== 'null' && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black text-xs uppercase tracking-wider shadow-sm ${risk === 'III' ? 'bg-red-600 border-red-700 text-white' :
                                    risk === 'II' ? 'bg-orange-500 border-orange-600 text-white' :
                                        'bg-green-600 border-green-700 text-white'
                                    }`}>
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Risco {risk}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Summary Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
                                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                    <Tag className="w-6 h-6 text-red-600" />
                                    Identificação
                                </h3>

                                <div className="space-y-6">
                                    <DetailItem
                                        icon={<MapPin />}
                                        label="Localização"
                                        value={project.location || "Não informada"}
                                    />
                                    <DetailItem
                                        icon={<Calendar />}
                                        label="Prazo"
                                        value={project.deadline || "Sem prazo definido"}
                                        highlight={project.is_urgent}
                                    />
                                    <DetailItem
                                        icon={<ShieldAlert />}
                                        label="Prioridade"
                                        value={project.is_urgent ? "URGENTE" : "NORMAL"}
                                        highlight={project.is_urgent}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                                <Building2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
                                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                                    Classificação
                                </h3>
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">CNAE</p>
                                        <p className="text-base font-bold text-red-400">{project.cnae || "Não se aplica"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Ocupação</p>
                                        <p className="text-base font-bold leading-tight">{project.occupancy || "Não informada"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
                                <h3 className="text-xl font-black text-slate-800 mb-8 border-l-4 border-red-600 pl-4">Dados Técnicos</h3>

                                <div className="grid sm:grid-cols-3 gap-6">
                                    <TechnicalBox
                                        icon={<Maximize className="w-6 h-6" />}
                                        label="Área"
                                        value={project.area ? `${project.area} m²` : "N/A"}
                                    />
                                    <TechnicalBox
                                        icon={<Ruler className="w-6 h-6" />}
                                        label="Altura"
                                        value={project.height ? `${project.height} m` : "N/A"}
                                    />
                                    <TechnicalBox
                                        icon={<Users className="w-6 h-6" />}
                                        label="Lotação"
                                        value={project.occupancy_load ? `${project.occupancy_load} pessoas` : "N/A"}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
                                <h3 className="text-xl font-black text-slate-800 mb-8 border-l-4 border-slate-800 pl-4">Conformidade e Segurança</h3>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <CheckItem
                                        icon={<Landmark />}
                                        label="Patrimônio Histórico Cultural"
                                        status={project.is_heritage}
                                    />
                                    <CheckItem
                                        icon={<Layers />}
                                        label="Uso Distinto de Estacionamento"
                                        status={project.has_distinct_basement_use}
                                    />
                                    <CheckItem
                                        icon={<Droplets />}
                                        label="Líquido Combustível (> 1000L)"
                                        status={project.has_liquid_fuel}
                                        description="Inclui armazenamento fracionado"
                                    />
                                    <CheckItem
                                        icon={<Flame />}
                                        label="Armazenamento de GLP (> 190Kg)"
                                        status={project.has_lpg}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

function DetailItem({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
    return (
        <div className="flex gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${highlight ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className={`text-sm font-black leading-tight ${highlight ? 'text-red-600' : 'text-slate-800'}`}>{value}</p>
            </div>
        </div>
    );
}

function TechnicalBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
            <div className="text-red-600 mb-3">{icon}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800">{value}</p>
        </div>
    );
}

function CheckItem({ icon, label, status, description }: { icon: React.ReactNode, label: string, status: boolean, description?: string }) {
    return (
        <div className={`p-5 rounded-[1.5rem] border-2 flex items-start gap-4 transition-all ${status ? 'border-red-600 bg-red-50/50' : 'border-slate-50 bg-slate-50/50 opacity-60'
            }`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${status ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm font-black leading-tight ${status ? 'text-red-700' : 'text-slate-500'}`}>{label}</p>
                    {status ? (
                        <Check className="w-4 h-4 text-red-600 shrink-0" />
                    ) : (
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0" />
                    )}
                </div>
                {description && status && (
                    <p className="text-[10px] font-bold text-red-400 mt-1 leading-tight">{description}</p>
                )}
                <span className={`text-[9px] font-black uppercase tracking-tighter ${status ? 'text-red-600' : 'text-slate-400'}`}>
                    {status ? 'SIM / IDENTIFICADO' : 'NÃO CONSTA'}
                </span>
            </div>
        </div>
    );
}
