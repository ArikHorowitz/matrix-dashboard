export type LensKey = 
  | 'institutionalLogic' 
  | 'narrativePower' 
  | 'psychologicalDynamics' 
  | 'humanAgency' 
  | 'informationControl' 
  | 'artisticPoetic' 
  | 'rhetoricalTone' 
  | 'philosophicalEpistemic';

export interface Lens {
  id: LensKey | 'all' | 'synthesis';
  name: string;
  emoji: string;
  color: string;
}

export type ChapterStatus = 'final' | 'draft' | 'review';

export interface RevisionFlag {
  type: string;
  emoji: string;
}

export interface Chapter {
  id: string;
  part: number;
  chapter: number;
  title: string;
  lenses: Record<LensKey, string>;
  synthesis: string;
  status: ChapterStatus;
  revisionFlags: RevisionFlag[];
  previewText: string;
}

export interface PartData {
  id: number;
  title: string;
  chapters: Chapter[];
}

export type GoldenThreadFilter = {
  type: 'lens';
  id: LensKey;
  name: string;
} | {
  type: 'motif';
  id: string; // This is the motif name
} | null;