import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Chapter, PartData, Lens, LensKey, ChapterStatus } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapter: Chapter) => void;
  onSelectPart: (partId: number) => void;
  onSelectFilter: (filter: LensKey | 'all') => void;
  onSelectStatusFilter: (status: ChapterStatus | 'all') => void;
  parts: PartData[];
  lenses: Lens[];
}

const STATUS_OPTIONS: { id: ChapterStatus | 'all', label: string, emoji: string }[] = [
    { id: 'all', label: 'Filter: All Statuses', emoji: '📂' },
    { id: 'review', label: 'Filter: Needs Review', emoji: '🧪' },
    { id: 'draft', label: 'Filter: Draft', emoji: '⬜' },
    { id: 'final', label: 'Filter: Final', emoji: '✅' },
];

type Command = 
    | { type: 'chapter', data: Chapter, title: string }
    | { type: 'part', data: PartData, title: string }
    | { type: 'lens_filter', data: Lens, title: string }
    | { type: 'status_filter', data: typeof STATUS_OPTIONS[0], title: string };

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
  onSelectPart,
  onSelectFilter,
  onSelectStatusFilter,
  parts,
  lenses,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allCommands: Command[] = useMemo(() => {
    const chapterCommands: Command[] = parts.flatMap(part => 
      part.chapters.map(chapter => ({
        type: 'chapter',
        data: chapter,
        title: `P${part.id} Ch.${chapter.chapter}: ${chapter.title}`
      }))
    );
    const partCommands: Command[] = parts.map(part => ({
      type: 'part',
      data: part,
      title: `Go to Part ${part.id}: ${part.title}`
    }));
    const lensCommands: Command[] = [
        { id: 'all', name: 'All Lenses', emoji: '📚', color: ''},
        ...lenses.filter(l => l.id !== 'synthesis')
    ].map(lens => ({
      type: 'lens_filter',
      data: lens as Lens,
      title: `${lens.emoji} Filter: ${lens.name}`
    }));
    const statusCommands: Command[] = STATUS_OPTIONS.map(status => ({
        type: 'status_filter',
        data: status,
        title: `${status.emoji} ${status.label}`
    }));

    return [...chapterCommands, ...partCommands, ...lensCommands, ...statusCommands];
  }, [parts, lenses]);

  const filteredResults = useMemo(() => {
    if (!searchTerm) {
      return allCommands.filter(c => c.type === 'chapter' || c.type === 'part');
    }
    return allCommands.filter(command =>
      command.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allCommands]);
  
  // Reset search on close
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);
  
  // Scroll into view
  useEffect(() => {
    listRef.current?.children[selectedIndex]?.scrollIntoView({
        block: 'nearest'
    });
  }, [selectedIndex]);

  const handleSelect = (command: Command) => {
    switch (command.type) {
      case 'chapter':
        onSelectChapter(command.data);
        break;
      case 'part':
        onSelectPart(command.data.id);
        break;
      case 'lens_filter':
        onSelectFilter(command.data.id as LensKey | 'all');
        break;
      case 'status_filter':
        onSelectStatusFilter(command.data.id as ChapterStatus | 'all');
        break;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex justify-center pt-[15vh]" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-slate-800 ring-1 ring-slate-700 rounded-lg shadow-2xl flex flex-col mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
            <svg className="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setSelectedIndex(0); }}
                placeholder="Search chapters, parts, or filters..."
                className="w-full bg-transparent text-slate-200 text-lg focus:outline-none placeholder-slate-500"
            />
        </div>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                    <li key={result.title}>
                        <button
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left p-3 rounded-md flex items-center gap-4 transition-colors duration-150 ${
                                index === selectedIndex ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                        >
                            <span className="text-slate-500">{result.type === 'chapter' ? '📄' : result.type === 'part' ? '🗂️' : '⚙️'}</span>
                            <span className="flex-grow">{result.title}</span>
                        </button>
                    </li>
                ))
            ) : (
                <li className="p-6 text-center text-slate-500">No results found.</li>
            )}
        </ul>
      </div>
    </div>
  );
};