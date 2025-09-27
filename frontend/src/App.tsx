import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Books from './pages/Books.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/books" element={<Books />} />
    </Routes>
  );
}
