import React from 'react';
import {Link} from 'react-router-dom';
import featuredCollectionModels from '../Data/model.js';

const Collections = () => {
  return (
    <div>
        <section className="py-8 px-8 text-center ">
        <h2 className="text-5xl font-bold mb-12">Our Collection</h2>
        <p>Browse our amazing collection of 3D models.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8 px-24">
          {featuredCollectionModels.map((model) => ( 
            <div key={model.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition duration-300 ease-in-out hover:shadow-xl hover:shadow-black/30 hover:scale-103 transform">
              <Link to={`/model/${model.id}`} className="w-full h-56 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                <img src={model.thumbnailUrl} alt={model.name} className="object-cover w-full h-full"/>
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center text-white text-lg font-bold opacity-0 hover:opacity-100 transition-opacity duration-300">
                  View
                </div>
              </Link>

              <div className="p-4 flex flex-col items-center text-center flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{model.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{model.description}</p>
                <Link to={`/model/${model.id}`} className=" w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-full transition duration-200 uppercase text-sm">
                  View Model
                </Link>
              </div>
            </div>
            ))}
          </div>
      </section>
    </div>
  )
}

export default Collections