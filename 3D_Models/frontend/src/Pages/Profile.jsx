import React, { useState,useEffect} from 'react';
import Navbar from '../Components/Navbar';

const Profile = () => {
  const [userData,setUserData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const mainContainerStyle = {backgroundImage:'url("/images/profile.jpg")',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',padding:'20px',boxSizing:'border-box'};
  const contentCardStyle = {backgroundColor:'rgba(255, 255, 255, 0.9)',padding:'40px',borderRadius:'12px',boxShadow:'0 8px 30px rgba(0, 0, 0, 0.2)',textAlign:'center',maxWidth:'600px',width:'100%',marginTop:'100px',border:'1px solid #e0e0e0'};
  const headingStyle = {fontSize:'2.5rem',fontWeight:'700',color:'#333333',marginBottom:'25px',letterSpacing:'1px'};
  const textDetailStyle = {fontSize:'1.1rem',color:'#555555',marginBottom:'10px',lineHeight:'1.6'};
  const strongStyle = {fontWeight:'600',color:'#333333'};
  const errorMessageStyle = {color:'#d32f2f',fontSize:'1.1rem',marginTop:'20px'};
  const loadingMessageStyle = {color:'#1976d2',fontSize:'1.1rem',marginTop:'20px'};

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.msg || 'Failed to fetch profile data.');
        }
      } catch (err) {
        console.error('Network or server error:', err);
        setError('An error occurred while fetching profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [BACKEND_BASE_URL]);

  return (
    <>
      <Navbar />
      <div style={mainContainerStyle}>
        <div style={contentCardStyle}>
          <h2 style={headingStyle}>Your Profile</h2>

          {loading && <p style={loadingMessageStyle}>Loading profile data...</p>}

          {error && <p style={errorMessageStyle}>Error: {error}</p>}

          {userData && (
            <div>
              <p style={textDetailStyle}><strong style={strongStyle}>Name:</strong> {userData.name}</p>
              <p style={textDetailStyle}><strong style={strongStyle}>Email:</strong> {userData.email}</p>
              {userData.createdAt && (
                <p style={textDetailStyle}><strong style={strongStyle}>Member Since:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          )}

          {!loading && !userData && !error && (
            <p style={textDetailStyle}>No profile data available. Please ensure you are logged in.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;