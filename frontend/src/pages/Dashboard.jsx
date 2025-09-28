import { useEffect, useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [records, setRecords] = useState([]); // borrowed books or overdue members

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/v1/dashboard');
      if (user?.role === 'librarian') {
        setStats(res.data);
        setRecords(res.data.overdue_members || []);
      } else {
        setStats({ total_borrowed: res.data.borrowed.length, overdue: res.data.overdue.length });
        setRecords(res.data.borrowed || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const isOverdue = (record) => user.role === 'member' && new Date(record.due_at) < new Date() && !record.returned_at;

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

      <h2>{user?.role === 'librarian' ? 'Members with Overdue Books' : 'My Borrowed Books'}</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            {user?.role === 'librarian' ? (
              <>
                <th>Member</th>
                <th>Book</th>
                <th>Due Date</th>
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
          {records.map((r) =>
            user.role === 'librarian' ? (
              <tr key={r.id}>
                <td>{r.member_name}</td>
                <td>{r.book_title}</td>
                <td>{new Date(r.due_at).toLocaleDateString()}</td>
              </tr>
            ) : (
              <tr key={r.id} className={isOverdue(r) ? 'overdue' : ''}>
                <td>{r.book?.title}</td>
                <td>{new Date(r.borrowed_at).toLocaleDateString()}</td>
                <td>{new Date(r.due_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${isOverdue(r) ? 'overdue' : 'due'}`}>
                    {isOverdue(r) ? 'Overdue' : 'Due'}
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
