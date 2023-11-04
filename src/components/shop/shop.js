import React from 'react';
import Product from './singleproduct';
import './shop.css'
import {device} from '../../deviceinfo'
const Shop=(props)=>{
    const {toggle}=props
    const coloring={
      darkbg:'black',
      lightbg:'white',
      darkcl:'black',
      lightcl:'white',
      darkbd:'',
    }
    const tab = [1,2,3,4,5,6,7,8,9]
    return(
	   
<div className="shop_products">
<ul className='search_term'>
    <li>Tables</li>
    <li>Chairs</li>
    <li>10x10 folding tables</li>
    <li>Tables</li>
    <li>Chairs</li>
    <li>10x10 folding tables</li>
</ul>
	 <div className ='catalogue'>{
		device.map((index)=>{
		    return(
                <Product key={index.device_nam} price={index.price} img ={index.img} 
                name ={index.device_name} prince={index.price} id={index.id} 
                spec={index.spec} />
		    )
		})
		}
        </div> 


    
    </div>
 
    )
}
export default Shop;
