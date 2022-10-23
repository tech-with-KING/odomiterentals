	import React, { Component } from 'react';
	import './App.css';
	import Body from './body/body';
	import Modal from './components/modalbox/modalbox'
	import Articles from "./article_page/index"
	import Article from "./article_page/article_list"
	import Slide_Bar from './components/slidder/slidebar'
	import Top_Bar from './nav/topbar'
	import DownBar from './root/bottom_bar';
	import Projects from "./projects_page/index"
	import User from './components/user_details/index'
	import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom"


	class App extends Component {
		state = {
		toggle: false
		}
		componentDidMount() {
		const api = async () => {
			const ret = await fetch('http://localhost:5500/articles')
			const bar = await ret.json()
			console.log(bar)
		}
		}

		render() {
		const { toggle } = this.state
		const set_toggle = () => { toggle ? this.setState({ toggle: false }) : this.setState({ toggle: true }) }
		const home = () => {
			return (
				<>
				</>
			)
		}
		return (
			<div className='app'>
				<Router>
					<Top_Bar toggle={toggle} set_toggle={set_toggle} />
			<Routes>
			<Route path="/" element={<Body/>} />
			<Route path="/login" element={<><User content_head ={'singn in'}/></>} />
			<Route path="/register" element={<></>} />
			<Route path="/articles/one" element={<></>} />
			</Routes>
			<DownBar />
			</Router>

			</div>


			);
		}
	}

	export default App;
