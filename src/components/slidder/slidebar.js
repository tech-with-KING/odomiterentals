import React, { Component } from 'react';

import {motion ,AnimatePresence} from 'framer-motion'
import './slidebar.css'
import {Link} from 'react-router-dom'
import {device} from "../../deviceinfo"
class Slide_Bar extends Component {
    constructor(props) {
        super(props);
    }
    state = { index:0 }
    componentDidMount(){
	 setInterval(()=>{
     if(this.state.index > 5){
 	 this.setState({index:0})
     }
     else{
 	 this.setState({index:this.state.index+1})
     }
    
 },4000) 
    }
    render() {
	      
        const {index} = this.state
		const setproduct = (id)=>{this.setState({index:id})}
        return (  
		<div className="slideshow-container">
    		<div className='display_device'>
                <div className="device_image" style={{backgroundImage:`url(/img/${device[index].img})`}}>
                    
                </div>         
                <div className='display_text'>
                        <h2>{device[index].name}</h2>
                        <h3></h3>
                </div>
                    <AnimatePresence exitBeforeEnter>
                    </AnimatePresence>
               
            </div>
            <div className='dot-container'>
                {

                    device.map((data)=>{
                        
                    return(<span key={data.id} onClick={()=>{setproduct(data.id)}} className={`dot`} style={data.id == device[index].id?{backgroundColor:"blue"}:{}} ></span>)})
                }
            </div>  

    </div>
        
 );
    }
}
 
export default Slide_Bar;
