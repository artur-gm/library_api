import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';
import { ErrorContext } from '../context/ErrorContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';

export default function AddLibrarian() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError } = useContext(ErrorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== 'librarian') {
      alert('Only librarians can create new librarians');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/librarians', {
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      alert('Librarian created successfully!');
      navigate('/dashboard');
    } catch (err) {
      handleApiError(err, showError)
      alert('Failed to create librarian');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Add Librarian</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter librarian's name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter librarian's email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Confirm password"
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating…' : 'Create Librarian'}
        </button>
      </form>
    </div>
  );
}
