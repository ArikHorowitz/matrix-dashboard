import React from 'react';
import type { RevisionFlag } from '../types';

interface RevisionFlagsProps {
  flags: RevisionFlag[];
}

export const RevisionFlags: React.FC<RevisionFlagsProps> = ({ flags }) => {
  if (!flags || flags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {flags.map((flag, index) => (
        <span key={index} className="px-2 py-0.5 text-xs font-medium bg-slate-700 text-slate-300 rounded-full flex items-center gap-1.5">
          <span>{flag.emoji}</span>
          <span>{flag.type}</span>
        </span>
      ))}
    </div>
  );
};
