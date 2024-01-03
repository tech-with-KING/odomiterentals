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
			<Route path="/contactpage" element={<><MessageForm content_head ={'singn in'}/></>} />
			<Route path="/products" element={<><ProductHeader/> <ProductCard devices={device}/></>} />
			<Route path="/aboutpage" element={<About />} />
			<Route path="/products/:productId" element={<div className='single_product'><ProductPage /></div>} />
			<Route path="/*" element={<PageNotFound />} />
		    </Routes>
			<ProductPage />
			<DownBar />
		</Router>

	    </div>


	);
    }
}

export default App;
