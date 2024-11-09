import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function QrCode() {
  const [qrCode, setQrCode] = useState('');
  const slotCode = Cookies.get('slotCode');

  useEffect(() => {
    if (slotCode) {
      // Fetch QR Code data for the user
      axios.get(`http://localhost:5009/api/users/user/${slotCode}`)
        .then((response) => {
          setQrCode(response.data.qrCode);

          return axios.post(`http://localhost:5009/api/users/log-footprint/${slotCode}`);
        })
        .then(() => {
          console.log('Footprint logged successfully');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      console.error('No slot code found in cookies');
    }
  }, [slotCode]);

  return (
    <div>
      <h3>Take Screenshot</h3>
      {qrCode ? (
        <img src={qrCode} alt="User QR Code" />
      ) : (
        <p>No QR code available</p>
      )}
    </div>
  );
}
