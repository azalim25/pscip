import { Search } from 'lucide-react';

export function SearchBar() {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 w-5 h-5" />
            <input
                type="text"
                placeholder="Buscar projetos de prevenção..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-red-50/50 focus:ring-2 focus:ring-red-600 text-slate-900 placeholder-slate-400 transition-all"
            />
        </div>
    );
}
