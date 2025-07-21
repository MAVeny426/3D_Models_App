import React, {useState,useEffect} from 'react';
import {Link,useLocation} from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';

const Albums = () => {
  const location = useLocation();
  const [searchTerm,setSearchTerm] = useState(location.state?.searchTerm || '');

  const [models,setModels] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    if (location.state?.searchTerm !== searchTerm) {
      setSearchTerm(location.state?.searchTerm || '');
    }
  }, [location.state?.searchTerm, searchTerm]); 


  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in First.');
          setLoading(false);
          return;
        }

        // Construct the full API URL using the base URL
        const apiUrl = searchTerm
          ? `${BACKEND_BASE_URL}/api/models?search=${encodeURIComponent(searchTerm)}`
          : `${BACKEND_BASE_URL}/api/models/`; // Changed from /api/models/

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setModels(data);
        } else {
          setError(data.msg || 'Failed to fetch models.');
          console.error('Failed to fetch models:',data);
        }
      } catch (err) {
        console.error('Network error fetching models:',err);
        setError('A network error occurred while fetching models.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  },[searchTerm, BACKEND_BASE_URL]);

  return (
    <>
      <div className="min-h-screen" style={{ backgroundImage: `url('/images/profile.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',}}>
        <Navbar />
        <div className="w-full p-8 pt-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">Your Uploaded 3D Models</h1>

          {searchTerm && (
            <p className="text-center text-white text-lg mb-4">
              Showing results for: <span className="font-semibold">"{searchTerm}"</span>
            </p>
          )}

          {loading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-white">Loading models...</p>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-red-300">{error}</p>
            </div>
          )}

          {!loading && !error && models.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-lg text-white mb-4">No models uploaded yet or no matching models found.</p>
              <Link to="/Upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                Upload Your First Model
              </Link>
            </div>
          )}

          {!loading && !error && models.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {models.map((model) => (
                <div key={model._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl bg-opacity-90">
                  <Link to={`/Upload3DView/${model._id}`}>
                    <img src={model.thumbnailUrl || `https://placehold.co/400x300/E0E0E0/333333?text=${model.name.substring(0, 10)}...`} alt={model.name} className="w-full h-48 object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/E0E0E0/333333?text=${model.name.substring(0, 10)}...`; }}
                    />
                  </Link>
                  <div className="p-4">
                    <h2 className="font-bold text-xl mb-2 text-white truncate">{model.name}</h2>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">{model.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Category: {model.category}</span>
                      <span>By: {model.creator.name}</span>
                    </div>
                    <Link to={`/Upload3DView/${model._id}`} className="mt-4 block text-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                      View Model
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Albums;