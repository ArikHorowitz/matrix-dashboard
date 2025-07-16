import { useEffect, useState } from 'react';

export default function Sidebar({ onSelect, selected }) {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/chapters')
      .then(res => res.json())
      .then(data => setChapters(data.chapters || []));
  }, []);

  return (
    <nav style={{ width: '250px', borderRight: '1px solid #ccc', padding: '1rem' }}>
      <h3>Chapters</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {chapters.map(ch => (
          <li key={ch}>
            <button
              style={{
                background: ch === selected ? '#eef' : 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                textAlign: 'left',
                width: '100%',
              }}
              onClick={() => onSelect(ch)}
            >
              {ch}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}