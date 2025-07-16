import React, { useState } from 'react';
import type { Chapter, Lens, LensKey, ChapterStatus } from '../types';
import { RevisionFlags } from './RevisionFlags';

interface ChapterCardProps {
  chapter: Chapter;
  lenses: Lens[];
  activeFilter: LensKey | 'all';
  onOpenFocusMode: () => void;
  isDimmed?: boolean;
}

const STATUS_STYLES: Record<ChapterStatus, { emoji: string, color: string, label: string }> = {
    final: { emoji: '✅', color: 'text-green-400', label: 'Final' },
    draft: { emoji: '⬜', color: 'text-slate-400', label: 'Draft' },
    review: { emoji: '🧪', color: 'text-yellow-400', label: 'Needs Review' }
};

const LensDetail: React.FC<{ lens: Lens; content: string }> = ({ lens, content }) => (
  <div className={`p-3 border-l-4 ${lens.color}`}>
    <h4 className="font-semibold text-sm text-slate-300 flex items-center gap-2">
      <span>{lens.emoji}</span>
      <span>{lens.name}</span>
    </h4>
    <p className="text-slate-400 text-sm mt-1" dangerouslySetInnerHTML={{ __html: content }}></p>
  </div>
);

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, lenses, activeFilter, onOpenFocusMode, isDimmed }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusInfo = STATUS_STYLES[chapter.status];
  const synthesisLens = lenses.find(l => l.id === 'synthesis')!;
  
  const cardClasses = `
    bg-slate-800/50 rounded-lg shadow-lg ring-1 ring-slate-700/50 flex flex-col 
    transition-all duration-300 hover:ring-cyan-500/50 hover:shadow-cyan-500/10
    ${isDimmed ? 'opacity-40 hover:opacity-100 focus-within:opacity-100' : ''}
  `;

  return (
    <div className={cardClasses}>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-grow cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <p className={`text-xs font-bold flex items-center gap-1.5 ${statusInfo.color}`}>
                <span>{statusInfo.emoji}</span>
                <span>{statusInfo.label}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Chapter {chapter.chapter}</p>
            <h3 className="font-bold text-lg text-slate-100 mt-0.5">{chapter.title}</h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
             <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFocusMode();
              }}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Focus Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700">
                <span className={`transform transition-transform duration-300 block ${isExpanded ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
            </button>
          </div>
        </div>

        <RevisionFlags flags={chapter.revisionFlags} />

         {activeFilter === 'all' && (
          <div className="mt-3 border-l-4 border-slate-500 pl-3">
             <p className="text-slate-400 text-sm italic">
              {chapter.synthesis}
             </p>
          </div>
         )}
         {activeFilter !== 'all' && (
            <div className="mt-3">
                <LensDetail lens={lenses.find(l => l.id === activeFilter)!} content={chapter.lenses[activeFilter]} />
            </div>
         )}
      </div>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="border-t border-slate-700/50 p-4 space-y-4">
          {lenses.filter(l => l.id !== 'synthesis').map(lens => (
             <LensDetail key={lens.id} lens={lens} content={chapter.lenses[lens.id as LensKey]} />
          ))}
          <LensDetail lens={synthesisLens} content={chapter.synthesis} />
        </div>
      </div>
    </div>
  );
};