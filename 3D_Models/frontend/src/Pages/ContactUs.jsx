import React, {useState} from 'react';
import Navbar from '../Components/Navbar';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    phone:'',
    message:''
  });
  const [status,setStatus] = useState('');

  const handleChange = (e) => {
    const { name,value} = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]:value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully! ');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const errorData = await response.json();
        setStatus(`Failed to send message: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error sending form:', error);
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/images/profile.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-5xl w-full bg-gray-600 bg-opacity-90 shadow-2xl rounded-lg p-8 sm:p-10 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-8 text-center uppercase tracking-wide">
          Get In Touch
        </h1>

        <p className="flex items-center justify-center text-lg text-white">
            <svg className="w-6 h-6 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
            Email: <a href="mailto:venyma504@gmail.com" className="text-blue-300 hover:text-blue-100">venyma504@gmail.com</a>
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input type="text" id="name" name="name" placeholder="YOUR NAME *" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" value={formData.name} onChange={handleChange} required/>
          </div>
          <div className="row-span-3">
            <label htmlFor="message" className="sr-only">Your Message</label>
            <textarea id="message" name="message" rows="7" placeholder="YOUR MESSAGE *" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Your Email</label>
            <input type="email" id="email" name="email" placeholder="YOUR EMAIL *" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" value={formData.email} onChange={handleChange} required/>
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">Your Phone</label>
            <input type="tel" id="phone" name="phone" placeholder="YOUR PHONE *" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" value={formData.phone} onChange={handleChange} required/>
          </div>

          <div className="md:col-span-2 text-center mt-6">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-xl text-lg uppercase tracking-wide">
              Send Message
            </button>
            {status && <p className="mt-4 text-center text-blue-300">{status}</p>}
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactUs;