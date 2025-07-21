import React from 'react';
import {Link} from 'react-router-dom';
import ModelViewer from '../Components/ModelViewer';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer.jsx';
import Collections from '../Components/Collections.jsx';

const Home = () => {
  const featuredModelUrl = "/optimized_spaceship.glb";

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-r from-[#1E2E4F] to-[#A7C7E7] text-gray-800 min-h-[600px] flex flex-col md:flex-row items-center justify-center">
        <div className="ml-[200px] mt-2">
          <h1 className="text-4xl text-white md:text-5xl font-bold mb-4">Glymph 3D Viewer</h1>
          <p className="text-lg text-white md:text-xl mb-6">
            Showcase interactive 3D models directly in your browser with ease and elegance.
          </p>
          <Link to="/collections" className="bg-blue-600 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md transition duration-300">
            EXPLORE MODELS
          </Link>
        </div>
        <div className="mt-10 md:mt-0 relative w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] flex items-center justify-center md:flex-1 md:max-w-none">
          <ModelViewer url={featuredModelUrl} />
        </div>
      </section>
      <Collections />
     <Footer />
    </>
  );
};

export default Home;