import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ErrorContext } from '../context/ErrorContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useContext(ErrorContext);
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    total_copies: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/v1/books/${id}`);
        setBook(res.data);
      } catch (err) {
        handleApiError(err, showError)
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/v1/books/${id}`, { book });
      navigate('/books');
    } catch (err) {
      handleApiError(err, showError)
      alert('Could not update book');
    }
  };

  if (loading) return <p>Loading book…</p>;

  return (
    <div className="book-form-container">
      <h1>Edit Book</h1>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={book.title}
            onChange={handleChange}
            placeholder="Title"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            name="author"
            value={book.author}
            onChange={handleChange}
            placeholder="Author"
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <input
            name="genre"
            value={book.genre}
            onChange={handleChange}
            placeholder="Genre"
          />
        </div>

        <div className="form-group">
          <label>ISBN</label>
          <input
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            placeholder="ISBN"
          />
        </div>

        <div className="form-group">
          <label>Total Copies</label>
          <input
            type="number"
            name="total_copies"
            value={book.total_copies}
            onChange={handleChange}
            placeholder="Total Copies"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/books')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
