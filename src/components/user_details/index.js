import React, { Component } from 'react';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import MenuIcon from '@mui/icons-material/Menu';
import "./style.css"
import {Link} from "react-router-dom"
import {motion} from 'framer-motion'
class User extends Component {
    render() {
        return (
		<>
		
				<div className="addTodo" style={{ minHeight: '400px' }}>
					<div className='content_head' >
						<h2>{this.props.content_head}</h2>
		</div>
		{/* main login*/}
	    <div className='form'>
		<div><InputContainer /></div>
		{/* login alternatives*/}
	     <div> <LoginContainer /></div>
	    	<div><LoginAlternatives /></div>
		{/****/}
	    </div>
		</div>
		
		</>
		
        );
    }
}

const InputContainer = (props)=>{
    return(
	    <div className='input_form'>
	    <p>Email</p>
	    <div className='input_box'>
	    <input type='text' placeholder={'hello'} />
	    </div>
	    </div>
    )
}
const LoginAlternatives = (props)=>{
    return(
	    <button className='account_button'>
	    HELLO
	    </button>
    )
}

const LoginContainer = (props)=>{
    return(
	    <div className='login_form'>


	    <button className='login_button'>
	    HELLO
	    </button>
	    <p>Email</p>
	    <div className='input_box'>
	    <div></div>
	    <h3>or</h3>
	    <div></div>
	    </div>
	    </div>

    )
}
export default User;
