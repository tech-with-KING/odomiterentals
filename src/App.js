import React, { Component } from 'react';
import './App.css';
import Body from './body/body';
import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom"
import { PageNotFound } from './components/notfound';
import { About } from './components/newsletters';
import Menu from './components/menu/menu';
import Footer from './footer/footer';
import ProductCard, { ProductHeader } from './components/shoppingCard/card';
import { device } from './deviceinfo';
import DownBar from './footer/bottom_bar';
import SingleItem from './components/single_product';
import ProductPage from './components/single_product';
import MessageForm from './components/user_details/index';
import BankAccounts from './components/slidder_downbar';
import {Services, AboutUs, products} from './deviceinfo'
import Header from './body/header';
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
				<Route path="/" element={<Body />} />
				<Route path="/contactpage" element={<MessageForm content_head="sign in" />} />
				<Route path="/products" element={<><ProductHeader /><ProductCard cart="All" products={products} /></>} />
				<Route path="/aboutpage" element={<><Header heading="ABOUT US" paragraph="Who we are - OdomiteRentals" /><About services={AboutUs} /></>} />
				<Route path="/services" element={<><Header heading="Our Services" paragraph="Our Range of Services comes at Affordable Rates" /><About services={Services} /></>} />
				<Route path="/products/:productId" element={<div className="single_product"><ProductPage /></div>} />
				<Route path="/*" element={<PageNotFound />} />
			</Routes>
			<DownBar />
		</Router>

	    </div>


	);
    }
}

export default App;
