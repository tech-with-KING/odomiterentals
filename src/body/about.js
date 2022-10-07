import React from 'react';
import imgr from "./sc/mo_prev_ui.png"
import './about.css'
const About=(props)=>{
    const {toggle}=props
    const coloring={
      darkbg:'black',
      lightbg:'white',
      darkcl:'black',
      lightcl:'white',
      darkbd:'',
  }
    return(
	   
<div className="content">
            {/*<img className="left-side" src={imgr} alt="Any Image"></img>*/}
            <h1 style={{color:"white"}}> ABOUT ME</h1>
	    <p>
	    </p>
	    
 

</div>
 
    )
}
export default About;



