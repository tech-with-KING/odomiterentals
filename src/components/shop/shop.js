import React from 'react';
import Carded from '../../components/blogcard/bob';
import './style.css'
const Sample=(props)=>{
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
	   
<div className="popular_produts">
	    {
		tab.map((index)=>{
		    return(

			<div className ='product_container'>
                <Carded />
            </div>
		    )
		})
		}


    
    </div>
 
    )
}
export default Sample;
