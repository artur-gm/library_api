import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
        </Link>
        {!loading && user && (
          <>
            <Link to="/books">Books</Link>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'librarian' && (
              <>
                <Link to="/librarians/new" className="nav-link">Add Librarian</Link>
                <Link to="/books/new">Add Book</Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="navbar-right">
        {loading ? (
          <span>Loading…</span>
        ) : user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="nav-button"> Login </Link>
            <Link to="/register" className="nav-button">Sign Up </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
