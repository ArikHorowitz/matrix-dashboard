import React from 'react';

export const ProgressBar = ({ value }: { value: number }) => (
  <div className="bg-slate-700 h-2 rounded-full w-full overflow-hidden">
    <div
      className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    />
  </div>
);
