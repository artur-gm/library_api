import React, { useState, useContext } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateBook = () => {
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    total_copies: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // While AuthContext is still loading localStorage
  if (loading) {
    return <p>Loading…</p>;
  }

  // If not logged in or not librarian
  if (!user || user.role !== 'librarian') {
    return <p>You are not authorized to create books.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post(
        '/api/v1/books',
        { book: form },
        {
          headers: {
            Authorization: token
          }
        }
      );
      navigate('/books'); // go back to books list
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(', ') || 'Error creating book'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-form-container">
      <h2>Create New Book</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        </div>
        <div className="form-group">
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        </div>
        <div className="form-group">
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          required
        />
        </div>
        <div className="form-group">
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
        />
        </div>
        <div className="form-group">
        <input
          type="number"
          name="total_copies"
          placeholder="Total Copies"
          value={form.total_copies}
          onChange={handleChange}
          required
        />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Book'}
        </button>
      </form>
    </div>
  );
};

export default CreateBook;
