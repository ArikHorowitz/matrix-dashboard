import React from 'react';
import type { Chapter, Lens, LensKey } from '../types';

interface LensHeatmapProps {
  chapters: Chapter[];
  lenses: Lens[];
}

export const LensHeatmap: React.FC<LensHeatmapProps> = ({ chapters, lenses }) => {
    const thematicLenses = lenses.filter(l => l.id !== 'synthesis' && l.id !== 'all');

    const lensCounts = thematicLenses.map(lens => {
        const count = chapters.reduce((acc, chapter) => {
            const content = chapter.lenses[lens.id as LensKey];
            return acc + (content && content.trim() !== '' && content.trim().toLowerCase() !== 'n/a' ? 1 : 0);
        }, 0);
        return { ...lens, count };
    });

    const maxCount = Math.max(...lensCounts.map(l => l.count), 1);

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg ring-1 ring-slate-700/50">
            <h3 className="text-md font-semibold text-slate-300 mb-4">Part Lens Balance</h3>
            <div className="space-y-3">
                {lensCounts.map(lens => (
                    <div key={lens.id} className="grid grid-cols-5 items-center gap-3 text-sm" title={`${lens.name}: ${lens.count} chapters`}>
                        <div className="col-span-2 flex items-center gap-2 text-slate-400 truncate">
                            <span>{lens.emoji}</span>
                            <span className="hidden sm:inline truncate">{lens.name}</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                             <div className="bg-slate-700 h-5 rounded w-full overflow-hidden">
                                <div
                                className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-5 rounded transition-all duration-500"
                                style={{ width: `${(lens.count / maxCount) * 100}%` }}
                                />
                            </div>
                            <span className="font-mono text-slate-300 text-xs w-6 text-right">{lens.count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
