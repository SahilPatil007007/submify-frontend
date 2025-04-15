// src/pages/Signup.jsx
import { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ email: '', name: '', id: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Signup failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
        <InputField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
        <InputField label="ID" name="id" value={form.id} onChange={handleChange} />
        <InputField label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
        <button className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
    </div>
  );
};

export default Signup;
