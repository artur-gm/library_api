import { useEffect, useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';
import { ErrorContext } from '../context/ErrorContext.jsx';
import { handleApiError } from '../utils/errorHandler.js';
import { useNavigate } from 'react-router-dom';

export default function Books() {
  const { showError } = useContext(ErrorContext);
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    availableOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const booksRes = await api.get('/api/v1/books');
      setBooks(booksRes.data);

      if (user?.role === 'member') {
        const borrowingsRes = await api.get('/api/v1/dashboard/');
        setBorrowings(borrowingsRes.data.borrowed || []);
      }
    } catch (err) {
      handleApiError(err, showError);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  const getBorrowing = (bookId) =>
    borrowings.find((b) => b.book_id === bookId && !b.returned_at);

  const isOverdue = (book) => {
    const borrowing = getBorrowing(book.id);
    return borrowing ? new Date(borrowing.due_at) < new Date() : false;
  };

  const hasBorrowed = (book) => !!getBorrowing(book.id);

  const handleBorrow = async (bookId) => {
    try {
      await api.post(`/api/v1/borrowings`, { book_id: bookId });
      fetchBooks();
    } catch (err) {
      handleApiError(err, showError)
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      await api.post(`/api/v1/borrowings/${borrowingId}/return`);
      fetchBooks();
    } catch (err) {
      handleApiError(err, showError)
    }
  };

  const handleEdit = (book) => {
    navigate(`/books/${book.id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/api/v1/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      handleApiError(err, showError)
      alert('Failed to delete book');
    }
  };

  const filteredBooks = books.filter((book) => {
    if (
      !book.title.toLowerCase().includes(filters.title.toLowerCase()) ||
      !book.author.toLowerCase().includes(filters.author.toLowerCase()) ||
      !book.genre.toLowerCase().includes(filters.genre.toLowerCase()) ||
      !book.isbn.toLowerCase().includes(filters.isbn.toLowerCase())
    ) {
      return false;
    }
    if (filters.availableOnly && book.available_copies === 0) return false;
    return true;
  });

  return (
    <div className="page-container">
      <h1>Books</h1>

      {/* Filter toggle */}
      <button
        className="filter-toggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="filter-row">
          <input
            className="filter-input"
            placeholder="Filter by Title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
          <input
            className="filter-input"
            placeholder="Filter by Author"
            value={filters.author}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          />
          <input
            className="filter-input"
            placeholder="Filter by Genre"
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          />
          <input
            className="filter-input"
            placeholder="Filter by ISBN"
            value={filters.isbn}
            onChange={(e) => setFilters({ ...filters, isbn: e.target.value })}
          />
          <label className="available-filter">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
            />
            Available Only
          </label>
        </div>
      )}

      <ul className="book-list">
        {filteredBooks.map((book) => (
          <li key={book.id} className={user?.role === 'member' && isOverdue(book) ? 'overdue' : ''}>
            <div>
              <strong>{book.title}</strong> — {book.author} ({book.genre}) [Copies: {book.available_copies}/{book.total_copies}]
              {user?.role === 'member' && hasBorrowed(book) && isOverdue(book) && (
                <span className="badge overdue" style={{ marginLeft: '0.5rem' }}>
                  Overdue
                </span>
              )}
            </div>
            <div>
              {user?.role === 'member' && !hasBorrowed(book) && book.available_copies > 0 && (
                <button className="borrow" onClick={() => handleBorrow(book.id)}>Borrow</button>
              )}
              {user?.role === 'member' && hasBorrowed(book) && (
                <button className="return" onClick={() => handleReturn(getBorrowing(book.id).id)}>Return</button>
              )}
              {user?.role === 'librarian' && (
                <>
                  <button className="edit" onClick={() => handleEdit(book)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
