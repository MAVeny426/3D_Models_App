import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(responseData.msg || 'Registration successful!');
        console.log('Signup successful:', responseData);

        // --- START: Added localStorage storage for user data ---
        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
        }
        if (responseData.user && responseData.user.name) {
          localStorage.setItem('userName', responseData.user.name);
        }
        if (responseData.user && responseData.user.email) {
          localStorage.setItem('userEmail', responseData.user.email);
        }
        // It's good practice to store the whole user object as a string if it's complex
        if (responseData.user) {
          localStorage.setItem('user', JSON.stringify(responseData.user));
        }
        // --- END: Added localStorage storage for user data ---


        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          navigate('/'); // Navigates to the home page after successful signup
        }, 1500);

      } else {
        setError(responseData.msg || 'Registration failed. Please try again.');
        console.error('Signup error:', responseData);
      }

    } catch (err) {
      console.error('Signup network error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-left">Hello!</h2>
          <p className="text-gray-600 mb-6 text-left">Please signup to continue</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your Full Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-Enter your password"
                required
              />
            </div>
            {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <div className="flex flex-col items-center">
              <button
                type='submit'
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
              <div className="flex space-x-4 mb-6">
              </div>
              <p className="text-gray-600 text-sm">
                I'm already a member?
                <Link to="/login" className="font-bold text-blue-500 hover:text-blue-800 ml-1">Sign In</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden md:flex w-1/2 bg-[#B7D7B1] items-center justify-center p-8 flex-col text-white text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.8-7-7.93 0-.62.08-1.22.21-1.79l5.19 5.19V19zm2 0V14.17l5.19-5.19c.13.57.21 1.17.21 1.79 0 4.13-3.05 7.44-7 7.93zM4.21 10.04C4.08 9.47 4 8.87 4 8.25c0-3.31 2.69-6 6-6s6 2.69 6 6c0 .62-.08 1.22-.21 1.79L12 14.17 4.21 10.04z"/>
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-4">Glyph3D</h3>
        </div>
      </div>
    </div>
  );
};

export default Signup;
