import React from 'react';
import { WORK_LOGS } from '../data/WORK_LOG';

export const WorkLogConsole: React.FC = () => {
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg ring-1 ring-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-1">Project Work Log</h3>
            <p className="text-sm text-slate-400 mb-4">Tactical notes and high-level todos for the project.</p>
            <ul className="space-y-2.5">
                {WORK_LOGS.map((log, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <svg className="flex-shrink-0 mt-1 text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        <span className="text-slate-300 text-sm">{log}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};