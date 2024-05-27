"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'redaxios';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    honeyPot: ''  // Hidden input to prevent bot submissions
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If honeyPot has a value, do not proceed
    if (formData.honeyPot) {
      setError('Invalid form submission');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
    
      if (response.status === 200) {
        // Handle successful login (e.g., redirect to the root)
        setLoading(false);
        router.push('/');
      } else {
        setError('Login failed. Please try again.');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    }    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-4 border border-gray-700 rounded-lg bg-gray-800">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your Email'
              className="px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your Password'
              className="px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <input
            type="text"
            id="honeyPot"
            name="honeyPot"
            value={formData.honeyPot}
            onChange={handleChange}
            className="hidden"
          />
          {loading ? <p className="text-center text-green-500">Loading...</p> :
            <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>}
        </form>
        <p className="text-center">
          {"Don't have an account?"} <Link href="/auth/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
