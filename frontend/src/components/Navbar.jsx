import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/books" style={{ marginRight: '1rem' }}>Books</Link>

      {user?.role === 'librarian' && (
        <Link to="/dashboard/librarian" style={{ marginRight: '1rem' }}>Dashboard</Link>
      )}

      {user?.role === 'member' && (
        <Link to="/dashboard/member" style={{ marginRight: '1rem' }}>Dashboard</Link>
      )}

      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/">Login</Link>
      )}
    </nav>
  );
}
