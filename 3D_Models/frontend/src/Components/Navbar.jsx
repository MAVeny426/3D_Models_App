import React, { useState, useEffect, useRef } from 'react';
import {Link,useNavigate,useLocation } from 'react-router-dom';

const Navbar = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,setUserName] = useState('');
  const [searchInputValue,setSearchInputValue] = useState(''); 
  const [isSearchAvailable,setIsSearchAvailable] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token&&storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.name || user.email);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        setIsLoggedIn(false);
        setUserName('');
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      const newStoredUser = localStorage.getItem('user');
      if (newToken && newStoredUser) {
        try {
            const user = JSON.parse(newStoredUser);
            setIsLoggedIn(true);
            setUserName(user.name || user.email);
        } catch (e) {
            setIsLoggedIn(false);
            setUserName('');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    window.addEventListener('storage',handleStorageChange);

    return () => {
      window.removeEventListener('storage',handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  const handleUploadClick = () => {
    if (isLoggedIn) {
      fileInputRef.current.click();
    } else {
      alert('Please log in to upload models.');
      navigate('/login');
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('Selected file:',selectedFile);
      if (selectedFile.name.endsWith('.glb')) {
        alert(`GLB file selected:${selectedFile.name}`);
      } else {
        alert('Please select a .glb file.');
      }
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchInputValue.trim()) {
      navigate('/Albums',{state:{searchTerm:searchInputValue.trim()}});
    } else {
      navigate('/Albums'); 
    }
  };

  const baseLinkClasses ="text-gray-600 font-medium hidden sm:block whitespace-nowrap py-2 px-3 relative transition-all duration-300 hover:bg-gray-100 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-200 border-b-4 border-transparent hover:border-blue-500";

  return (
    <div className="bg-white shadow-md z-50 relative">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-blue-500 font-bold text-2xl hover:text-blue-600 flex items-center space-x-2">
            <span className="text-gray-800">Glymph 3D Models</span>
        </Link>

        {isSearchAvailable && (
          <div className="flex-grow mx-4 max-w-xl hidden md:block">
            <div className="relative">
              <input type="text" placeholder="Search 3D models..." className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900" value={searchInputValue} onChange={handleSearchInputChange} onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}/>
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={handleSearchSubmit}
                className="absolute right-0 top-0 h-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out font-semibold flex items-center justify-center">
                Search
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
            <Link to="/" className={baseLinkClasses}>
                Home
            </Link>
            <Link to="/Albums" className={baseLinkClasses}>
                Albums
            </Link>
            <Link to="/ContactUs" className={baseLinkClasses}>
                Contact Us
            </Link>
            <Link to="/AboutUs" className={baseLinkClasses}>
                About Us
            </Link>
            {isLoggedIn && (
                <>
                    <Link to="/Upload" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200 ease-in-out flex items-center space-x-2 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>UPLOAD</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out font-semibold flex items-center space-x-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>

                    <Link to="/Profile" className="text-gray-700 hover:text-blue-600 font-medium hidden sm:flex items-center p-2 rounded-full hover:bg-gray-100 transition duration-200 ease-in-out" title={userName ? `Logged in as ${userName}` : 'User Profile'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>
                </>
            )}
            {!isLoggedIn && (
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out font-semibold">
                    Login
                </Link>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".glb"/>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;