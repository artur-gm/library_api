import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Books from './pages/Books.jsx';
import CreateBook from './pages/CreateBook.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EditBook from './pages/EditBook.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/books" element={<Books />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/books/new"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <CreateBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id/edit/"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <EditBook />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
