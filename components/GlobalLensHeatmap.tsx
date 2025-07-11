import React from 'react';
import type { PartData, Lens, LensKey, GoldenThreadFilter } from '../types';

interface GlobalLensHeatmapProps {
  parts: PartData[];
  lenses: Lens[];
  onSetGoldenThread: (filter: GoldenThreadFilter) => void;
}

export const GlobalLensHeatmap: React.FC<GlobalLensHeatmapProps> = ({ parts, lenses, onSetGoldenThread }) => {
    const thematicLenses = lenses.filter(l => l.id !== 'synthesis' && l.id !== 'all');
    const allChapters = parts.flatMap(p => p.chapters);

    const lensCounts = thematicLenses.map(lens => {
        const count = allChapters.reduce((acc, chapter) => {
            const content = chapter.lenses[lens.id as LensKey];
            return acc + (content && content.trim() !== '' && content.trim().toLowerCase() !== 'n/a' ? 1 : 0);
        }, 0);
        return { ...lens, count };
    }).sort((a,b) => b.count - a.count);

    const maxCount = Math.max(...lensCounts.map(l => l.count), 1);

    const handleLensClick = (lens: Lens) => {
        onSetGoldenThread({ type: 'lens', id: lens.id as LensKey, name: lens.name });
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg ring-1 ring-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-1">Global Lens Density</h3>
            <p className="text-sm text-slate-400 mb-4">Frequency of each thematic lens across all parts. Click a lens to trace its thread.</p>
            <div className="space-y-1">
                {lensCounts.map(lens => (
                     <button 
                        key={lens.id} 
                        className="grid grid-cols-10 items-center gap-3 text-sm w-full text-left p-1 rounded-md hover:bg-slate-700/50 transition-colors duration-200" 
                        title={`Trace "${lens.name}" thread: ${lens.count} chapters`}
                        onClick={() => handleLensClick(lens)}
                    >
                        <div className="col-span-4 flex items-center gap-2 text-slate-300 truncate">
                            <span>{lens.emoji}</span>
                            <span className="truncate">{lens.name}</span>
                        </div>
                        <div className="col-span-5">
                             <div className="bg-slate-700 h-2.5 rounded-full w-full overflow-hidden">
                                <div
                                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full"
                                style={{ width: `${(lens.count / maxCount) * 100}%` }}
                                />
                            </div>
                        </div>
                        <span className="col-span-1 font-mono text-slate-300 text-sm w-8 text-right">{lens.count}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};