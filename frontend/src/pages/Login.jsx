import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/sign_in', { user: { email, password }});
      const token = res.headers['authorization'] || res.data.token;
      const userData = res.data.user;

      login(userData, token);

      if (userData.role === 'librarian') navigate('/dashboard/librarian');
      else navigate('/dashboard/member');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '2rem' }}>
      <h1>Login</h1>
      <div>
        <label>Email:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
