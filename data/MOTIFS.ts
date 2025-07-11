export interface Motif {
  name: string;
  keywords: string[];
}

export const MOTIFS: Motif[] = [
  { name: 'Myth', keywords: ['myth', 'sacred', 'story', 'narrative', 'song', 'hasbara', 'euphemism'] },
  { name: 'Obedience', keywords: ['obedience', 'uniform', 'surrender', 'ritual', 'disciplines', 'duty', 'indoctrination'] },
  { name: 'Volition', keywords: ['volition', 'choice', 'agency', 'act', 'author', 'sovereign', 'authorship'] },
  { name: 'Coercion', keywords: ['coercion', 'force', 'violence', 'knives', 'war', 'power', 'control'] },
  { name: 'Rupture', keywords: ['rupture', 'dissonance', 'wound', 'crashes', 'break', 'trauma', 'pain'] },
  { name: 'Liberation', keywords: ['liberation', 'free', 'awakening', 'clarity', 'recovery', 'decentralization'] },
];
