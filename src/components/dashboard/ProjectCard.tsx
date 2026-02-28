import { MapPin, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export interface Project {
    id: number;
    title: string;
    status: string;
    location: string;
    deadline: string;
    image: string;
    statusColor: string;
    isUrgent?: boolean;
    link: string;
}

interface ProjectCardProps {
    project: Project;
    idx: number;
}

export function ProjectCard({ project, idx }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm border border-red-50 hover:shadow-xl hover:shadow-red-600/5 transition-all duration-300"
        >
            <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white font-bold text-xs bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Exibir imagem original</span>
                    </div>
                </a>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold group-hover:text-red-600 transition-colors">{project.title}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider ${project.statusColor}`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-slate-500 gap-2.5">
                            <MapPin className="w-4 h-4 text-red-600" />
                            {project.location}
                        </div>
                        <div className={`flex items-center text-sm gap-2.5 ${project.isUrgent ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                            {project.isUrgent ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4 text-red-600" />}
                            {project.deadline}
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                    <button className="text-red-600 font-bold text-sm flex items-center gap-1.5 group/btn">
                        Abrir Projeto
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
