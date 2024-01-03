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
			<form>
				<div>
					<input type='text' placeholder='first name'></input>
					<input type='text' placeholder='other names'></input>
				</div>
				<div>
					<input type='text' placeholder='full name'></input>
					<input type='submit' placeholder='submit'></input>
				</div>
				<div>
					<input type='text' placeholder='type here'></input>
					<input type='submit' placeholder='submit'></input>
				</div>
				<div>
					<h3>How would you like us to reach out to you</h3>
					<input type='text' placeholder='full name'></input>
					<input type='submit' placeholder='submit'></input>
				</div>
			</form>
		
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
