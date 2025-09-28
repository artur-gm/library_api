import { useEffect, useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Books() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  // helper: get borrowing record for this book
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
      fetchBooks(); // refresh borrowings
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      await api.post(`/api/v1/borrowings/${borrowingId}/return`);
      fetchBooks(); // refresh borrowings
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (book) => {
      navigate(`/books/${book.id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/api/v1/books/${id}`);
      // remove from local state instead of refetching
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete book');
    }
  };

  return (
    <div className="page-container">
      <h1>Books</h1>

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className={user?.role === 'member' && isOverdue(book) ? 'overdue' : ''}>
            <div>
              <strong>{book.title}</strong> — {book.author} ({book.genre}) [Copies: {book.total_copies}]
              {user?.role === 'member' && hasBorrowed(book) && isOverdue(book) && (
                <span className="badge overdue" style={{ marginLeft: '0.5rem' }}>
                  Overdue
                </span>
              )}
            </div>
            <div>
              {user?.role === 'member' && !hasBorrowed(book) && (
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
