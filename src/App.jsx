import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './Pages/Dashboard';
import Product from './Pages/Product';
import ProductForm from './Component/ProductForm';
import Order from './Pages/Order';
import User from './Pages/User';
import Tracking from './Pages/Tracking';
import Login from './Component/Login';
import Register from './Component/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './utils/ProtectedRoute';
import ProductDetails from './Component/ProductDetails';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannerPage from './Pages/BannerPage';
import ReviewPage from './Pages/ReviewPage';
import CouponPage from './Pages/CouponPage';
import CategoryPage from './Pages/BannerPage';
import DropdownsPage from './Pages/CouponPage';


function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/inventory" element={<Product />} />
          <Route path="/product-form" element={<ProductForm />} />
          <Route path="/productDetails/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/users" element={<User />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/rating" element={<ReviewPage />} />
          <Route path="/dropdowns" element={<DropdownsPage />} />
        </Route>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
