import { useEffect, useState } from 'react';

export default function Home() {
  const [chapters, setChapters] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [content, setContent] = useState({});
  useEffect(() => {
    fetch('http://localhost:5001/api/chapters')
      .then(res => res.json())
      .then(data => setChapters(data.chapters || []));
  }, []);

  const toggle = (chapter) => {
  const isOpen = expanded[chapter];
  setExpanded(prev => ({ ...prev, [chapter]: !isOpen }));

  if (!isOpen && !content[chapter]) {
    fetch(`http://localhost:5001/api/chapters/${chapter}`)
      .then(res => res.json())
      .then(data => {
        setContent(prev => ({ ...prev, [chapter]: data.content || '[Empty]' }));
      })
      .catch(() => {
        setContent(prev => ({ ...prev, [chapter]: '[Error loading content]' }));
      });
  }
};
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: 300, borderRight: '1px solid #ccc', padding: 16 }}>
        <h2>Chapters</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chapters.map(chapter => (
            <li key={chapter} style={{ marginBottom: 8 }}>
              <button
                onClick={() => toggle(chapter)}
                style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#0070f3' }}
              >
                {expanded[chapter] ? '▼' : '▶'} {chapter}
              </button>
          {expanded[chapter] && (
  <div style={{ paddingLeft: 20, marginTop: 4, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
    {content[chapter] || '[Loading...]'}
  </div>
)}
  </li>
          ))}
        </ul>
      </nav>
      <main style={{ flexGrow: 1, padding: 24 }}>
        <h1>Matrix Dashboard</h1>
        <p>Select a chapter from the sidebar to view its content here.</p>
      </main>
    </div>
  );
}
// redeploy trigger
