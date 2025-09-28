import { useEffect, useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';
import BorrowingRow from '../components/BorrowingRow.jsx';
import { ErrorContext } from '../context/ErrorContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useContext(ErrorContext);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/v1/dashboard');

      if (user?.role === 'librarian') {
        setStats(res.data);

        const borrowingsRes = await api.get('/api/v1/borrowings');
        setBorrowed(borrowingsRes.data);
      } else {
        setStats({
          total_borrowed: res.data.borrowed.length,
          overdue: res.data.overdue.length,
        });
        setBorrowed(res.data.borrowed || []);
      }
    } catch (err) {
      handleApiError(err, showError)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [user, token]);

  const handleReturned = (id) => {
    setBorrowed((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, returned_at: new Date().toISOString() } : b
      )
    );
  };

  const getStatus = (record) => {
    if (record.returned_at) {
      return { label: 'Returned', className: 'badge returned' };
    }
    if (new Date(record.due_at) < new Date()) {
      return { label: 'Overdue', className: 'badge overdue' };
    }
    return { label: 'Due', className: 'badge due' };
  };

  if (loading) return <p>Loading dashboard…</p>;

  return (
    <div className="page-container">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        {user?.role === 'librarian' ? (
          <>
            <div className="card">
              <h3>Total Books</h3>
              <p>{stats.total_books}</p>
            </div>
            <div className="card">
              <h3>Total Borrowed</h3>
              <p>{stats.total_borrowed}</p>
            </div>
            <div className="card">
              <h3>Books Due Today</h3>
              <p>{stats.due_today}</p>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <h3>Total Borrowed</h3>
              <p>{stats.total_borrowed}</p>
            </div>
            <div className="card">
              <h3>Overdue</h3>
              <p>{stats.overdue}</p>
            </div>
          </>
        )}
      </div>

      <h2>
        {user?.role === 'librarian' ? 'All Borrowed Books' : 'My Borrowed Books'}
      </h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            {user?.role === 'librarian' ? (
              <>
                <th>Member</th>
                <th>Book</th>
                <th>Borrowed At</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </>
            ) : (
              <>
                <th>Book</th>
                <th>Borrowed At</th>
                <th>Due Date</th>
                <th>Status</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {borrowed.map((b) => {
            if (user?.role === 'librarian') {
              return (
                <BorrowingRow
                  key={b.id}
                  borrowing={b}
                  onReturned={handleReturned}
                />
              );
            } else {
              const status = getStatus(b);
              return (
                <tr key={b.id} className={status.label.toLowerCase()}>
                  <td>{b.book?.title || b.title}</td>
                  <td>{new Date(b.borrowed_at).toLocaleDateString()}</td>
                  <td>{new Date(b.due_at).toLocaleDateString()}</td>
                  <td>
                    <span className={status.className}>{status.label}</span>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}
