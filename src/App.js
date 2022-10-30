	import React, { Component } from 'react';
	import './App.css';
	import Body from './body/body';
	import Top_Bar from './nav/topbar'
	import DownBar from './root/bottom_bar';
	import User from './components/user_details/index'
	import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom"
	import SingleProduct from './components/Item';
import { PageNotFound } from './components/notfound';

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
					<Top_Bar toggle={toggle} set_toggle={set_toggle} />
			<Routes>
			<Route path="/" element={<Body/>} />
			<Route path="/login" element={<><User content_head ={'singn in'}/></>} />
			<Route path="/register" element={<></>} />
			<Route path="/produts/:productId" element={<SingleProduct />} />
			<Route path="/*" element={<PageNotFound />} />
			</Routes>
			<DownBar />
			</Router>

			</div>


			);
		}
	}

	export default App;
