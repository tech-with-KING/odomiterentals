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
            if(this.state.index > 8){
            this.setState({index:0})
            }
            else{
            this.setState({index:this.state.index+1})
            }
            
        },10000) 
            }
            render() {
                
                const {index} = this.state
                const setproduct = (id)=>{this.setState({index:id})}
                return (  
                    <AnimatePresence >
                <motion.div className="slideshow-container" style={{backgroundImage:`url(/img/${device[index].img})`}}
                key={index}
                >
                
            
                <div className='display_device' 
                
                >
                <div className="device_image" >
                            
                            </div>         
                            <div className='display_text'>
                                    <h2>{device[index].name}</h2>
                                    <h3></h3>
                            </div>
                            
                </div>
        
                    <div className='dot-container'>
                        {

                            device.map((data)=>{
                                
                            return(<span key={data.id} onClick={()=>{setproduct(data.id)}} className={`dot`} style={data.id == device[index].id?{backgroundColor:"blue"}:{}} ></span>)})
                        }
                    </div>  

            </motion.div>
            </AnimatePresence>
        );
            }
        }
        
        export default Slide_Bar;
