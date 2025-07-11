import React from 'react';
import type { Lens, LensKey, ChapterStatus } from '../types';

interface FilterControlsProps {
  lenses: Lens[];
  activeFilter: LensKey | 'all';
  onSelectFilter: (filter: LensKey | 'all') => void;
  activeStatusFilter: ChapterStatus | 'all';
  onSelectStatusFilter: (status: ChapterStatus | 'all') => void;
}

const STATUS_OPTIONS: { id: ChapterStatus | 'all', label: string, emoji: string }[] = [
    { id: 'all', label: 'All Statuses', emoji: '📂' },
    { id: 'review', label: 'Needs Review', emoji: '🧪' },
    { id: 'draft', label: 'Draft', emoji: '⬜' },
    { id: 'final', label: 'Final', emoji: '✅' },
];

export const FilterControls: React.FC<FilterControlsProps> = ({ 
    lenses, 
    activeFilter, 
    onSelectFilter,
    activeStatusFilter,
    onSelectStatusFilter
}) => {
  return (
    <div className="space-y-6 bg-slate-800/50 p-4 rounded-lg ring-1 ring-slate-700/50">
      <div>
        <h3 className="text-md font-semibold text-slate-300 mb-3">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(status => (
            <button
              key={status.id}
              onClick={() => onSelectStatusFilter(status.id)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
                activeStatusFilter === status.id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              aria-pressed={activeStatusFilter === status.id}
            >
              <span>{status.emoji}</span>
              <span>{status.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-slate-300 mb-3">Thematic Lens Audit</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectFilter('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'all'
                ? 'bg-cyan-400 text-slate-900 shadow-md'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-pressed={activeFilter === 'all'}
          >
            All Lenses
          </button>
          {lenses.map((lens) => (
            <button
              key={lens.id}
              onClick={() => onSelectFilter(lens.id as LensKey)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
                activeFilter === lens.id
                  ? 'bg-cyan-400 text-slate-900 shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              aria-pressed={activeFilter === lens.id}
            >
              <span>{lens.emoji}</span>
              <span>{lens.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
