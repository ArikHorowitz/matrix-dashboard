import React, { useMemo } from 'react';
import type { PartData, GoldenThreadFilter } from '../types';
import { MOTIFS } from '../data/MOTIFS';

interface MotifTrackerProps {
  parts: PartData[];
  onSetGoldenThread: (filter: GoldenThreadFilter) => void;
}

export const MotifTracker: React.FC<MotifTrackerProps> = ({ parts, onSetGoldenThread }) => {
    
    const motifCounts = useMemo(() => {
        const allChapters = parts.flatMap(p => p.chapters);
        const counts = MOTIFS.map(motif => {
            const regex = new RegExp(motif.keywords.join('|'), 'i');
            const count = allChapters.reduce((acc, chapter) => {
                const searchableText = [
                    chapter.synthesis,
                    chapter.title,
                    ...Object.values(chapter.lenses)
                ].join(' ');
                
                if (regex.test(searchableText)) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            return { name: motif.name, count };
        }).sort((a,b) => b.count - a.count);
        return counts;
    }, [parts]);

    const maxCount = Math.max(...motifCounts.map(m => m.count), 1);

    const handleMotifClick = (motifName: string) => {
        onSetGoldenThread({ type: 'motif', id: motifName });
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg ring-1 ring-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-1">Global Motif Tracker</h3>
            <p className="text-sm text-slate-400 mb-4">Frequency of key motifs. Click a motif to trace its thread.</p>
             <div className="space-y-1">
                {motifCounts.map(motif => (
                    <button 
                        key={motif.name} 
                        className="grid grid-cols-10 items-center gap-3 text-sm w-full text-left p-1 rounded-md hover:bg-slate-700/50 transition-colors duration-200"
                        title={`Trace "${motif.name}" thread: ${motif.count} chapters`}
                        onClick={() => handleMotifClick(motif.name)}
                    >
                        <div className="col-span-4 flex items-center gap-2 text-slate-300 truncate">
                            <span className="truncate">{motif.name}</span>
                        </div>
                        <div className="col-span-5">
                             <div className="bg-slate-700 h-2.5 rounded-full w-full overflow-hidden">
                                <div
                                className="bg-gradient-to-r from-rose-600 to-rose-400 h-2.5 rounded-full"
                                style={{ width: `${(motif.count / maxCount) * 100}%` }}
                                />
                            </div>
                        </div>
                        <span className="col-span-1 font-mono text-slate-300 text-sm w-8 text-right">{motif.count}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};