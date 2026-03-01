import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FolderSearch, BarChart3, ShieldAlert } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { ProjectCard, Project } from '../components/dashboard/ProjectCard';
import { SearchBar } from '../components/ui/SearchBar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ViewProjects() {
    const { session } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        if (!session?.user?.id) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedProjects: Project[] = data.map(p => ({
                    id: p.id,
                    title: p.title,
                    status: p.status,
                    location: p.location || "Local não informado",
                    deadline: p.deadline || "Sem prazo",
                    statusColor: p.status === 'APROVADO' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
                    riskLevel: p.risk_level,
                    isUrgent: p.is_urgent,
                }));
                setProjects(mappedProjects);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [session]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    };

    const filteredProjects = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return projects;

        return projects.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query)
        );
    }, [projects, searchQuery]);

    return (
        <div className="min-h-screen bg-[#f8f6f6]">
            <Header
                title="Visualizar Projetos"
                subtitle="Consulte e gerencie todos os seus projetos ativos"
            />

            <main className="max-w-5xl mx-auto px-4 mt-8 pb-24">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-8 overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-600/20">
                                <Search className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Busca Avançada</h2>
                                <p className="text-slate-500 text-sm font-medium">Filtrar por título ou localização</p>
                            </div>
                        </div>

                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Digite o nome ou endereço do projeto..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <FolderSearch className="w-5 h-5 text-red-600" />
                            Resultados Found ({filteredProjects.length})
                        </h3>
                    </div>

                    <div className="grid gap-6">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="py-20 text-center col-span-full">
                                    <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-slate-500 font-bold">Carregando seus projetos...</p>
                                </div>
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((project, idx) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        idx={idx}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] col-span-full"
                                >
                                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldAlert className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800">Nenhum projeto encontrado</h4>
                                    <p className="text-slate-500 mt-2 font-medium">Tente ajustar seus critérios de busca ou crie um novo projeto.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
