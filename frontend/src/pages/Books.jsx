import { useEffect, useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Books() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', isbn: '', total_copies: 1 });
  const [editing, setEditing] = useState(null);
  const [borrowings, setBorrowings] = useState([]);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await api.get('/api/v1/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch member's active borrowings
  const fetchBorrowings = async () => {
    if (user?.role === 'member') {
      try {
        const res = await api.get('/api/v1/borrowings');
        setBorrowings(res.data); // array of borrowings
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchBorrowings();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/api/v1/books/${editing.id}`, { book: form });
      else await api.post('/api/v1/books', { book: form });

      setForm({ title: '', author: '', genre: '', isbn: '', total_copies: 1 });
      setEditing(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Error saving book');
    }
  };

  const handleEdit = (book) => {
    setEditing(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      total_copies: book.total_copies,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/v1/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Error deleting book');
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post('/api/v1/borrowings', { book_id: bookId });
      fetchBorrowings();
      alert('Book borrowed!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error borrowing book');
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      await api.post(`/api/v1/borrowings/${borrowingId}/return`);
      fetchBorrowings();
      alert('Book returned!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error returning book');
    }
  };

  // Borrowed book IDs for easy lookup
  const borrowedBookIds = borrowings.map(b => b.book_id);

  // Helper: is a borrowed book overdue?
  const isOverdue = (bookId) => {
    const borrowing = borrowings.find(b => b.book_id === bookId);
    if (!borrowing) return false;
    return new Date(borrowing.due_at) < new Date();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Books</h1>

      {user?.role === 'librarian' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
          <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
          <input
            name="total_copies"
            type="number"
            placeholder="Total Copies"
            value={form.total_copies}
            onChange={handleChange}
            min="1"
          />
          <button type="submit">{editing ? 'Update Book' : 'Add Book'}</button>
        </form>
      )}

      <ul>
        {books.map((b) => (
          <li
            key={b.id}
            style={{
              marginBottom: '0.5rem',
              color: user?.role === 'member' && isOverdue(b.id) ? 'red' : 'inherit'
            }}
          >
            <strong>{b.title}</strong> — {b.author} ({b.genre}) [Copies: {b.total_copies}]

            {user?.role === 'librarian' && (
              <>
                <button onClick={() => handleEdit(b)} style={{ marginLeft: '1rem' }}>Edit</button>
                <button onClick={() => handleDelete(b.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
              </>
            )}

            {user?.role === 'member' && (
              <>
                {!borrowedBookIds.includes(b.id) && (
                  <button onClick={() => handleBorrow(b.id)} style={{ marginLeft: '1rem' }}>Borrow</button>
                )}
                {borrowedBookIds.includes(b.id) && (
                  <button
                    onClick={() => {
                      const borrowing = borrowings.find(br => br.book_id === b.id);
                      handleReturn(borrowing.id);
                    }}
                    style={{ marginLeft: '1rem' }}
                  >
                    Return
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
