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
  <nav className="navbar">
  <a href="/" className="brand">Library</a>
  <div className="nav-links">
    <a href="/books">Books</a>
    <a href="/dashboard">Dashboard</a>
    {user && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
  </div>
</nav>
  );
}
