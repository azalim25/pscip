import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Layout, MapPin, Calendar, ShieldAlert, ArrowLeft,
    Maximize, Ruler, Users, Landmark, Layers, Droplets, Flame,
    Check, AlertTriangle, Building2, Tag, Edit3, ShieldCheck,
    Lightbulb, Navigation, LogOut, Paintbrush, Bell, Info,
    Search, FileText, Sun, ArrowRight
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
    has_hydraulic_system: boolean;
    has_internal_roadway: boolean;
    construction_date: string | null;
    is_motel_without_corridors: boolean;
    is_wholesale_high_storage: boolean;
    building_type: 'EXISTENTE' | 'CONSTRUIDA';
    has_compartmentation: boolean;
    mixed_occupancies?: { occupancy: string, area: number, height: number }[];
    status: string;
}

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'safety'>('info');

    const getClassification = (occ: string, a: number, h: number, l: number, hydraulic: boolean) => {
        // 1. Manual trigger
        if (hydraulic) return { pt: true, pts: false, ptd: false };

        let pt = false;
        // 2. Height > 12m
        if (h > 12) pt = true;

        // 3. Area > 1200m2 for A-1, A-2, A-3
        const isResidential = occ.includes('A-1') || occ.includes('A-2') || occ.includes('A-3');
        if (isResidential && a > 1200) pt = true;

        // 4. Area > 930m2 (except M-8)
        const isM8 = occ.includes('M-8');
        if (!isM8 && a > 930) pt = true;

        // 5. Group F with population > 200
        const isGroupF = occ.includes('F-');
        if (isGroupF && l > 200) pt = true;

        const risk = project?.risk_level?.split(' ').pop();
        const pts = !pt && risk === 'III';
        const ptd = !pt && risk === 'II';

        return { pt, pts, ptd };
    };

    const projectClassification = useMemo(() => {
        if (!project) return { pt: false, pts: false, ptd: false, requiresStructural: false, requiresAlarm: false, requiresHydrants: false };

        const risk = project.risk_level?.split(' ').pop();
        const isExistente = project.building_type === 'EXISTENTE';
        const isWholesaleHigh = project.is_wholesale_high_storage;
        const mainOcc = project.occupancy;
        const isGroupC = mainOcc?.startsWith('C-');

        // Note 9 treatment: if wholesale high storage, add J-4 to considerations
        const effectiveOccupancy = (isGroupC && isWholesaleHigh && !mainOcc.includes('J'))
            ? `${mainOcc} / J-4`
            : mainOcc;

        if (!project.mixed_occupancies || project.mixed_occupancies.length === 0) {
            const c = getClassification(effectiveOccupancy, project.area, project.height, project.occupancy_load, project.has_hydraulic_system);
            return { ...c, requiresStructural: c.pt && !isExistente, requiresAlarm: c.pt, requiresHydrants: c.pt };
        }

        let pt = false;
        let pts = false;
        let ptd = false;

        const main = getClassification(effectiveOccupancy, project.area, project.height, project.occupancy_load, project.has_hydraulic_system);
        const secondary = project.mixed_occupancies.map(m => getClassification(m.occupancy, m.area, m.height, 0, false));

        if (project.has_compartmentation) {
            pt = main.pt || secondary.some(s => s.pt);
            pts = !pt && (main.pts || secondary.some(s => s.pts));
            ptd = !pt && !pts && (main.ptd || secondary.some(s => s.ptd));
        } else {
            const totalArea = project.area + project.mixed_occupancies.reduce((sum, m) => sum + m.area, 0);
            const totalHeight = project.height + project.mixed_occupancies.reduce((sum, h) => sum + h.height, 0);
            const combined = getClassification(effectiveOccupancy, totalArea, totalHeight, project.occupancy_load, project.has_hydraulic_system);

            pt = main.pt || secondary.some(s => s.pt) || combined.pt;
            pts = !pt && (main.pts || secondary.some(s => s.pts) || combined.pts);
            ptd = !pt && !pts && (main.ptd || secondary.some(s => s.ptd) || combined.ptd);
        }

        return {
            pt, pts, ptd,
            requiresStructural: pt && !isExistente,
            requiresAlarm: pt,
            requiresHydrants: pt
        };
    }, [project]);

    const isPT = projectClassification.pt;
    const isPTS = projectClassification.pts;
    const isPTD = projectClassification.ptd;
    const { requiresStructural, requiresAlarm, requiresHydrants } = projectClassification;

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
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Voltar</span>
                            </button>

                            <button
                                onClick={() => navigate(`/edit-project/${project.id}`)}
                                className="inline-flex items-center gap-2 bg-white text-slate-700 hover:text-red-600 px-4 py-2 rounded-xl font-bold transition-all shadow-sm border border-slate-100 hover:border-red-100"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Editar</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider ${project.status === 'APROVADO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {(risk === 'I' && project.status === 'EM ANÁLISE') ? 'DISPENSADO DO LICENCIAMENTO' : project.status}
                            </div>
                            {risk && risk !== 'null' && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black text-xs uppercase tracking-wider shadow-sm ${risk === 'III' ? 'bg-red-600 border-red-700 text-white' :
                                    risk === 'II' ? 'bg-orange-500 border-orange-600 text-white' :
                                        'bg-green-600 border-green-700 text-white'
                                    }`}>
                                    <span>Risco {risk}</span>
                                </div>
                            )}
                            {isPT && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border-2 border-slate-950 shadow-lg shadow-slate-900/20 text-white font-black text-xs uppercase tracking-wider">
                                    <ShieldCheck className="w-4 h-4 text-red-500" />
                                    <span>Projeto Técnico (PT)</span>
                                </div>
                            )}
                            {isPTS && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 border-2 border-blue-700 shadow-lg shadow-blue-600/20 text-white font-black text-xs uppercase tracking-wider">
                                    <ShieldCheck className="w-4 h-4 text-blue-200" />
                                    <span>Projeto Técnico Simplificado (PTS)</span>
                                </div>
                            )}
                            {isPTD && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-600 border-2 border-teal-700 shadow-lg shadow-teal-600/20 text-white font-black text-xs uppercase tracking-wider">
                                    <ShieldCheck className="w-4 h-4 text-teal-200" />
                                    <span>Projeto Técnico Declaratório (PTD)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-auto self-start">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'info'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Características
                        </button>
                        <button
                            onClick={() => setActiveTab('safety')}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'safety'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Medidas de Segurança
                        </button>
                    </div>

                    {activeTab === 'info' ? (
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
                                        Ocupação
                                    </h3>
                                    <div className="space-y-6 relative z-10">
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Uso / Grupo</p>
                                            <p className="text-base font-bold leading-tight">{project.occupancy || "Não informada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tipo de Edificação</p>
                                            <p className="text-base font-bold leading-tight">{project.building_type === 'EXISTENTE' ? 'Edificação Existente' : 'Edificação Construída / Nova'}</p>
                                        </div>

                                        {project.mixed_occupancies && project.mixed_occupancies.length > 0 && (
                                            <div className="pt-2 border-t border-slate-700/50 mt-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Ocupações Secundárias</p>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${project.has_compartmentation ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                        {project.has_compartmentation ? 'COM COMPARTIMENTAÇÃO' : 'SEM COMPARTIMENTAÇÃO'}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {project.mixed_occupancies.map((occ, i) => (
                                                        <div key={i} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/10">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-bold text-white">{occ.occupancy}</span>
                                                                <span className="text-[10px] font-black text-red-400">{occ.area} m²</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Ruler className="w-3 h-3 text-slate-500" />
                                                                <span className="text-[10px] font-bold text-slate-400">Altura: {occ.height}m</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
                                            value={project.area ? `${project.area + (project.has_compartmentation ? 0 : (project.mixed_occupancies?.reduce((sum, m) => sum + m.area, 0) || 0))} m²` : "N/A"}
                                            subValue={!project.has_compartmentation && project.mixed_occupancies && project.mixed_occupancies.length > 0 ? `(Principal: ${project.area}m²)` : undefined}
                                        />
                                        <TechnicalBox
                                            icon={<Ruler className="w-6 h-6" />}
                                            label="Altura"
                                            value={project.height ? `${project.height + (project.has_compartmentation ? 0 : (project.mixed_occupancies?.reduce((sum, h) => sum + h.height, 0) || 0))} m` : "N/A"}
                                            subValue={!project.has_compartmentation && project.mixed_occupancies && project.mixed_occupancies.length > 0 ? `(Principal: ${project.height}m)` : undefined}
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
                                        <div className="sm:col-span-2 mb-2">
                                            <div className="p-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-between group hover:border-red-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                                                        <Tag className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">CNAE</p>
                                                        <p className="text-sm font-black text-slate-700">{project.cnae || "Não se aplica"}</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Classificação Econômica</span>
                                                </div>
                                            </div>
                                        </div>

                                        <CheckItem
                                            icon={<Droplets />}
                                            label="Projeção de Sistema Hidráulico"
                                            status={project.has_hydraulic_system}
                                            description="Hidrantes, chuveiros automáticos, nebulizadores, CO2, etc."
                                        />
                                        <CheckItem
                                            icon={<Landmark />}
                                            label="Patrimônio Histórico Cultural"
                                            status={project.is_heritage}
                                        />
                                        <CheckItem
                                            icon={<Layers />}
                                            label="Subsolo com uso distinto de estacionamento"
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
                    ) : (
                        <div className="space-y-12">
                            {project.has_compartmentation ? (
                                <>
                                    <div className="p-6 bg-green-50 border-2 border-green-100 rounded-[2rem] flex items-center gap-4 mb-8">
                                        <Layers className="w-10 h-10 text-green-600" />
                                        <div>
                                            <h4 className="text-lg font-black text-green-800">Projeto com Compartimentação</h4>
                                            <p className="text-sm font-bold text-green-600/70 italic">As medidas de segurança são exigidas para cada ocupação e projetadas individualmente.</p>
                                        </div>
                                    </div>

                                    <OccupancySafetyMeasures
                                        title="Ocupação Principal"
                                        occupancy={project.occupancy}
                                        area={project.area}
                                        height={project.height}
                                        load={project.occupancy_load}
                                        project={project}
                                        globalPT={isPT}
                                        globalPTS={isPTS}
                                        globalPTD={isPTD}
                                        globalStructural={requiresStructural}
                                        globalAlarm={requiresAlarm}
                                        globalHydrants={requiresHydrants}
                                    />

                                    {project.mixed_occupancies?.map((occ, idx) => (
                                        <OccupancySafetyMeasures
                                            key={idx}
                                            title={`Ocupação Secundária: ${occ.occupancy}`}
                                            occupancy={occ.occupancy}
                                            area={occ.area}
                                            height={occ.height}
                                            load={0}
                                            project={project}
                                            globalPT={isPT}
                                            globalPTS={isPTS}
                                            globalPTD={isPTD}
                                            globalStructural={requiresStructural}
                                            globalAlarm={requiresAlarm}
                                            globalHydrants={requiresHydrants}
                                        />
                                    ))}
                                </>
                            ) : (
                                <OccupancySafetyMeasures
                                    title="Projeto Integrado (Sem Compartimentação)"
                                    occupancy={project.occupancy}
                                    area={project.area + (project.mixed_occupancies?.reduce((sum, m) => sum + m.area, 0) || 0)}
                                    height={project.height + (project.mixed_occupancies?.reduce((sum, h) => sum + h.height, 0) || 0)}
                                    load={project.occupancy_load}
                                    project={project}
                                    isIntegrated={true}
                                    globalPT={isPT}
                                    globalPTS={isPTS}
                                    globalPTD={isPTD}
                                    globalStructural={requiresStructural}
                                    globalAlarm={requiresAlarm}
                                    globalHydrants={requiresHydrants}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}

function OccupancySafetyMeasures({
    title,
    occupancy,
    area,
    height,
    load,
    project,
    isIntegrated = false,
    globalPT,
    globalPTS,
    globalPTD,
    globalStructural,
    globalAlarm,
    globalHydrants
}: {
    title: string,
    occupancy: string,
    area: number,
    height: number,
    load: number,
    project: ProjectDetails,
    isIntegrated?: boolean,
    globalPT: boolean,
    globalPTS: boolean,
    globalPTD: boolean,
    globalStructural: boolean,
    globalAlarm: boolean,
    globalHydrants: boolean
}) {
    // Component classification for this specific occupancy
    const getIndividualClassification = (occ: string, a: number, h: number, l: number) => {
        if (project.has_hydraulic_system) return { pt: true, pts: false, ptd: false };
        let pt = false;
        if (h > 12) pt = true;
        const isResidential = occ.includes('A-1') || occ.includes('A-2') || occ.includes('A-3');
        if (isResidential && a > 1200) pt = true;
        const isM8 = occ.includes('M-8');
        if (!isM8 && a > 930) pt = true;
        const isGroupF = occ.includes('F-');
        if (isGroupF && l > 200) pt = true;
        const risk = project.risk_level?.split(' ').pop();
        return { pt, pts: !pt && risk === 'III', ptd: !pt && risk === 'II' };
    };

    const isPT = globalPT;
    const isPTS = globalPTS;
    const isPTD = globalPTD;

    const risk = project.risk_level?.split(' ').pop();
    const isE6 = occupancy?.includes('E-6') || (isIntegrated && project.mixed_occupancies?.some(m => m.occupancy.includes('E-6')));
    const isH2H5 = occupancy?.includes('H-2') || occupancy?.includes('H-5') || (isIntegrated && project.mixed_occupancies?.some(m => m.occupancy.includes('H-2') || m.occupancy.includes('H-5')));
    const isExistente = project.building_type === 'EXISTENTE';
    const isGroupA2A3 = occupancy?.includes('A-2') || occupancy?.includes('A-3');
    const isGroupB = occupancy?.startsWith('B-') || (isIntegrated && project.mixed_occupancies?.some(m => m.occupancy.startsWith('B-')));
    const isGroupC = occupancy?.startsWith('C-') || (isIntegrated && project.mixed_occupancies?.some(m => m.occupancy.startsWith('C-')));
    const isGroupC3 = occupancy?.includes('C-3') || (isIntegrated && project.mixed_occupancies?.some(m => m.occupancy.includes('C-3')));
    const isPartyHall = occupancy?.toLowerCase().includes('festas') || occupancy?.toLowerCase().includes('auditório');

    // Rule for C-3 with F-5, F-6, F-11 and pop > 500
    const needsSpecialGroupF = isGroupC3 && load > 500 && (
        occupancy?.includes('F-5') || occupancy?.includes('F-6') || occupancy?.includes('F-11') ||
        (isIntegrated && project.mixed_occupancies?.some(m => m.occupancy.includes('F-5') || m.occupancy.includes('F-6') || m.occupancy.includes('F-11')))
    );

    const constructionDate = project.construction_date ? new Date(project.construction_date) : null;
    const isBefore2005 = constructionDate && constructionDate <= new Date('2005-07-01');
    const triggeringAreaB = isBefore2005 ? 1200 : 930;
    const triggeringAreaC = isBefore2005 ? 1200 : 930;

    const measures = [];

    // Basic Measures
    if (risk === 'I' || risk === 'II' || risk === 'III') {
        measures.push(
            { icon: <Flame />, title: "Extintores", description: "Proteção por extintores de incêndio portáteis ou sobre rodas." },
            { icon: <Lightbulb />, title: "Iluminação de Emergência", description: "Sistema de iluminação para facilitar a saída em emergências." },
            { icon: <Navigation />, title: "Sinalização de Emergência", description: "Placas e sinais indicativos de rotas de fuga e equipamentos." },
            { icon: <LogOut />, title: "Saídas de Emergência", description: "Vias de saída dimensionadas e desobstruídas." }
        );
    }

    if (risk === 'III' || isH2H5 || (isGroupA2A3 && height > 30) || (isGroupB && height > 12) || (isGroupC && height > 12) || (isGroupC && area > 2000)) {
        measures.push({ icon: <Users />, title: "Brigada de Incêndio", description: "Grupo organizado de pessoas treinadas para atuar na prevenção e combate." });
    }

    if (risk === 'III' || isH2H5 || (isGroupA2A3 && height > 30) || (isGroupB && area > triggeringAreaB) || (isGroupC && area > triggeringAreaC) || (isGroupC && height > 12) || (isGroupC && area > 2000)) {
        measures.push({
            icon: <Bell />,
            title: "Alarme de Incêndio",
            description: isGroupB && height > 12 && height <= 30
                ? "Sistema de detecção e alarme. Acionadores manuais obrigatórios nos corredores."
                : "Sistema de detecção e alarme de incêndio."
        });
    }

    if ((isGroupB && height > 30 && height <= 54) || (isGroupC && needsSpecialGroupF) || (isGroupC && height > 30)) {
        measures.push({
            icon: <Search />,
            title: "Detecção de Incêndio",
            description: needsSpecialGroupF
                ? "Sistema de detecção automática para áreas do Grupo F com população > 500."
                : (isGroupB ? "Sistema de detecção automática, inclusive dentro dos quartos." : "Sistema de detecção automática de incêndio.")
        });
    }

    if ((isGroupB && height > 30 && height <= 54) || (isGroupC && area > 2000) || (isGroupC && height > 12)) {
        measures.push({
            icon: <FileText />,
            title: "Plano de Intervenção",
            description: "Plano de intervenção de incêndio para a edificação."
        });
    }

    if (risk === 'III' || isH2H5 || (isGroupA2A3 && isPartyHall && load > 200) || (isGroupB && isPartyHall && load > 200) || (isGroupC && area > 2000)) {
        measures.push({ icon: <Paintbrush />, title: "CMAR", description: "Controle de Materiais de Acabamento e Revestimento." });
    }

    // Advanced Measures
    if (isPT || isGroupA2A3) {
        const advMeasures = [
            {
                icon: <Sun />,
                title: "Iluminação de Emergência",
                description: "Sistema de iluminação para aclaramento e balizamento.",
                isExempt: isGroupB && project.is_motel_without_corridors
            },
            {
                icon: <ArrowRight />,
                title: "Sinalização de Emergência",
                description: "Sinalização visual para orientação e salvamento.",
                isExempt: isGroupB && project.is_motel_without_corridors
            },
            {
                icon: <ShieldAlert />,
                title: "Acesso de Viaturas",
                description: "Vias de acesso para viaturas do Corpo de Bombeiros.",
                isExempt: isExistente ||
                    (isGroupA2A3 && height <= 30 && area <= 1200 && !project.has_internal_roadway) ||
                    (isGroupB && height <= 12 && area <= 930 && !project.has_internal_roadway) ||
                    (isGroupC && height <= 12 && area <= 930 && !project.has_internal_roadway)
            },
            {
                icon: <Building2 />,
                title: "Segurança Estrutural",
                description: "Segurança estrutural contra incêndio (TRRF).",
                isExempt: isExistente ||
                    (isGroupA2A3 && height <= 12) ||
                    (isGroupB && height <= 12) ||
                    (isGroupC && height <= 12 && area <= 930)
            },
            {
                icon: <Layers />,
                title: "Compartimentação Horizontal",
                description: (isGroupB && height > 12 && height <= 30) || (isGroupC && height <= 12 && area > 930)
                    ? "Exigências de compartimentação (pode ser substituída por Sprinklers, exceto em shafts)."
                    : "Exigências de compartimentação para evitar propagação de calor e fumaça.",
                isExempt: isExistente || (isGroupC && height <= 12 && area <= 930)
            },
            {
                icon: <Layers />,
                title: "Compartimentação Vertical",
                description: "Exigências de compartimentação para evitar propagação entre pavimentos.",
                isExempt: isExistente ||
                    (isGroupA2A3 && height <= 30) ||
                    (isGroupB && height <= 12) ||
                    (isGroupC && height <= 12)
            },
            {
                icon: <Droplets />,
                title: "Sistema de Hidrantes",
                description: "Rede de hidrantes e mangotinhos.",
                isExempt: (isGroupA2A3 && height <= 12 && area <= 1200) ||
                    (isGroupB && height <= 12 && area <= triggeringAreaB) ||
                    (isGroupC && height <= 12 && area <= triggeringAreaC)
            },
            {
                icon: <Droplets />,
                title: "Chuveiros Automáticos",
                description: "Sistemas de chuveiros automáticos (Sprinklers).",
                isExempt: isExistente &&
                    !(isGroupB && height > 30) &&
                    !(isGroupC && height > 30) &&
                    !(isGroupC && occupancy?.includes('C-3') && (occupancy?.includes('F-5') || occupancy?.includes('F-6') || occupancy?.includes('F-11')))
            },
            {
                icon: <Flame />,
                title: "Controle de Fumaça",
                description: "Sistemas para controle de movimentação de fumaça.",
                isExempt: isExistente ||
                    (isGroupB && height <= 54) ||
                    (isGroupC && height <= 30 && !needsSpecialGroupF)
            }
        ];

        // Filter measures based on being PT or Group A/B/C
        const filteredAdv = advMeasures.filter(m => {
            if (isPT) return true;
            if (isGroupA2A3) {
                if (m.title === "Acesso de Viaturas") return true;
                if (m.title === "Segurança Estrutural" && height > 12) return true;
                if (m.title === "Compartimentação Vertical" && height > 30) return true;
                if (m.title === "Sistema de Hidrantes") return true;
            }
            if (isGroupB) {
                if (m.title === "Acesso de Viaturas") return true;
                if (m.title === "Segurança Estrutural" && height > 12) return true;
                if (m.title === "Compartimentação Horizontal" && height > 12) return true;
                if (m.title === "Compartimentação Vertical" && height > 12) return true;
                if (m.title === "Sistema de Hidrantes") return true;
                if (m.title === "Chuveiros Automáticos" && height > 30) return true;
                if (m.title === "Controle de Fumaça" && height > 54) return true;
                if (m.title === "Iluminação de Emergência" && project.is_motel_without_corridors) return true;
                if (m.title === "Sinalização de Emergência" && project.is_motel_without_corridors) return true;
            }
            if (isGroupC) {
                if (m.title === "Acesso de Viaturas") return true;
                if (m.title === "Segurança Estrutural" && (height > 12 || area > 930)) return true;
                if (m.title === "Compartimentação Horizontal" && (height > 12 || area > 930)) return true;
                if (m.title === "Compartimentação Vertical" && height > 12) return true;
                if (m.title === "Sistema de Hidrantes") return true;
                if (m.title === "Chuveiros Automáticos" && (height > 30 || (height > 12 && needsSpecialGroupF))) return true;
                if (m.title === "Controle de Fumaça" && (height > 30 || needsSpecialGroupF)) return true;
            }
            return false;
        });

        measures.push(...filteredAdv);
    } else if (!isExistente && project.mixed_occupancies && project.mixed_occupancies.length > 0) {
        if (globalStructural) measures.push({ icon: <Building2 />, title: "Segurança Estrutural", description: "Segurança estrutural contra incêndio (TRRF) - Exigência Global." });
        if (globalAlarm) measures.push({ icon: <Bell />, title: "Alarme de Incêndio", description: "Sistema de detecção e alarme de incêndio - Exigência Global." });
        if (globalHydrants) measures.push({ icon: <Droplets />, title: "Sistema de Hidrantes", description: "Rede de hidrantes e mangotinhos - Exigência Global." });
    }

    return (
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-l-4 border-red-600 pl-4">
                <div>
                    <h3 className="text-2xl font-black text-slate-800">{title}</h3>
                    <p className="text-slate-500 font-medium italic">
                        {occupancy} • {area}m² • {height}m
                    </p>
                </div>
                <div className="flex gap-2">
                    {isPT && <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg">PT</span>}
                    {isPTS && <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg">PTS</span>}
                    {isPTD && <span className="px-3 py-1 bg-teal-600 text-white text-[10px] font-black rounded-lg">PTD</span>}
                </div>
            </div>

            {isExistente && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-xs font-bold text-blue-700 italic">
                        Edificação Existente: Algumas medidas de segurança possuem isenção automática conforme legislação vigente.
                    </p>
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {measures.map((measure, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-6 rounded-[2rem] border-2 transition-all hover:shadow-lg ${(measure as any).isExempt
                            ? 'bg-slate-50/50 border-slate-100 opacity-75 grayscale-[0.5]'
                            : 'bg-slate-50 border-slate-100 hover:border-red-100 hover:bg-white'
                            }`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl shadow-lg ${(measure as any).isExempt
                                ? 'bg-slate-400 text-white shadow-slate-400/20'
                                : 'bg-red-600 text-white shadow-red-600/20'
                                }`}>
                                {React.cloneElement(measure.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 leading-tight">{measure.title}</h4>
                                {(measure as any).isExempt && (
                                    <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Isento</span>
                                )}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed">
                            {measure.description}
                        </p>
                    </motion.div>
                ))}
            </div>
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

function TechnicalBox({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) {
    return (
        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
            <div className="text-red-600 mb-3">{icon}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800">{value}</p>
            {subValue && <p className="text-[10px] font-bold text-slate-400 mt-1">{subValue}</p>}
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
