import React, { useState, useEffect } from 'react';
import './App.css';
import Body from './body/body';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { PageNotFound } from './components/notfound';
import { About } from './components/newsletters';
import Menu from './components/menu/menu';
import DownBar from './footer/bottom_bar';
import ProductPage from './components/single_product';
import MessageForm from './components/user_details/index';
import { Services, AboutUs, products } from './deviceinfo';
import Header from './body/header';
import CartPage from './components/cart/cart';
import OrderSummary from './components/cart';
import ProductUpload from './components/Products';
import ProductUpdatePage from './components/Products/main';
import SignupForm from './components/account';
import LoginForm from './components/account/login';
import { AuthProvider } from './contexts/authcontext';
import ProtectedRoute, { AdminRoute, ProtectedRoute2, ProtectedRoute3 } from './protectedroutes';
import ProfilePage from './components/profile/inex';
import CataloguePage from './pages/catalogue';
const App = () => {
  const [login, setLogin] = useState(true)
  const toggle_form = () => setLogin(!login)
  return (
    <BrowserRouter>
      <AuthProvider >
      <Menu />
      <Routes>
        <Route path="/" exact element={<Body />} />
        <Route path="/contactpage" exact element={<ProtectedRoute ><MessageForm content_head="sign in" /></ProtectedRoute>} />
        <Route path="/Catalogue" exact element={<CataloguePage products={products}/>} />
        <Route path="/addproducts" exact element={<AdminRoute ><ProductUpload /></AdminRoute>} />
        <Route path="/updateproducts" exact element={<AdminRoute ><ProductUpload /></AdminRoute>} />
        <Route path="/profile" exact element={<ProtectedRoute2 > <ProfilePage /></ProtectedRoute2>} />
        <Route path="/accounts" exact element={login ?<ProtectedRoute> <LoginForm onSwitchToSignup={toggle_form} /></ ProtectedRoute>: <SignupForm onSwitchToLogin={toggle_form} />} />
        <Route path="/aboutpage" exact element={<><Header heading="ABOUT US" paragraph="Who we are - OdomiteRentals" /><About services={AboutUs} /></>} />
        <Route path="/services" exact element={<><Header heading="Our Services" paragraph="Our Range of Services comes at Affordable Rates" /><About services={Services} /></>} />
        <Route path="/products/:productId" exact element={<ProtectedRoute3 ><div className="single_product">
                                                            <ProductPage /></div></ProtectedRoute3>} />
        <Route path="/cart" element={<ProtectedRoute ><CartPage /></ProtectedRoute>} />
        <Route path="/ordersummary" element={<OrderSummary />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
        <DownBar />
        </AuthProvider >
    </BrowserRouter>
  );
};

export default App;
