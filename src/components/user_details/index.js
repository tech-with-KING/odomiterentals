import React, { Component } from 'react';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import MenuIcon from '@mui/icons-material/Menu';
import "./style.css"
import {Link} from "react-router-dom"
import {motion} from 'framer-motion'
class SignIn extends Component {
    state = {  }
    render() {
	const {toggle,set_toggle}=this.props
	const set_style = ()=>
       {
	   const style = { fontSize: '30px', fontWeight: 'bold', positin:'absolute',left:'0',backgroud:'red' }
	   return( <ClearTwoToneIcon onClick={()=>{make_menue_toggle()}}  style={style}/>)
       }
	const make_menue_toggle=()=>{
	set_toggle()
    }
        return (
        <>
		<div className="addTodo" style={{minHeight:'400px'}}>

		<div className='ba' >
		<h2>Login/Register</h2>
		{set_style()}
            </div>
		<div className='todo_form_container'>
		<div className='todo_form'><button className='button' >Username:</button><input placeholder='task ...'/></div>
		<div className='todo_form' ><button className='button'>password:</button><input placeholder='start time...'/></div>
		</div>
		<p>first time signing in<Link  to={'/sync_now/register'}> register</Link></p>
		<p><Link  to={'/sync_now/forgot_password'}>forgot password</Link></p>
		<div className='add_btn'><button>Add</button></div>
            </div>
       </>
        );
    }
}

export default SignIn;
