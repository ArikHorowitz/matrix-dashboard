import React, { useState, useCallback, useEffect } from 'react';
import { PartMatrix } from './components/PartMatrix';
import { MasterMatrix } from './components/MasterMatrix';
import { FocusView } from './components/FocusView';
import { CommandPalette } from './components/CommandPalette';
import { MATRIX_DATA, LENSES } from './constants';
import type { Chapter, LensKey, ChapterStatus, GoldenThreadFilter, PartData } from './types';

type ViewState = { view: 'master' } | { view: 'part'; partId: number };

function App() {
  const [viewState, setViewState] = useState<ViewState>({ view: 'master' });
  
  const [activeFilter, setActiveFilter] = useState<LensKey | 'all'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<ChapterStatus | 'all'>('all');
  const [focusedChapter, setFocusedChapter] = useState<Chapter | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [goldenThreadFilter, setGoldenThreadFilter] = useState<GoldenThreadFilter>(null);

  const handleSelectPart = useCallback((partId: number) => {
    setViewState({ view: 'part', partId });
    setActiveFilter('all');
    setActiveStatusFilter('all');
    setGoldenThreadFilter(null);
  }, []);

  const handleReturnToMaster = useCallback(() => {
    setViewState({ view: 'master' });
    setGoldenThreadFilter(null);
  }, []);

  const handleSelectFilter = useCallback((filter: LensKey | 'all') => {
    setActiveFilter(filter);
    setGoldenThreadFilter(null);
  }, []);
  
  const handleSelectStatusFilter = useCallback((status: ChapterStatus | 'all') => {
    setActiveStatusFilter(status);
    setGoldenThreadFilter(null);
  }, []);

  const handleOpenFocusMode = useCallback((chapter: Chapter) => {
    setFocusedChapter(chapter);
  }, []);

  const handleCloseFocusMode = useCallback(() => {
    setFocusedChapter(null);
  }, []);
  
  const handleSetGoldenThread = useCallback((filter: GoldenThreadFilter) => {
      setGoldenThreadFilter(filter);
      if (filter) {
        // Jump to the first part containing the thread if in master view
        const firstPart = MATRIX_DATA.find(part =>
            part.chapters.some(ch => {
              if (filter.type === 'lens') {
                  const content = ch.lenses[filter.id];
                  return content && content.trim() !== '' && content.trim().toLowerCase() !== 'n/a';
              }
              // Basic motif check for navigation, detailed check happens in PartMatrix
              if (filter.type === 'motif') {
                  return JSON.stringify(ch).toLowerCase().includes(filter.id.toLowerCase());
              }
              return false;
            })
        );
        if (viewState.view === 'master' && firstPart) {
            handleSelectPart(firstPart.id);
        }
      }
  }, [viewState, handleSelectPart]);

  // Command Palette keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderContent = () => {
    if (viewState.view === 'master') {
      return (
        <MasterMatrix
          parts={MATRIX_DATA}
          lenses={LENSES}
          onSelectPart={handleSelectPart}
          onSetGoldenThread={handleSetGoldenThread}
        />
      );
    }

    const activePartData = MATRIX_DATA.find(p => p.id === viewState.partId);
    if (!activePartData) {
      return (
        <div className="p-8 text-center">
            <h2 className="text-xl text-red-400">Error: Part not found.</h2>
            <button onClick={handleReturnToMaster} className="mt-4 px-4 py-2 bg-cyan-500 text-slate-900 rounded-md">
                Return to Master Matrix
            </button>
        </div>
      );
    }

    const partProgress = (() => {
        if (!activePartData.chapters.length) return 0;
        const total = activePartData.chapters.length;
        const completed = activePartData.chapters.filter(c => c.status === 'final').length;
        return (completed / total) * 100;
    })();

    return (
      <PartMatrix
        parts={MATRIX_DATA}
        lenses={LENSES}
        activePart={activePartData}
        partProgress={partProgress}
        activeFilter={activeFilter}
        activeStatusFilter={activeStatusFilter}
        onSelectPart={handleSelectPart}
        onSelectFilter={handleSelectFilter}
        onSelectStatusFilter={handleSelectStatusFilter}
        onOpenFocusMode={handleOpenFocusMode}
        onBack={handleReturnToMaster}
        goldenThreadFilter={goldenThreadFilter}
        onSetGoldenThread={handleSetGoldenThread}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <header className="p-4 sm:p-6 border-b border-slate-700/50 bg-slate-900/70 backdrop-blur-sm sticky top-0 z-20 flex justify-between items-center">
        <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">The Matrix Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">A Praxeological Writing Environment</p>
        </div>
        <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Open Command Palette"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </header>
      
      <main>
        {renderContent()}
      </main>

      {focusedChapter && (
        <FocusView
          chapter={focusedChapter}
          lenses={LENSES}
          onClose={handleCloseFocusMode}
        />
      )}
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectChapter={(chapter) => {
            handleSelectPart(chapter.part);
            handleOpenFocusMode(chapter);
        }}
        onSelectPart={handleSelectPart}
        onSelectFilter={handleSelectFilter}
        onSelectStatusFilter={handleSelectStatusFilter}
        parts={MATRIX_DATA}
        lenses={LENSES}
      />
    </div>
  );
}

export default App;