// src/pages/Login.jsx
import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setAuthUser(res.data.user);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
        toast.error('Invalid credentials!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
        <InputField label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
        <button className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg hover:bg-green-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
    </div>
  );
};

export default Login;
