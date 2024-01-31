import React, { useState, useEffect } from 'react';
import './App.css';
import Body from './body/body';
import { BrowserRouter, Routes, Route,	 } from "react-router-dom";
import { PageNotFound } from './components/notfound';
import { About } from './components/newsletters';
import Menu from './components/menu/menu';
import ProductCard, { ProductHeader } from './components/shoppingCard/card';
import DownBar from './footer/bottom_bar';
import ProductPage from './components/single_product';
import MessageForm from './components/user_details/index';
import { Services, AboutUs, products } from './deviceinfo';
import Header from './body/header';

const App = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" exact element={<Body />} />
        <Route path="/contactpage" exact element={<MessageForm content_head="sign in" />} />
        <Route path="/Catalogue" exact element={<><ProductHeader /><ProductCard cart="All" products={products} /></>} />
        <Route path="/aboutpage" exact element={<><Header heading="ABOUT US" paragraph="Who we are - OdomiteRentals" /><About services={AboutUs} /></>} />
        <Route path="/services" exact element={<><Header heading="Our Services" paragraph="Our Range of Services comes at Affordable Rates" /><About services={Services} /></>} />
        <Route path="/products/:productId" exact element={<div className="single_product"><ProductPage /></div>} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <DownBar />
    </BrowserRouter>
  );
};

export default App;
