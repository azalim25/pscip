import { MapPin, AlertCircle, Calendar, ArrowRight, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export interface Project {
    id: string;
    title: string;
    status: string;
    location: string;
    deadline: string;
    statusColor: string;
    riskLevel?: string;
    isUrgent?: boolean;
}

interface ProjectCardProps {
    project: Project;
    idx: number;
    onDelete?: (id: string) => void;
}

export function ProjectCard({ project, idx, onDelete }: ProjectCardProps) {
    const risk = project.riskLevel?.split(' ').pop();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-red-600/5 transition-all duration-300"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-2xl font-black text-slate-800 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                            {project.title}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase ${project.statusColor}`}>
                                {(risk === 'I' && project.status === 'EM ANÁLISE') ? 'DISPENSADO DO LICENCIAMENTO' : project.status}
                            </span>
                            {risk && risk !== 'null' && (
                                <span className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase border-2 ${risk === 'III' ? 'bg-red-50 text-red-600 border-red-100' :
                                    risk === 'II' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                    <AlertTriangle className="w-3 h-3" />
                                    Risco {risk}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex items-center text-sm font-bold text-slate-500 gap-3">
                            <div className="bg-slate-50 p-2.5 rounded-2xl">
                                <MapPin className="w-5 h-5 text-red-600" />
                            </div>
                            {project.location}
                        </div>
                        <div className={`flex items-center text-sm font-bold gap-3 ${project.isUrgent ? 'text-red-600' : 'text-slate-500'}`}>
                            <div className="bg-slate-50 p-2.5 rounded-2xl">
                                {project.isUrgent ? <AlertCircle className="w-5 h-5" /> : <Calendar className="w-5 h-5 text-red-600" />}
                            </div>
                            {project.isUrgent ? 'URGENTE' : project.deadline}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 pt-6 md:pt-0">
                    <button
                        onClick={() => onDelete?.(project.id)}
                        className="p-4 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-[1.25rem] transition-all border-2 border-transparent hover:border-red-100 shadow-sm"
                        title="Excluir Projeto"
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>

                    <Link
                        to={`/edit-project/${project.id}`}
                        className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-[1.25rem] transition-all border-2 border-transparent hover:border-slate-200 shadow-sm"
                        title="Editar Projeto"
                    >
                        <Edit3 className="w-6 h-6" />
                    </Link>

                    <Link
                        to={`/project/${project.id}`}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-[1.25rem] font-bold text-base transition-all group/btn shadow-lg shadow-red-600/20 active:scale-[0.98]"
                    >
                        <span>Abrir Detalhes</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
