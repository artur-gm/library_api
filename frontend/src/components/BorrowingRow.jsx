import api from '../api/client';

export default function BorrowingRow({ borrowing, onReturned }) {
  const handleReturn = async () => {
    try {
      await api.post(`/api/v1/borrowings/${borrowing.id}/return`);
      onReturned(borrowing.id);
    } catch (err) {
      console.error(err);
      alert('Could not return book');
    }
  };

  const isOverdue =
    new Date(borrowing.due_at) < new Date() && !borrowing.returned_at;

  const status = borrowing.returned_at
    ? { label: 'Returned', className: 'badge returned' }
    : isOverdue
    ? { label: 'Overdue', className: 'badge overdue' }
    : { label: 'Due', className: 'badge due' };

  return (
    <tr>
      <td>{borrowing.user?.name || borrowing.member_name}</td>
      <td>{borrowing.book?.title || borrowing.book_title}</td>
      <td>{new Date(borrowing.borrowed_at).toLocaleDateString()}</td>
      <td>{new Date(borrowing.due_at).toLocaleDateString()}</td>
      <td>
        <span className={status.className}>{status.label}</span>
      </td>
      <td>
        {!borrowing.returned_at && (
          <button onClick={handleReturn}>Return</button>
        )}
      </td>
    </tr>
  );
}
