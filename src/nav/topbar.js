import React from 'react';
import "./tobar.css"
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Search } from '@mui/icons-material';
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
		<div className='top_bar'>
	    <div className='logo'>
	    <div className='logo_icons'>
	    <div><LocalOfferIcon className='local_offer' style={{color:'#F6CC5C',fontSize:'60px'}} /><ShoppingCartOutlinedIcon className='shopping_cart' style={{color:'#053674',fontSize:'60px'}} /></div>
	    <h3>SHOP SMART</h3>
	    <p>Shop smart at the right price </p>
	    </div>
	    </div>
			<div className='menu_list'>
	
	    <div className=' header_section'>
	    <ul className='menu_options'>
					{
						menue_list.map((list => {
							return (<li key={list.id}>{list.heading}</li>)
						}))
					}
	  </ul>
	    <div className='john_doe'>
	    <PersonOutlinedIcon />
	    <p>John Doe</p>
	    </div>
	    </div>
	    <div className='input_container'>
	    <div >
	    <input type='email' placeholder='what are you shopping for ...'/>
	    <div><p>Search</p><Search /></div></div>

				</div>
			</div>
		</div>     
    )
}
export default Top_bar;
