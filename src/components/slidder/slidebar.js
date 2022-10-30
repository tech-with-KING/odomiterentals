import React, { Component } from 'react';
import Card_componnt,{Carded} from '../cardbar/cardbar';
import {motion ,AnimatePresence} from 'framer-motion'
import './slidebar.css'
import {Link} from 'react-router-dom'

class Slide_Bar extends Component {
    constructor(props) {
        super(props);
    }
    state = { index:0 }
    componentDidMount(){
	 setInterval(()=>{
     if(this.state.index == 3){
 	 this.setState({index:0})
     }
     else{
 	 this.setState({index:this.state.index+1})
     }
     	console.log(this.state.index)
 },8000) 
    }
    render() {
	        const animae=[
            {
                id:1,
                item:<Card_componnt/>,
            },
           {
               id:2,
               item: <Carded/>,
           },
           {
            id:3,
            item:   <Card_componnt/>
        },
        {
            id:4,
            item:  <Carded/>
        }
		]
	const{index}=this.state

	const back_animate= ()=>{
	      if(this.state.index == 3){
	 this.setState({index:0})
   }
    else{
  	 this.setState({index:this.state.index+1})
 }
	}




		const forward_animate= ()=>{
	      if(this.state.index == 3){
	 this.setState({index:0})
   }
    else{
  	 this.setState({index:this.state.index+1})
 }
	}
        return (  
		<div className="slideshow-container">
    		<div className='display_device'>
                <div className="device_image">
                    
                </div>         
                <div className='display_text'>
                        <h2>Apple iphone 12</h2>
                        <h3>Apple iphone 12</h3>
                </div>
                    <AnimatePresence exitBeforeEnter>
                    </AnimatePresence>
               
            </div>
            <div className='dot-container'>
                {
                    animae.map((data)=>{
                    return(<span className='dot' ></span>)})
                }
            </div>  

    </div>
        
 );
    }
}
 
export default Slide_Bar;
