import { useEffect, useState } from 'react';
import api from '../api/client';

export default function MemberDashboard() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  useEffect(() => {
    async function fetchBorrowed() {
      try {
        const res = await api.get('/api/v1/dashboard'); // returns borrowings for current member
        setBorrowedBooks(res.data.borrowed || []);
        setOverdueBooks(res.data.overdue || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBorrowed();
  }, []);

  return (
    <div>
      <h1>Member Dashboard</h1>
      <h2>Borrowed Books</h2>
      <ul>
        {borrowedBooks.map(b => (
          <li key={b.id}>
            {b.book.title} — Due: {new Date(b.due_at).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h2>Overdue Books</h2>
      <ul>
        {overdueBooks.length ? overdueBooks.map(b => (
          <li key={b.id}>
            {b.book.title} — Due: {new Date(b.due_at).toLocaleDateString()}
          </li>
        )) : <li>No overdue books 🎉</li>}
      </ul>
    </div>
  );
}
