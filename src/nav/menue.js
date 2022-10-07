import React from 'react';
import './menue.css'
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import {Link} from "react-router-dom"
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Cancel } from '@mui/icons-material';
const Menue_Bar=(props)=>{
    const {toggle}=props
    const coloring={
      darkbg:'black',
      lightbg:'white',
      darkcl:'black',
      lightcl:'white',
      darkbd:'',
  }
    return(

	    <div className='menuebar' style={toggle ? { height: '90vh',position:"fixed",top:'0',width:'100vw',minWidth:"320px" } : { height: '0',position:'fixed',width:'100vw' }}  >
	    <div className='menu_cancel_icon_container'><ClearTwoToneIcon style={{fontSize:'30px',fontWeight:'bold'}} /></div>
	    	    <div >
	                        <Link className='li' to={'/'}> <HomeIcon style={{ marginRight: '5px' }} />Home</Link>
				<Link className='li' to={'/projects'} >
					<MenuBookTwoToneIcon style={{ marginRight: '5px' }} />Projects
				</Link>
	    <Link className='li' to={'/articles'} ><LibraryBooksIcon style={{ marginRight: '5px' }} />Articles</Link>
				<Link to={""} className='li' ><InfoTwoToneIcon style={{ marginRight: '5px' }} />About</Link>
	    </div>

	    </div>
	    
    )
}
export default Menue_Bar;
