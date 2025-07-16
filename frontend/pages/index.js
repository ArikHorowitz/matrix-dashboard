import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const [content, setContent] = useState('');
  const [selected, setSelected] = useState(null);

  const handleSelect = (chapter) => {
    setSelected(chapter);
    fetch(`http://localhost:5001/api/chapters/${chapter}`)
      .then(res => res.json())
      .then(data => setContent(data.content || '[Empty]'));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onSelect={handleSelect} selected={selected} />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Matrix Dashboard</h1>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
      </main>
    </div>
  );
}