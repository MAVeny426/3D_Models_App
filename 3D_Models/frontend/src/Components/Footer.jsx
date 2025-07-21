import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      <footer className="bg-gradient-to-r from-blue-950 to-blue-800 text-blue-100 py-12 shadow-inner">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-50 flex items-center border-b border-blue-700 pb-2">
              <p className="w-5 h-5 mr-2 text-blue-300 flex items-center justify-center bg-blue-700 rounded-full">
              </p>
              About
            </h3>
            <p className="mb-2 text-blue-200">Perumbavoor,Kerala,683546</p>
            <p className="mb-2 text-blue-200">+91 8593851244</p>
            <p className="flex items-center text-blue-200">
              <p className="w-5 h-5 mr-2 text-blue-300 flex items-center justify-center bg-blue-700 rounded-full">
              </p>
              venyma504@gmail.com
            </p>
            <div className="mt-4 flex">
              <input type="email" placeholder="Enter email address" className="p-2 rounded-l-md bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md transition duration-200 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.684-.275a1 1 0 00.579-.93l.5-8.5a1 1 0 01.984-.918h4a1 1 0 01.984.918l.5 8.5a1 1 0 00.579.93l.684.275a1 1 0 001.169-1.409l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-50 flex items-center border-b border-blue-700 pb-2">
              <p className="w-5 h-5 mr-2 text-blue-300 flex items-center justify-center bg-blue-700 rounded-full">
              </p>
              News
            </h3>
            <div className="flex mb-4 items-center">
              <img src="./images/nature.jpg" alt="News thumbnail 1" className="w-16 h-16 object-cover rounded-md mr-3 border border-blue-600" />
              <div>
                <p className="text-sm text-blue-200">Even the all-powerful Pointing has no control about...</p>
                <span className="text-xs text-blue-400">Oct 16, 2019 Admin</span>
              </div>
            </div>
            <div className="flex items-center">
              <img src="./images/wallpaper-cat.jpg" alt="News thumbnail 2" className="w-16 h-16 object-cover rounded-md mr-3 border border-blue-600" />
              <div>
                <p className="text-sm text-blue-200">Even the all-powerful Pointing has no control about...</p>
                <span className="text-xs text-blue-400">Oct 16, 2019 Admin</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-50 flex items-center border-b border-blue-700 pb-2">
              <p className="w-5 h-5 mr-2 text-blue-300 flex items-center justify-center bg-blue-700 rounded-full">
              </p>
              Information
            </h3>
            <ul>
              <li className="mb-2"><Link to="/AboutUs" className="text-blue-200 hover:text-blue-50 transition duration-200 hover:underline">About</Link></li>
              <li className="mb-2"><Link to="/ContactUs" className="text-blue-200 hover:text-blue-50 transition duration-200 hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-50 flex items-center border-b border-blue-700 pb-2">
              <p className="w-5 h-5 mr-2 text-blue-300 flex items-center justify-center bg-blue-700 rounded-full">
              </p>
              Instagram
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <img src="./images/wallpaper-cat.jpg" alt="Instagram 1" className="w-full h-20 object-cover rounded-md border border-blue-600" />
              <img src="./images/bc.jpg" alt="Instagram 2" className="w-full h-20 object-cover rounded-md border border-blue-600" />
              <img src="./images/sky.jpg" alt="Instagram 3" className="w-full h-20 object-cover rounded-md border border-blue-600" />
              <img src="./images/running-shoe.jpg" alt="Instagram 4" className="w-full h-20 object-cover rounded-md border border-blue-600" />
              <img src="./images/nature.jpg" alt="Instagram 5" className="w-full h-20 object-cover rounded-md border border-blue-600" />
              <img src="./images/Sports-car.jpg" alt="Instagram 6" className="w-full h-20 object-cover rounded-md border border-blue-600" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 text-center text-blue-300 text-sm border-t border-blue-700 pt-8">
          <p> ©{new Date().getFullYear()} All rights reserved.</p>
          <p>Made by Veny M A @ venyma504@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer;