import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/api/v1/books').then((res) => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.title} — {b.author}</li>
        ))}
      </ul>
    </div>
  );
}
