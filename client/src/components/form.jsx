import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../App.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    collegeName: '',
    collegeIDPhoto: null,
    email: '',
    mobileNumber: '',
    password: '',       
    confirmPassword: '', 
    accommodationRequired: false,
  });
  
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const slotCode = Cookies.get('slotCode');
    if (slotCode) {
      nav('/pay');
    }
  }, [nav]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, collegeIDPhoto: e.target.files[0] }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (formData.registerNumber.length < 9 || formData.registerNumber.length > 20 || !/^\d+$/.test(formData.registerNumber)) {
      formErrors.registerNumber = 'Register number must be between 9 and 20 digits.';
    }
    
    if (!(formData.email.endsWith('@klu.ac.in') || formData.email.endsWith('@gmail.com'))) {
      formErrors.email = 'Email must end with @klu.ac.in or @gmail.com.';
    }
    if (formData.mobileNumber.length !== 10 || !/^\d+$/.test(formData.mobileNumber)) {
      formErrors.mobileNumber = 'Phone number must be 10 digits.';
    }
    if (formData.password !== formData.confirmPassword) {
      formErrors.password = 'Passwords do not match.';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "collegeIDPhoto" && formData[key]) {
        data.append(key, formData[key]);
      } else if (key !== "collegeIDPhoto") {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:5009/api/users/register', data);
      const slotCode = response.data.slotCode;
      alert('Registered successfully! Slot Code: ' + slotCode);

      Cookies.set('slotCode', slotCode, { expires: 1 }); 
      nav('/pay');

    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
        <div>
            <Link to='login'><button className='admin'>Login</button></Link>
        </div>
        <form onSubmit={handleSubmit} className='formdiv'>
            <h2>Registration Form</h2>
            <input type="text" name="name" onChange={handleInputChange} placeholder="Name" required />
            
            <input
                type="text"
                name="registerNumber"
                onChange={handleInputChange}
                placeholder="  Register Number"
                required
            />
            {errors.registerNumber && <p style={{ color: 'yellow',fontWeight: 'bold' }}>{errors.registerNumber}</p>}

            <input
                type="text"
                name="collegeName"
                onChange={handleInputChange}
                placeholder="  College Name"
                required
            />
            <div className='filediv'>
                <h3>ID photo:</h3>
                <input type="file" name="collegeIDPhoto" className='cp' onChange={handleFileChange} required />
            </div>
            <input
                type="email"
                name="email"
                onChange={handleInputChange}
                placeholder="  Email ID"
                required
            />
            {errors.email && <p style={{ color: 'yellow',fontWeight: 'bold' }}>{errors.email}</p>}

            <input
                type="text"
                name="mobileNumber"
                onChange={handleInputChange}
                placeholder="  Mobile Number"
                required
            />
            {errors.mobileNumber && <p style={{ color: 'yellow',fontWeight: 'bold' }}>{errors.mobileNumber}</p>}
            
            <label>
                <h3>Password:</h3>
                <input
                    type="password"
                    name="password"
                    placeholder="Set password"
                    className="pas"
                    onChange={handleInputChange}
                    required
                />
            </label>
            <label>
                <h3>Confirm Password:</h3>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="pas"
                    onChange={handleInputChange}
                    required
                />
            </label>

            <label className='acc'>
                Accommodation Required:
                <input
                    type="checkbox"
                    name="accommodationRequired"
                    onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          accommodationRequired: !prev.accommodationRequired,
                        }))
                    }
                />
            </label>
            <button className="button" type="submit">Register</button>
        </form>
    </div>
  );
}

export default RegisterForm;
