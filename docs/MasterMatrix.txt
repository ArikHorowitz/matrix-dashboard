import React from 'react';
import type { PartData, Lens, GoldenThreadFilter } from '../types';
import { ProgressBar } from './ProgressBar';
import { GlobalLensHeatmap } from './GlobalLensHeatmap';
import { MotifTracker } from './MotifTracker';
import { WorkLogConsole } from './WorkLogConsole';

interface MasterMatrixProps {
  parts: PartData[];
  lenses: Lens[];
  onSelectPart: (partId: number) => void;
  onSetGoldenThread: (filter: GoldenThreadFilter) => void;
}

const getPartStatus = (part: PartData): { text: string, emoji: string } => {
    if (!part.chapters || part.chapters.length === 0) return { text: 'Outlined', emoji: '🗒️' };
    const total = part.chapters.length;
    const finalCount = part.chapters.filter(c => c.status === 'final').length;

    if (finalCount === total) return { text: 'Complete', emoji: '✅' };
    if (finalCount > 0) return { text: 'In Progress', emoji: '▶️' };
    return { text: 'Drafting', emoji: '⬜' };
}

const getLensDensity = (part: PartData, lenses: Lens[]): string => {
    if (!part.chapters || part.chapters.length === 0) return 'N/A';
    
    const lensCounts: Record<string, number> = {};
    const thematicLenses = lenses.filter(l => l.id !== 'all' && l.id !== 'synthesis');

    for (const lens of thematicLenses) {
        lensCounts[lens.name] = 0;
    }

    for (const chapter of part.chapters) {
        for (const lens of thematicLenses) {
            const content = chapter.lenses[lens.id as keyof typeof chapter.lenses];
            if (content && content.trim() !== '' && content.trim().toLowerCase() !== 'n/a') {
                lensCounts[lens.name]++;
            }
        }
    }

    const topLenses = Object.entries(lensCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .filter(entry => entry[1] > 0)
        .map(entry => entry[0]);

    return topLenses.length > 0 ? topLenses.join(' / ') : 'None';
}

export const MasterMatrix: React.FC<MasterMatrixProps> = ({ parts, lenses, onSelectPart, onSetGoldenThread }) => {
  return (
    <div className="p-4 sm:p-6 space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-1">Master Matrix</h2>
        <p className="text-slate-400">High-level overview of the entire project structure.</p>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-slate-700">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-300 sm:pl-0">Part</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300">Progress</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300">Chapters</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300">Lens Density</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Go to Matrix</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {parts.map((part) => {
                    const progress = part.chapters.length > 0 ? (part.chapters.filter(c => c.status === 'final').length / part.chapters.length) * 100 : 0;
                    const status = getPartStatus(part);
                    const density = getLensDensity(part, lenses);

                    return (
                        <tr 
                            key={part.id} 
                            className="hover:bg-slate-800/50 cursor-pointer transition-colors duration-200"
                            onClick={() => onSelectPart(part.id)}
                            role="link"
                            aria-label={`View details for Part ${part.id}: ${part.title}`}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectPart(part.id);
                                }
                            }}
                        >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-100 sm:pl-0">{part.id}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{part.title}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400"><span className="flex items-center gap-2">{status.emoji} <span>{status.text}</span></span></td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                                <ProgressBar value={progress} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400 text-center">{part.chapters.length}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{density}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <div className="text-cyan-400 p-1" aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </div>
                            </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <GlobalLensHeatmap parts={parts} lenses={lenses} onSetGoldenThread={onSetGoldenThread} />
        <MotifTracker parts={parts} onSetGoldenThread={onSetGoldenThread} />
      </div>

      <WorkLogConsole />

    </div>
  );
};