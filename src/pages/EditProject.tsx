import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    Layout, MapPin, Calendar, ShieldAlert, Save, ArrowLeft,
    Maximize, Ruler, Users, Landmark, Layers, Droplets, Flame, Check, AlertTriangle, Droplet, Plus, Trash2, LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';
import { OccupancySelector } from '../components/dashboard/OccupancySelector';
import { CnaeSelector } from '../components/dashboard/CnaeSelector';

export default function EditProject() {
    const { id } = useParams<{ id: string }>();
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

    // Compliance and Storage State
    const [isUrgent, setIsUrgent] = useState(false);
    const [isHeritage, setIsHeritage] = useState(false);
    const [hasBasementUse, setHasBasementUse] = useState(false);
    const [hasLiquidFuel, setHasLiquidFuel] = useState(false);
    const [hasLpg, setHasLpg] = useState(false);
    const [hasHydraulicSystem, setHasHydraulicSystem] = useState(false);
    const [hasInternalRoadway, setHasInternalRoadway] = useState(false);
    const [isWholesaleHighStorage, setIsWholesaleHighStorage] = useState(false);
    const [constructionDate, setConstructionDate] = useState('');
    const [isMotelWithoutCorridors, setIsMotelWithoutCorridors] = useState(false);
    const [buildingType, setBuildingType] = useState<'EXISTENTE' | 'CONSTRUIDA'>('CONSTRUIDA');
    const [isMixedOccupancy, setIsMixedOccupancy] = useState(false);
    const [hasCompartmentation, setHasCompartmentation] = useState(false);
    const [additionalOccupancies, setAdditionalOccupancies] = useState<{ occupancy: string, area: string, height: string }[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProject() {
            if (!id || !session?.user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .eq('user_id', session.user.id)
                    .single();

                if (error) throw error;
                if (data) {
                    setTitle(data.title || '');
                    setLocation(data.location || '');
                    setOccupancy(data.occupancy || '');
                    setDeadline(data.deadline || '');
                    setCnae(data.cnae || '');
                    setArea(data.area?.toString() || '');
                    setHeight(data.height?.toString() || '');
                    setOccupancyLoad(data.occupancy_load?.toString() || '');
                    setIsUrgent(data.is_urgent || false);
                    setIsHeritage(data.is_heritage || false);
                    setHasBasementUse(data.has_distinct_basement_use || false);
                    setHasLiquidFuel(data.has_liquid_fuel || false);
                    setHasLpg(data.has_lpg || false);
                    setHasHydraulicSystem(data.has_hydraulic_system || false);
                    setHasInternalRoadway(data.has_internal_roadway || false);
                    setIsWholesaleHighStorage(data.is_wholesale_high_storage || false);
                    setConstructionDate(data.construction_date || '');
                    setIsMotelWithoutCorridors(data.is_motel_without_corridors || false);
                    setBuildingType(data.building_type || 'CONSTRUIDA');
                    setHasCompartmentation(data.has_compartmentation || false);
                    const mixed = data.mixed_occupancies || [];
                    setAdditionalOccupancies(mixed.map((m: any) => ({
                        occupancy: m.occupancy,
                        area: m.area.toString(),
                        height: (m.height || 0).toString()
                    })));
                    setIsMixedOccupancy(mixed.length > 0);
                }
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError('Erro ao carregar dados do projeto.');
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [id, session]);

    // Risk Level Calculation
    const riskLevel = useMemo(() => {
        const calculateForOccupancy = (occ: string, a: string, h: string, l: string) => {
            const areaVal = parseFloat(a) || 0;
            const heightVal = parseFloat(h) || 0;
            const loadVal = parseInt(l) || 0;

            const isRiscoIII =
                isHeritage ||
                heightVal > 12 ||
                loadVal > 100 ||
                hasLiquidFuel ||
                hasLpg ||
                (cnae !== '' && cnae !== 'N/A') ||
                areaVal > 930 ||
                occ.includes('H-2') ||
                occ.includes('H-5');

            if (isRiscoIII) return 3;
            if (areaVal > 200) return 2;
            if (areaVal > 0) return 1;
            return 0;
        };

        const levels = [
            calculateForOccupancy(occupancy, area, height, occupancyLoad),
            ...additionalOccupancies.map(o => calculateForOccupancy(o.occupancy, o.area, o.height, '0'))
        ];

        const maxLevel = Math.max(...levels);

        if (maxLevel === 3) return 'III';
        if (maxLevel === 2) return 'II';
        if (maxLevel === 1) return 'I';
        return null;
    }, [area, height, occupancyLoad, isHeritage, hasLiquidFuel, hasLpg, cnae, occupancy, additionalOccupancies]);

    const addOccupancy = () => {
        setAdditionalOccupancies([...additionalOccupancies, { occupancy: '', area: '', height: '' }]);
    };

    const removeOccupancy = (index: number) => {
        setAdditionalOccupancies(additionalOccupancies.filter((_, i) => i !== index));
    };

    const updateOccupancy = (index: number, field: 'occupancy' | 'area' | 'height', value: string) => {
        const newOccupancies = [...additionalOccupancies];
        newOccupancies[index] = { ...newOccupancies[index], [field]: value };
        setAdditionalOccupancies(newOccupancies);
    };

    const validateOccupancy = (index: number) => {
        const occ = additionalOccupancies[index];
        if (occ.area !== '') {
            const areaVal = parseFloat(occ.area);
            if (areaVal > 0 && areaVal < 930) {
                alert(`A ocupação secundária deve ter área superior a 930m² para ser considerada ocupação mista. Esta entrada será removida.`);
                removeOccupancy(index);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id || !id) return;

        setSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('projects')
                .update({
                    title,
                    location,
                    occupancy,
                    cnae,
                    area: area ? parseFloat(area) : null,
                    height: height ? parseFloat(height) : null,
                    occupancy_load: occupancyLoad ? parseInt(occupancyLoad) : null,
                    deadline,
                    is_urgent: isUrgent,
                    is_heritage: isHeritage,
                    has_distinct_basement_use: hasBasementUse,
                    has_liquid_fuel: hasLiquidFuel,
                    has_lpg: hasLpg,
                    has_hydraulic_system: hasHydraulicSystem,
                    has_internal_roadway: hasInternalRoadway,
                    is_wholesale_high_storage: isWholesaleHighStorage,
                    construction_date: constructionDate || null,
                    is_motel_without_corridors: isMotelWithoutCorridors,
                    risk_level: riskLevel ? `Nível de Risco ${riskLevel}` : null,
                    building_type: buildingType,
                    has_compartmentation: hasCompartmentation,
                    mixed_occupancies: additionalOccupancies
                        .filter(o => o.occupancy !== '' && parseFloat(o.area) >= 930)
                        .map(o => ({
                            occupancy: o.occupancy,
                            area: parseFloat(o.area),
                            height: parseFloat(o.height) || 0
                        }))
                })
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (updateError) throw updateError;

            navigate(`/project/${id}`);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar projeto');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f6f6] pb-24">
            <Header
                title="Editar Projeto"
                subtitle={`Atualizando: ${title}`}
            />

            <main className="max-w-5xl mx-auto px-4 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl overflow-hidden"
                >
                    <div className="p-4 sm:p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-2.5 sm:p-3 rounded-2xl text-white shadow-lg shadow-slate-800/20">
                                <Layout className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Editar Detalhes</h2>
                                <p className="text-slate-500 text-xs sm:text-sm font-medium">Altere as informações necessárias</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                            <AnimatePresence mode="wait">
                                {riskLevel && (
                                    <motion.div
                                        key={riskLevel}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black text-sm uppercase tracking-wider ${riskLevel === 'III' ? 'bg-red-600 border-red-700 text-white shadow-lg shadow-red-600/20' :
                                            riskLevel === 'II' ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20' :
                                                'bg-green-600 border-green-700 text-white shadow-lg shadow-green-600/20'
                                            }`}
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Risco {riskLevel}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold transition-colors text-sm sm:text-base"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Voltar</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8 sm:space-y-12">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs sm:text-sm font-bold flex gap-3 border border-red-100 italic">
                                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Information Group 1 - Technical */}
                            <div className="space-y-6 sm:space-y-8">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 border-l-4 border-red-600 pl-4 py-1 flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                    Informações Técnicas
                                </h3>

                                <div className="space-y-6">
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 sm:mb-3 ml-1">Área Total</label>
                                            <div className="relative group">
                                                <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={area}
                                                    onChange={(e) => setArea(e.target.value)}
                                                    placeholder="0,00"
                                                    className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">m²</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 sm:mb-3 ml-1">Altura</label>
                                            <div className="relative group">
                                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    placeholder="0,00"
                                                    className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">m</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 sm:mb-3 ml-1">Lotação (Pessoas)</label>
                                            <div className="relative group">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                                <input
                                                    type="number"
                                                    value={occupancyLoad}
                                                    onChange={(e) => setOccupancyLoad(e.target.value)}
                                                    placeholder="0"
                                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 sm:mb-3 ml-1">Prazo Estimado</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={deadline}
                                                    onChange={(e) => setDeadline(e.target.value)}
                                                    placeholder="Ex: 24 Out, 2024"
                                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <OccupancySelector
                                        onSelect={(val) => setOccupancy(val)}
                                        selectedId={occupancy}
                                    />

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Data de Construção / Início de Obra</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                            <input
                                                type="date"
                                                value={constructionDate}
                                                onChange={(e) => {
                                                    const dateVal = e.target.value;
                                                    setConstructionDate(dateVal);
                                                    if (dateVal) {
                                                        const cutoff = new Date('2025-07-01');
                                                        const chosen = new Date(dateVal);
                                                        if (chosen < cutoff) {
                                                            setBuildingType('EXISTENTE');
                                                        } else {
                                                            setBuildingType('CONSTRUIDA');
                                                        }
                                                    }
                                                }}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900"
                                            />
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1 italic text-center">
                                            Edificações anteriores a 01/07/2025 são consideradas **Existentes**.
                                        </p>
                                    </div>

                                    <div className="pt-4">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Tipo de Edificação</label>
                                        <div className="flex p-1 bg-slate-100 rounded-2xl w-full">
                                            <button
                                                type="button"
                                                onClick={() => setBuildingType('CONSTRUIDA')}
                                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${buildingType === 'CONSTRUIDA'
                                                    ? 'bg-white text-red-600 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                Edificação Construída / Nova
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBuildingType('EXISTENTE')}
                                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${buildingType === 'EXISTENTE'
                                                    ? 'bg-white text-red-600 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                Edificação Existente
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1 italic text-center">
                                            {buildingType === 'EXISTENTE'
                                                ? 'Edificações existentes possuem isenções em certas medidas de segurança.'
                                                : 'Edificações novas/construídas devem atender a todos os requisitos normativos.'}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Information Group 2 - Compliance */}
                            <div className="space-y-8">
                                <h3 className="text-lg font-black text-slate-900 border-l-4 border-slate-800 pl-4 py-1 flex items-center gap-3">
                                    <Check className="w-5 h-5 text-slate-800" />
                                    Compliance e Armazenamento
                                </h3>

                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <CnaeSelector
                                            onSelect={(val) => setCnae(val)}
                                            selectedCnae={cnae}
                                        />
                                    </div>
                                    <QuestionToggle
                                        label="Patrimônio Histórico Cultural?"
                                        icon={<Landmark className={`w-6 h-6 ${isHeritage ? 'text-red-600' : 'text-slate-300'}`} />}
                                        value={isHeritage}
                                        onChange={setIsHeritage}
                                    />

                                    <QuestionToggle
                                        label="Subsolo com uso distinto de estacionamento"
                                        icon={<Layers className={`w-6 h-6 ${hasBasementUse ? 'text-red-600' : 'text-slate-300'}`} />}
                                        value={hasBasementUse}
                                        onChange={setHasBasementUse}
                                    />

                                    <QuestionToggle
                                        label="Armazenamento de líquido combustível ou inflamável (> 1000 L)?"
                                        icon={<Droplets className={`w-6 h-6 ${hasLiquidFuel ? 'text-red-600' : 'text-slate-300'}`} />}
                                        value={hasLiquidFuel}
                                        onChange={setHasLiquidFuel}
                                        description="Inclui armazenamento fracionado"
                                    />

                                    <QuestionToggle
                                        label="Armazenamento de GLP em quantidade superior a 190 Kg?"
                                        icon={<Flame className={`w-6 h-6 ${hasLpg ? 'text-red-600' : 'text-slate-300'}`} />}
                                        value={hasLpg}
                                        onChange={setHasLpg}
                                    />

                                    <QuestionToggle
                                        label="Projeção de Sistema Hidráulico de Combate a Incêndio?"
                                        icon={<Droplet className={`w-6 h-6 ${hasHydraulicSystem ? 'text-blue-600' : 'text-slate-300'}`} />}
                                        value={hasHydraulicSystem}
                                        onChange={setHasHydraulicSystem}
                                        description="Hidrantes, chuveiros automáticos, nebulizadores, CO2, etc."
                                    />

                                    {(occupancy.startsWith('A-') || occupancy.startsWith('D-')) && (
                                        <QuestionToggle
                                            label="Condomínio com arruamento interno?"
                                            icon={<MapPin className={`w-6 h-6 ${hasInternalRoadway ? 'text-red-600' : 'text-slate-300'}`} />}
                                            value={hasInternalRoadway}
                                            onChange={setHasInternalRoadway}
                                            description="Aplica-se a condomínios residenciais horizontais ou verticais com vias internas."
                                        />
                                    )}

                                    {occupancy.startsWith('B-') && (
                                        <QuestionToggle
                                            label="Motel sem corredores internos cobertos?"
                                            icon={<LogOut className={`w-6 h-6 ${isMotelWithoutCorridors ? 'text-red-600' : 'text-slate-300'}`} />}
                                            value={isMotelWithoutCorridors}
                                            onChange={setIsMotelWithoutCorridors}
                                            description="Para ocupações do Grupo B que não possuam circulação interna comum."
                                        />
                                    )}

                                    {occupancy.startsWith('C-') && (
                                        <QuestionToggle
                                            label="Atacado/Atacarejo com estocagem > 3,70m?"
                                            icon={<Layers className={`w-6 h-6 ${isWholesaleHighStorage ? 'text-red-600' : 'text-slate-300'}`} />}
                                            value={isWholesaleHighStorage}
                                            onChange={setIsWholesaleHighStorage}
                                            description="Nota 9: Altura de armazenamento superior a 3,70m no salão de vendas."
                                        />
                                    )}

                                    <div className="pt-4 space-y-4">
                                        <QuestionToggle
                                            label="Edificação de Ocupação Mista?"
                                            icon={<Plus className={`w-6 h-6 ${isMixedOccupancy ? 'text-red-600' : 'text-slate-300'}`} />}
                                            value={isMixedOccupancy}
                                            onChange={(val) => {
                                                setIsMixedOccupancy(val);
                                                if (!val) {
                                                    setAdditionalOccupancies([]);
                                                    setHasCompartmentation(false);
                                                }
                                            }}
                                            description="Possui mais de um tipo de ocupação"
                                        />

                                        <AnimatePresence>
                                            {isMixedOccupancy && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden"
                                                >
                                                    <div className="flex p-1 bg-slate-100 rounded-2xl w-full mb-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setHasCompartmentation(true)}
                                                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${hasCompartmentation
                                                                ? 'bg-white text-red-600 shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            Possui Compartimentação
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setHasCompartmentation(false)}
                                                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${!hasCompartmentation
                                                                ? 'bg-white text-red-600 shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            Não possui Compartimentação
                                                        </button>
                                                    </div>

                                                    {additionalOccupancies.map((occ, idx) => (
                                                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ocupação Secundária #{idx + 1}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOccupancy(idx)}
                                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <OccupancySelector
                                                                    onSelect={(val) => updateOccupancy(idx, 'occupancy', val)}
                                                                    selectedId={occ.occupancy}
                                                                />
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="relative group">
                                                                        <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                                                        <input
                                                                            type="number"
                                                                            value={occ.area}
                                                                            onChange={(e) => updateOccupancy(idx, 'area', e.target.value)}
                                                                            onBlur={() => validateOccupancy(idx)}
                                                                            placeholder="Área (m²)"
                                                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                                        />
                                                                    </div>
                                                                    <div className="relative group">
                                                                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors" />
                                                                        <input
                                                                            type="number"
                                                                            value={occ.height}
                                                                            onChange={(e) => updateOccupancy(idx, 'height', e.target.value)}
                                                                            placeholder="Altura (m)"
                                                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addOccupancy}
                                                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all font-bold flex items-center justify-center gap-2"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                        <span>Adicionar Outra Ocupação</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="pt-4">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Prioridade do Projeto</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsUrgent(!isUrgent)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold ${isUrgent
                                                ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-inner'
                                                : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-red-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 text-left">
                                                <ShieldAlert className={`w-6 h-6 ${isUrgent ? 'text-orange-500' : 'text-slate-300'}`} />
                                                <div>
                                                    <span>{isUrgent ? 'Prioridade Urgente' : 'Prioridade Normal'}</span>
                                                    <p className="text-[10px] font-medium opacity-70">Define a ordem de análise</p>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${isUrgent ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUrgent ? 'left-7' : 'left-1'}`} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-slate-900 hover:bg-red-600 text-white font-bold py-6 rounded-[2rem] transition-all shadow-xl shadow-slate-900/10 hover:shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-xl"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-7 h-7" />
                                        <span>Salvar Alterações</span>
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

interface QuestionToggleProps {
    label: string;
    description?: string;
    icon: React.ReactNode;
    value: boolean;
    onChange: (val: boolean) => void;
}

function QuestionToggle({ label, description, icon, value, onChange }: QuestionToggleProps) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all font-bold ${value
                ? 'border-red-600 bg-red-50 text-red-600 shadow-inner'
                : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-red-100'
                }`}
        >
            <div className="flex items-center gap-4 text-left">
                <div className={`shrink-0 transition-transform ${value ? 'scale-110' : ''}`}>
                    {icon}
                </div>
                <div>
                    <span className="block leading-tight">{label}</span>
                    {description && (
                        <p className={`text-[10px] font-medium mt-1 ${value ? 'text-red-400' : 'text-slate-400'}`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0 ml-4">
                <div className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-red-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
                </div>
                <span className="text-[9px] uppercase tracking-tighter">{value ? 'Sim' : 'Não'}</span>
            </div>
        </button>
    );
}
