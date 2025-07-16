import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Chapter, Lens, LensKey } from '../types';

interface FocusViewProps {
  chapter: Chapter;
  lenses: Lens[];
  onClose: () => void;
}

export const FocusView: React.FC<FocusViewProps> = ({ chapter, lenses, onClose }) => {
  const draftKey = `matrix-draft-${chapter.id}`;
  const [draft, setDraft] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setDraft(savedDraft);
    }
  }, [draftKey]);

  // Debounced save to localStorage
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(draftKey, draft);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [draft, draftKey]);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && !isPreview) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [draft, isPreview]);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft).then(() => {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }).catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col ring-1 ring-slate-700" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Focus: {chapter.title}</h2>
            <p className="text-sm text-slate-400">Part {chapter.part} / Chapter {chapter.chapter}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy} 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center gap-2" 
              aria-label="Copy Draft"
            >
              {justCopied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy Draft
                </>
              )}
            </button>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </header>
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel: Matrix Data */}
          <aside className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto p-4 border-b md:border-r md:border-b-0 border-slate-700">
             <div className="mb-6 p-3 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-sm text-cyan-400">Preview Text</h4>
                <p className="text-slate-300 text-sm mt-1">{chapter.previewText}</p>
            </div>
            <div className="space-y-4">
              {lenses.map(lens => {
                  const content = lens.id === 'synthesis' ? chapter.synthesis : chapter.lenses[lens.id as LensKey];
                  return (
                    <div key={lens.id}>
                      <h4 className="font-semibold text-sm text-slate-300 flex items-center gap-2">
                        <span>{lens.emoji}</span>
                        <span>{lens.name}</span>
                      </h4>
                      <p className="text-slate-400 text-sm mt-1 pl-2 border-l-2 border-slate-600" dangerouslySetInnerHTML={{ __html: content }}></p>
                    </div>
                  );
              })}
            </div>
          </aside>
          {/* Right Panel: Text Editor */}
          <main className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col">
            <div className="p-3 border-b border-slate-700 flex items-center gap-4 flex-shrink-0">
                <h3 className="font-semibold text-slate-200">Drafting Area</h3>
                <div className="flex items-center">
                    <span className={`text-sm font-medium transition-colors ${!isPreview ? 'text-cyan-400' : 'text-slate-400'}`}>Edit</span>
                    <button onClick={() => setIsPreview(!isPreview)} className={`mx-2 w-10 h-5 rounded-full flex items-center transition-colors ${isPreview ? 'bg-cyan-500 justify-end' : 'bg-slate-600 justify-start'}`} role="switch" aria-checked={isPreview}>
                        <span className="sr-only">Toggle Markdown Preview</span>
                        <span className="block w-4 h-4 m-0.5 bg-white rounded-full transform transition-transform"></span>
                    </button>
                    <span className={`text-sm font-medium transition-colors ${isPreview ? 'text-cyan-400' : 'text-slate-400'}`}>Preview</span>
                </div>
            </div>
             {isPreview ? (
                <div className="prose prose-invert prose-slate p-6 overflow-y-auto w-full flex-grow">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft || "Begin writing to see a preview..."}</ReactMarkdown>
                </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Begin drafting here... Markdown is supported."
                className="w-full flex-grow p-6 bg-slate-800 text-slate-200 text-lg leading-relaxed resize-none focus:outline-none placeholder-slate-500"
              ></textarea>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
