import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import RegisterForm from './components/form';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Payment from './components/payment';
import QrCode from './components/qrCode';
import Login from './components/AdminLogin';
import AdminPage from './components/admin';
import UserLogin from './components/UserLogin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RegisterForm />} />
        <Route path='/pay' element={<Payment/>}/>
        <Route path='/qrcode' element={<QrCode/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
        <Route path='/user' element={<UserLogin/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
