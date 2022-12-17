import React from 'react';
import './bottom_bar.css'

const DownBar=()=>{
    const menue_objects=[
        {
            id:1,
	    heading:'Categories',
            items:['Mobiles','Laptops','Tablets','Accessories','Appliances']
        },
	{
            id:2,
	    heading:'Brands',
            items:['Apple','Samsung','Tecno','Infinix','Nokia','Hp','Lenovo']
        },
	{
            id:3,
	    heading:'Sites',
            items:['About us','How to use shopsmart','Merchant signup','User guide']
        },
	{
            id:4,
	    heading:'Support',
            items:['Contact us','Help center','Documentation','Reviews','Privacy and policy']
        },
	

        ]
    return(
            <div className='bottom_navbar'>

	    <div className='menue_contents'>
	    {
		menue_objects.map((menue=>{
		    return(
			    <div className='menue_container' key={menue.id}>
			    <h3>
			    {menue.heading}
			</h3>
			    <ul className='list_parent'>
			    {
				menue.items.map((list=>{
				    return(<li  key={list}>{list}</li>)
				}))
			    }
			    </ul>
			    
			    </div>
		    )
		    
		}))
	    }
	</div>
	    {/*copyright paragraph*/}
	    <div className='shopsmart_rights'>
&#169; 2022 shopsmart.com. All rights reserved
	    </div>
        </div>
    )
       
}
export default DownBar;
