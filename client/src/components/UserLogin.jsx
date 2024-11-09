import { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"
export default function UserLogin() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const fetchUserData = async () => {
        setIsLoading(true); // Set loading to true at the start
        try {
          const token = localStorage.getItem('token'); // Get token from local storage
          if (!token) {
            setError('No token found');
            setIsLoading(false);
            return;
          }
        //   console.log('work')
          // Make the request to fetch the user profile data
          const response = await axios.get('http://localhost:5009/api/users/user-profile', {
            headers: {
              'Authorization': `Bearer ${token}`, // Send token in Authorization header
            },
          });
  
          // Set the user data from the response
          setUserData(response.data);
        } catch (err) {
          setError('Error fetching user data');
          console.error(err);
        }
        setIsLoading(false); // Set loading to false after API call
      };
  
      fetchUserData();
    }, []);
  
    if (isLoading) {
      return <div>Loading...</div>; // Show loading state
    }
  
    return (
      <div>
        {error && <p className="error">{error}</p>}
        {userData ? (
          <div className="user-view">
            <h3>Welcome, {userData.username}</h3>
            <p>Email: {userData.email}</p>
            <p>Phone: {userData.mobileNumber}</p>
            <p>College Name: {userData.collegeName}</p>
            <img src={userData.collegeIDPhoto} alt="College ID" className="user-profile-pic" />
            <img src={userData.qrCode} alt="QR Code" className="user-qrcode" />
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    );
  }
  