/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { StatCard, Stat } from '../components/dashboard/StatCard';
import { ProjectCard, Project } from '../components/dashboard/ProjectCard';
import { SearchBar } from '../components/ui/SearchBar';

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Reforma Shopping da Cidade",
    status: "EM ANÁLISE",
    location: "Centro Comercial, Bloco A",
    deadline: "24 Out, 2024",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    statusColor: "text-red-600 bg-red-50",
    link: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
  },
  {
    id: 2,
    title: "Residencial Skyline",
    status: "APROVADO",
    location: "Distrito Norte, Lote 42",
    deadline: "12 Nov, 2024",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    statusColor: "text-green-600 bg-green-50",
    link: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
  },
  {
    id: 3,
    title: "Galpão Tech Park",
    status: "PENDENTE INFORMAÇÃO",
    location: "Zona Industrial, Setor 4",
    deadline: "Ação Necessária: 2 Dias Restantes",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    statusColor: "text-orange-600 bg-orange-50",
    isUrgent: true,
    link: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
  }
];

const STATS: Stat[] = [
  { label: "TOTAL ATIVOS", value: "12", color: "text-red-600" },
  { label: "EM ANÁLISE", value: "4", color: "text-red-600" },
  { label: "APROVADOS", value: "7", color: "text-green-600" },
  { label: "URGENTES", value: "2", color: "text-orange-500" },
];

export default function App() {
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
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20">
              <Plus className="w-5 h-5" />
              Novo Projeto
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, idx) => (
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
            {PROJECTS.map((project, idx) => (
              <ProjectCard key={project.id} project={project} idx={idx} />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
