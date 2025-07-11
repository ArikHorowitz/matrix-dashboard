import React from 'react';
import type { PartData, Lens, LensKey, Chapter, ChapterStatus } from '../types';
import { FilterControls } from './FilterControls';
import { ChapterCard } from './ChapterCard';
import { ProgressBar } from './ProgressBar';
import { LensHeatmap } from './LensHeatmap';

interface DashboardProps {
  parts: PartData[];
  lenses: Lens[];
  activePart: PartData;
  partProgress: number;
  activeFilter: LensKey | 'all';
  activeStatusFilter: ChapterStatus | 'all';
  onSelectPart: (partId: number) => void;
  onSelectFilter: (filter: LensKey | 'all') => void;
  onSelectStatusFilter: (status: ChapterStatus | 'all') => void;
  onOpenFocusMode: (chapter: Chapter) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  parts,
  lenses,
  activePart,
  partProgress,
  activeFilter,
  activeStatusFilter,
  onSelectPart,
  onSelectFilter,
  onSelectStatusFilter,
  onOpenFocusMode,
}) => {
  const filteredChapters = activePart.chapters.filter(chapter => 
    activeStatusFilter === 'all' || chapter.status === activeStatusFilter
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {parts.map((part) => (
              <button
                key={part.id}
                onClick={() => onSelectPart(part.id)}
                className={`${
                  activePart.id === part.id
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-t-md`}
              >
                Part {part.id}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-200">{activePart.title}</h2>
            <ProgressBar value={partProgress} />
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-8">
          <FilterControls
            lenses={lenses.filter(l => l.id !== 'synthesis') as Lens[]}
            activeFilter={activeFilter}
            onSelectFilter={onSelectFilter}
            activeStatusFilter={activeStatusFilter}
            onSelectStatusFilter={onSelectStatusFilter}
          />
          <LensHeatmap chapters={activePart.chapters} lenses={lenses} />
        </aside>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  lenses={lenses}
                  activeFilter={activeFilter}
                  onOpenFocusMode={() => onOpenFocusMode(chapter)}
                />
              ))
            ) : (
              <div className="md:col-span-2 text-center py-12 bg-slate-800/50 rounded-lg ring-1 ring-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-300">No Chapters Found</h3>
                <p className="text-slate-400 mt-1">Try adjusting the status or lens filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
