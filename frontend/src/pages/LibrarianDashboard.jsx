import { useEffect, useState } from 'react';
import api from '../api/client';

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({});
  const [overdueMembers, setOverdueMembers] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/api/v1/dashboard'); // returns total_books, borrowed_books, due_today, overdue_members
        setStats(res.data);
        setOverdueMembers(res.data.overdue_members || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Librarian Dashboard</h1>
      <ul>
        <li>Total books: {stats.total_books}</li>
        <li>Borrowed books: {stats.total_borrowed}</li>
        <li>Books due today: {stats.due_today}</li>
      </ul>

      <h2>Members with overdue books</h2>
      <ul>
        {overdueMembers.length ? overdueMembers.map(m => (
          <li key={m.id}>{m.name} — {m.overdue_count} overdue</li>
        )) : <li>No overdue members 🎉</li>}
      </ul>
    </div>
  );
}
