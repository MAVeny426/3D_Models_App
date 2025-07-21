import React, {useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';

const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const successMsg = responseData.msg || 'Login successful!';
        console.log('Login successful:', responseData);
        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
        }
        if (responseData.user) {
          localStorage.setItem('user', JSON.stringify(responseData.user));
          localStorage.setItem('userEmail', responseData.user.email);
        }
        setEmail('');
        setPassword('');

        navigate('/', { state: { loginSuccessMessage: successMsg } });

      } else {
        setError(responseData.msg || 'Login failed. Please check your credentials.');
        console.error('Login error:', responseData);
      }

    } catch (err) {
      console.error('Login network error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-left">Welcome Back!</h2>
          <p className="text-gray-600 mb-6 text-left">Please login to continue</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required/>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" required/>
            </div>
            {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <div className="flex flex-col items-center">
              <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <p className="text-gray-600 text-sm">
                Don't have an account?
                <Link to="/Signup" className="font-bold text-blue-500 hover:text-blue-800 ml-1">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden md:flex w-1/2 bg-[#B7D7B1] items-center justify-center p-8 flex-col text-white text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-4">Glyph3D</h3>
          <p className="text-lg mb-6">Access your dashboard to upload and manage models.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;