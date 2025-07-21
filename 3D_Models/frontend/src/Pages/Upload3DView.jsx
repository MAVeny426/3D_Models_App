import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import ModelViewer from '../Components/ModelViewer.jsx';

const Upload3DView = () => {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const fetchModel = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${BACKEND_BASE_URL}/api/models/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setModel(data);
        } else {
          setError(data.msg || 'Failed to fetch model details.');
          console.error('Failed to fetch model details:', data);
        }
      } catch (err) {
        console.error('Network error fetching model details:', err);
        setError('A network error occurred while fetching model details.');
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id, BACKEND_BASE_URL]); 

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600">Loading 3D model...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </>
    );
  }

  if (!model) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600">Model not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">{model.name}</h1>
        <p className="text-gray-700 text-center mb-6">{model.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="order-last md:order-first p-4 bg-white rounded-lg shadow-md flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Details & Specifications</h2>
            <div className="text-gray-700 space-y-2 flex-grow">
              <p><strong>Category:</strong> {model.category}</p>
              <p><strong>Upload Date:</strong> {new Date(model.uploadDate).toLocaleDateString()}</p>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <p className="text-lg font-medium text-gray-800">Creator Information:</p>
                <p><strong>Name:</strong> {model.creator.name}</p>
                {model.creator.email && <p><strong>Email:</strong> {model.creator.email}</p>}
                {model.creator.website && <p><strong>Website:</strong> <a href={model.creator.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{model.creator.website}</a></p>}
              </div>

              {model.specs && Object.keys(model.specs).length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <p className="text-lg font-medium text-gray-800">Model Specifications:</p>
                  <ul className="list-disc list-inside ml-4">
                    {Object.entries(model.specs).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <span className="font-semibold capitalize mr-1">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="order-first md:order-last w-full h-full bg-gray-100 rounded-lg shadow-lg">
            {model.glbUrl ? (
              <ModelViewer url={model.glbUrl}  />
            ) : (
              <div className="text-gray-500 flex justify-center items-center h-full">GLB file not available.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload3DView;