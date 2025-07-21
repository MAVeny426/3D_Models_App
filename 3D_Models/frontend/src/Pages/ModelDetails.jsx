import React from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import AllModels from '../Components/AllModels';
import Navbar from '../Components/Navbar';
import featuredCollectionModels from '../Data/model.js';

const ModelDetails = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const model = featuredCollectionModels.find(m => m.id === modelId);

  if (!model) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Model Not Found</h2>
          <p className="text-lg text-gray-700 mb-6">
            The 3D model you are looking for does not exist.
          </p>
          <button onClick={() => navigate('/Home')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition duration-300">
            Go to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 pt-4">
        <button onClick={() => navigate(-1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md mb-6">
          &larr; Back to Collection
        </button>

        <div className="flex flex-col lg:flex-row lg:space-x-8 mb-12">
          <div className="w-full lg:w-3/5 h-[500px] md:h-[650px] bg-gray-900 rounded-lg shadow-xl mb-8 lg:mb-0">
            <AllModels url={model.glbUrl}/>
          </div>

          <div className="w-full lg:w-2/5 p-4 bg-white rounded-lg shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">{model.name}</h1>
            <p className="text-lg text-gray-700 mb-6">{model.description}</p>

            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 border-b pb-2">Information</h3>
              <p className="text-gray-700 mb-2"><strong>Category:</strong> <span className="capitalize">{model.category || 'N/A'}</span></p>
              {model.creator && (
                <p className="text-gray-700 mb-2">
                  <strong>Creator:</strong> {model.creator.name}
                  {model.creator.website && (
                    <a href={model.creator.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                      (Website)
                    </a>
                  )}
                </p>
              )}
            </div>

            {model.specs && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3 text-gray-800 border-b pb-2">Technical Specifications</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {Object.entries(model.specs).map(([key, value]) => (
                    <li key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 text-center">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition duration-300">
                Download Model
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Reviews</h2>
          <p className="text-center text-gray-600">No reviews yet. Be the first to leave one!</p>
        </div>

      </div>
    </>
  );
};

export default ModelDetails;