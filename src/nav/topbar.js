import React from 'react';
import "./tobar.css"
import "../globalstyle.css"
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Home, Search, Storefront, Warehouse } from '@mui/icons-material';
import { Button } from '@mui/material';
const Top_bar=(props)=>{
    const menue_list=[
        {
            id:1,
	    heading:'Home',
            items:['Mobiles','Laptops','Tablets','Accessories','Appliances']
        },
	{
            id:2,
	    heading:'Deals',
            items:['Apple','Samsung','Tecno','Infinix','Nokia','Hp','Lenovo']
        },
	{
            id:3,
	    heading:'Categories',
            items:['About us','How to use shopsmart','Merchant signup','User guide']
        },
	{
            id:4,
	    heading:'Stores',
            items:['Contact us','Help center','Documentation','Reviews','Privacy and policy']
        },
	{
            id:5,
	    heading:'Price Trackers',
            items:['Contact us','Help center','Documentation','Reviews','Privacy and policy']
        },
    ]
    return(
	<div className="top_bar">
	    <div id='heading'>
		    <h2 className='products-heading'>ODOMITE RENTALS</h2>
		    <p>A rental service you can trust</p>
	    </div>
		 <div className=' header_section'>
		    <ul className='menu_options'>
				<li id = "btn"><Home />Home </li>
				<button id = "btn"><Storefront /> CATALOGUE </button>
				<li>ABOUT US</li>
		    </ul>
		    <div className='john_doe'>
				<PersonOutlinedIcon />
				<p>Your Account</p>
		    </div>
		</div>
	</div>     
    )
}
export default Top_bar;
