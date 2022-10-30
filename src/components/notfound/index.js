import React from 'react';
import './style.css'
import { FlutterDash } from '@mui/icons-material';
const UserNotFound=(props)=>{
    return(
    <div className='user_not_found'>
           <div className='user1'>
        <h4>You need to login to access the features </h4>
	     <ul>
            <li><button></button>Favourite Product</li>
            <li><button></button>Price Alerts</li>
            <li><button></button>Browsing History</li>
            <li><button></button>Store Reviews</li>
         </ul>
         <div>
            <button>Login</button>
            <button>Sign Up</button>
         </div>
         </div>
    </div>    
     )
}
const PageNotFound=(props)=>{
    return(
    <div className='page_not_found'>
        <div className='page1'>
        <h4>the page you are looking for does not exist or is part of our beta features  </h4>
	     <div>
            <FlutterDash style={{fontSize:'200px',color:'#053674'}} />
         </div>
         <div>
            <button>Back To Home</button>
         </div>
    </div>
    </div>    
     )
}
export {PageNotFound, UserNotFound}