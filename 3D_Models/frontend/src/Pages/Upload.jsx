import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx'; 

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorWebsite, setCreatorWebsite] = useState('');
  const [glbFile, setGlbFile] = useState(null); 
  const [polygons, setPolygons] = useState('');
  const [materials, setMaterials] = useState('');
  const [textures, setTextures] = useState('');
  const [format, setFormat] = useState('GLB'); 
  const [dimensions, setDimensions] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const [loggedInUserName, setLoggedInUserName] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); 

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setLoggedInUserEmail(user.email || '');
        setLoggedInUserName(user.name || user.email); 

        if (!creatorName) { 
            setCreatorName(user.name || user.email);
        }

      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        setIsLoggedIn(false);
        setLoggedInUserEmail('');
        setLoggedInUserName('');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session data is invalid. Please log in again.');
        navigate('/login');
      }
    } else {
      setIsLoggedIn(false);
      setLoggedInUserEmail('');
      setLoggedInUserName('');
      alert('You must be logged in to upload models.'); 
      navigate('/login');
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      const newStoredUser = localStorage.getItem('user');
      if (newToken && newStoredUser) {
        try {
            const user = JSON.parse(newStoredUser);
            setIsLoggedIn(true);
            setLoggedInUserEmail(user.email || '');
            setLoggedInUserName(user.name || user.email);
            if (!creatorName) { 
                setCreatorName(user.name || user.email);
            }
        } catch (e) {
            setIsLoggedIn(false);
            setLoggedInUserEmail('');
            setLoggedInUserName('');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Your session data changed. Please log in again.');
            navigate('/login');
        }
      } else {
        setIsLoggedIn(false);
        setLoggedInUserEmail('');
        setLoggedInUserName('');
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, creatorName]); 


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.glb')) {
        setGlbFile(selectedFile);
        setError(''); 
      } else {
        setGlbFile(null);
        setError('Please select a .glb file.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    if (!isLoggedIn) {
      setError('You must be logged in to upload models.');
      setLoading(false);
      navigate('/login');
      return;
    }

    if (!name || !description || !category || !creatorName || !glbFile) {
      setError('Please fill in all required fields and select a GLB file.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('creatorName', creatorName);
    formData.append('creatorWebsite', creatorWebsite);
    formData.append('glbFile', glbFile); 

    console.log('Sending creatorEmail:', loggedInUserEmail);
    formData.append('creatorEmail', loggedInUserEmail); 

    const specsObject = {
      polygons: polygons,
      materials: materials,
      textures: textures,
      format: format,
      dimensions: dimensions,
    };
    formData.append('specs', JSON.stringify(specsObject));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/models/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(responseData.msg || 'Model uploaded successfully!');
        console.log('Model upload successful:', responseData);

        setName('');
        setDescription('');
        setCategory('');
        setCreatorName(loggedInUserName || '');
        setCreatorWebsite('');
        setGlbFile(null);
        setPolygons('');
        setMaterials('');
        setTextures('');
        setFormat('GLB');
        setDimensions('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setTimeout(() => {
          navigate('/Albums');
        }, 2000);

      } else {
        setError(responseData.msg || 'Model upload failed. Please try again.');
        console.error('Model upload error:', responseData);
      }

    } catch (err) {
      console.error('Model upload network error:', err);
      setError('A network error occurred during upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen text-gray-700">
          Checking login status...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full px-4 py-2 min-h-[calc(100vh-64px)] flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Upload Your 3D Model</h1>

        <div className="bg-white p-6 rounded-lg shadow-xl w-full">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-1">Model Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sci-Fi Spaceship, Ancient Statue"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                id="description"
                className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-20 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of your model."
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-1">Category <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="category"
                className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Architecture, Character, Vehicle, Nature"
                required
              />
            </div>

            <div className="mb-3 border-t pt-3 mt-3">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Creator Details</h3>
              <div className="mb-3">
                <label htmlFor="creatorName" className="block text-gray-700 text-sm font-bold mb-1">Creator Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="creatorName"
                  className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Your name or studio name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="creatorEmail" className="block text-gray-700 text-sm font-bold mb-1">Creator Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="creatorEmail"
                  className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={loggedInUserEmail}
                  readOnly
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="creatorWebsite" className="block text-gray-700 text-sm font-bold mb-1">Creator Website (Optional)</label>
                <input
                  type="url"
                  id="creatorWebsite"
                  className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={creatorWebsite}
                  onChange={(e) => setCreatorWebsite(e.target.value)}
                  placeholder="e.g., https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="mb-3 border-t pt-3 mt-3">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Technical Specifications (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label htmlFor="polygons" className="block text-gray-700 text-sm font-bold mb-1">Polygons</label>
                  <input
                    type="text"
                    id="polygons"
                    className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={polygons}
                    onChange={(e) => setPolygons(e.target.value)}
                    placeholder="e.g., 50,000"
                  />
                </div>
                <div>
                  <label htmlFor="materials" className="block text-gray-700 text-sm font-bold mb-1">Materials</label>
                  <input
                    type="text"
                    id="materials"
                    className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label htmlFor="textures" className="block text-gray-700 text-sm font-bold mb-1">Textures</label>
                  <input
                    type="text"
                    id="textures"
                    className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={textures}
                    onChange={(e) => setTextures(e.target.value)}
                    placeholder="e.g., High-res PBR"
                  />
                </div>
                <div>
                  <label htmlFor="format" className="block text-gray-700 text-sm font-bold mb-1">Format</label>
                  <input
                    type="text"
                    id="format"
                    className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    placeholder="e.g., GLB"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions" className="block text-gray-700 text-sm font-bold mb-1">Dimensions</label>
                  <input
                    type="text"
                    id="dimensions"
                    className="shadow-sm border border-gray-300 rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g., 4m x 1m x 1m"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 border-t pt-3 mt-3">
              <label htmlFor="glbFile" className="block text-gray-700 text-sm font-bold mb-1">Upload GLB File <span className="text-red-500">*</span></label>
              <input
                type="file"
                id="glbFile"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".glb"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {glbFile && <p className="text-sm text-gray-600 mt-1">Selected file: {glbFile.name}</p>}
            </div>

            {message && <p className="text-green-500 text-sm mb-3 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <div className="flex justify-center mt-4 w-full">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition duration-300 shadow-md hover:shadow-lg text-base w-full"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Model'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Upload;
