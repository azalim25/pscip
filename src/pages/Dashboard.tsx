import { useEffect, useState, useCallback } from 'react';
import { Plus, BarChart3, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { StatCard, Stat } from '../components/dashboard/StatCard';
import { ProjectCard, Project } from '../components/dashboard/ProjectCard';
import { SearchBar } from '../components/ui/SearchBar';
import { AddProjectModal } from '../components/dashboard/AddProjectModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const STATS_TEMPLATES: Stat[] = [
  { label: "TOTAL ATIVOS", value: "0", color: "text-red-600" },
  { label: "EM ANÁLISE", value: "0", color: "text-red-600" },
  { label: "APROVADOS", value: "0", color: "text-green-600" },
  { label: "URGENTES", value: "0", color: "text-orange-500" },
];

export default function Dashboard() {
  const { session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stat[]>(STATS_TEMPLATES);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
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
          image: p.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
          statusColor: p.status === 'APROVADO' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
          isUrgent: p.is_urgent,
          link: "#"
        }));

        setProjects(mappedProjects);

        const newStats = [...STATS_TEMPLATES].map(s => ({ ...s }));
        newStats[0].value = mappedProjects.length.toString();
        newStats[1].value = mappedProjects.filter(p => p.status === 'EM ANÁLISE').length.toString();
        newStats[2].value = mappedProjects.filter(p => p.status === 'APROVADO').length.toString();
        newStats[3].value = mappedProjects.filter(p => p.isUrgent).length.toString();
        setStats(newStats);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-[#f8f6f6] font-sans text-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto w-full px-4 pb-24">
        {/* Welcome & Search */}
        <div className="py-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
            <p className="text-slate-500">Gerencie seus projetos de adequação e prevenção de incêndio</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar />
            <div className="flex gap-4">
              <Link
                to="/classification"
                className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-200 shadow-sm whitespace-nowrap"
              >
                <ScrollText className="w-5 h-5 text-red-600" />
                Classificações
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Novo Projeto
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} stat={stat} idx={idx} />
          ))}
        </div>

        {/* Active Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-600" />
              Projetos Ativos
            </h3>
            <button className="text-red-600 font-bold text-sm hover:underline">Ver Todos</button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">Carregando seus projetos...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} idx={idx} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl"
              >
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-700">Nenhum projeto ainda</h4>
                <p className="text-slate-500 mt-1">Seus projetos ativos aparecerão aqui.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectAdded={fetchProjects}
      />
    </div>
  );
}
