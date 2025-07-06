// src/pages/Login.jsx
import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  SectionHeader, 
  AdminCard, 
  PrimaryButton 
} from '../components/AdminUI';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SectionHeader 
          title="Welcome Back" 
          subtitle="Sign in to your account"
          icon="🔐"
          className="text-center mb-8"
        />
        
        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              type="email" 
            />
            <InputField 
              label="Password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              type="password" 
            />
            <PrimaryButton type="submit" className="w-full">
              Sign In
            </PrimaryButton>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/signup')}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Register here
              </span>
            </p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default Login;
