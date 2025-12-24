// src/utils/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
const token = localStorage.getItem('token');
  // const checkTokenValidity = () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return false;

  //   try {
  //     const decoded = jwtDecode(token);
  //     const currentTime = Date.now() / 1000;

  //     if (decoded.exp < currentTime) {
  //       localStorage.removeItem('token');
  //       toast.error('Session expired. Please log in again.', {
  //         position: 'top-right',
  //         autoClose: 3000,
  //       });
  //       return false;
  //     }

  //     return true;
  //   } catch (error) {

  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   if (!checkTokenValidity()) {
  //     navigate('/product');
  //   }
  // }, []);

  return token ? children : <Navigate to="/login" />;
  
};

export default ProtectedRoute;
