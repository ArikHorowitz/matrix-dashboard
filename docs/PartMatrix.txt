import React, { useMemo } from 'react';
import type { PartData, Lens, LensKey, Chapter, ChapterStatus, GoldenThreadFilter } from '../types';
import { FilterControls } from './FilterControls';
import { ChapterCard } from './ChapterCard';
import { ProgressBar } from './ProgressBar';
import { LensHeatmap } from './LensHeatmap';
import { MOTIFS } from '../data/MOTIFS';

interface PartMatrixProps {
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
  onBack: () => void;
  goldenThreadFilter: GoldenThreadFilter;
  onSetGoldenThread: (filter: GoldenThreadFilter | null) => void;
}

export const PartMatrix: React.FC<PartMatrixProps> = ({
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
  onBack,
  goldenThreadFilter,
  onSetGoldenThread,
}) => {
  const filteredChapters = useMemo(() => {
    return activePart.chapters.filter(chapter => 
      activeStatusFilter === 'all' || chapter.status === activeStatusFilter
    );
  }, [activePart, activeStatusFilter]);

  const goldenThreadChapterIds = useMemo(() => {
    if (!goldenThreadFilter) return null;
    
    const chapterIds = new Set<string>();
    
    if (goldenThreadFilter.type === 'lens') {
      activePart.chapters.forEach(chapter => {
        const content = chapter.lenses[goldenThreadFilter.id];
        if (content && content.trim() !== '' && content.trim().toLowerCase() !== 'n/a') {
          chapterIds.add(chapter.id);
        }
      });
    } else if (goldenThreadFilter.type === 'motif') {
      const motif = MOTIFS.find(m => m.name === goldenThreadFilter.id);
      if (motif) {
        const regex = new RegExp(motif.keywords.join('|'), 'i');
        activePart.chapters.forEach(chapter => {
          const searchableText = [
            chapter.synthesis,
            chapter.title,
            ...Object.values(chapter.lenses)
          ].join(' ');
          if (regex.test(searchableText)) {
            chapterIds.add(chapter.id);
          }
        });
      }
    }
    return chapterIds;
  }, [goldenThreadFilter, activePart.chapters]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2 py-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Master Matrix
        </button>

        {goldenThreadFilter && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg flex items-center justify-between gap-4 ring-1 ring-amber-500/50">
                <p className="text-sm text-amber-300">
                    <span className="font-bold">Golden Thread Active:</span> Tracing all chapters related to "{goldenThreadFilter.type === 'lens' ? goldenThreadFilter.name : goldenThreadFilter.id}".
                </p>
                <button 
                    onClick={() => onSetGoldenThread(null)}
                    className="px-3 py-1 text-sm font-medium bg-amber-500 text-slate-900 rounded-full hover:bg-amber-400 transition-colors duration-200 flex-shrink-0"
                    aria-label="Clear Golden Thread filter"
                >
                    Clear Thread
                </button>
            </div>
        )}

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
                  isDimmed={goldenThreadChapterIds !== null && !goldenThreadChapterIds.has(chapter.id)}
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