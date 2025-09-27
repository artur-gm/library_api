import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Books from './pages/Books.jsx';
import MemberDashboard from './pages/MemberDashboard.jsx';
import LibrarianDashboard from './pages/LibrarianDashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/books" element={<Books />} />
      <Route path="/dashboard/member" element={<MemberDashboard />} />
      <Route path="/dashboard/librarian" element={<LibrarianDashboard />} />
    </Routes>
  );
}
