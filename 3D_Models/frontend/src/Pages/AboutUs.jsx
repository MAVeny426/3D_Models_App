import React from 'react';
import { Link } from 'react-router-dom';
import ModelViewer from '../Components/ModelViewer.jsx';
import Navbar from '../Components/Navbar.jsx';

const AboutUs = () => {
  const modelToDisplay = {
    id: 'optimized-spaceship',
    name: 'Optimized Spaceship',
    glbUrl: '/optimized_spaceship.glb',
    scale: 1.0,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    environmentPreset: 'dawn',
    castShadows: true,
    receiveShadows: true,
    description: 'A sleek, optimized spaceship model.',
    category: 'vehicle',
  };

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen w-full bg-gray-900 text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/images/profile.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>


      <div className="max-w-6xl w-full relative z-20 bg-white px-8 py-8 rounded-lg">
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4">About us</h1>
          <p className="text-xl md:text-2xl text-gray-600">
            We Don't Make Animation, We Make Animation Better.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center items-center lg:justify-start">
            <div className="w-full max-w-lg h-64 md:h-96  rounded-lg flex items-center justify-center text-gray-400 text-lg shadow-xl overflow-hidden">
              {modelToDisplay && modelToDisplay.glbUrl ? (
                <ModelViewer url={modelToDisplay.glbUrl} scale={modelToDisplay.scale} position={modelToDisplay.position} rotation={modelToDisplay.rotation} environmentPreset={modelToDisplay.environmentPreset} castShadows={modelToDisplay.castShadows} receiveShadows={modelToDisplay.receiveShadows} className="w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-black">
                  3D Model not available.
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-black mb-6">
              Who we are
            </h2>
            <p className="text-black leading-relaxed mb-8">
              We are making the world a better place, one design at a time.
              <br/><br/>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <Link to="/Albums" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-lg uppercase tracking-wide">
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
        </div>

      </div>
    </div>
    </>
  );
};

export default AboutUs;