import React, { Component } from 'react';
import './App.css';
import Body from './body/body';
import DownBar from './footer/bottom_bar';
import User from './components/user_details/index'
import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom"
import SingleProduct from './components/Item';
import { PageNotFound } from './components/notfound';
import Shop from './components/shop/shop';
import BlogComponent from './components/newsletters';
import Menu from './components/menu/menu';
import Footer from './footer/footer';
import ProductCard, { ProductHeader } from './components/shoppingCard/card';
import ShopPage from './components/shoppage/shop';

class App extends Component {
    state = {
	toggle: false,
	cart : [],
	produts:[]
    }
    componentDidMount() {
	const api = async () => {
	}
    }

    render() {
	const { toggle } = this.state
	const set_toggle = () => { toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true }) }
	return (
	    <div className='app'>
		<Router>
			<Menu />
		    <Routes>
			<Route path="/" element={<Body/>} />
			<Route path="/login" element={<><User content_head ={'singn in'}/></>} />
			<Route path="/register" element={<></>} />
			<Route path="/shop" element={<><ProductHeader/> <ProductCard /></>} />
			<Route path="/aboutus" element={<BlogComponent />} />
			<Route path="/products/:productId" element={<div className='single_product'><SingleProduct /></div>} />
			<Route path="/*" element={<PageNotFound />} />
		    </Routes>
			
		    <Footer />
		</Router>

	    </div>


	);
    }
}

export default App;
