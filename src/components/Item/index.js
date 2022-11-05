import { Star } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './style.css'
import {device} from '../../deviceinfo'  
class SingleProduct extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        phone:{},
        device_array:[]
    }
    
    componentDidMount(){
        const {device_array, phone}= this.state
        this.setState({device_array:device})
        console.log(device_array)
        device.find((dev)=>{
            if(dev.id == 1){
                console.log(dev)
                this.setState({phone:dev})
            }
        })
    }
    
    render() { 
        const {device_array, phone}= this.state
        const ratings =[1,2,3,4,5]
        return ( 
            <div class="product_card" style={{width:'80%'}}>
                <div className='device_container' style={{backgroundImage:`url(/img/${phone.img})`}}>
                    <div className='like_circle'>
                        
                    </div>                                                                               
                    
                </div>
                <div className='device_info_container'>
                <Link to={`/${this.props.Link}`} >
                      <p className='device_name'>
                        {phone.name}
                    </p> 
                </Link>
                    <p className='device_spec'>
                        -this is the spec
                    </p>                                                                               
                    <p className='device_price'>
                        this is the device
                    </p>                     
                    <div className='device_rating'>
                        {
                            ratings.map((rating)=>{
                                return(
                                    <Star style={{fontSize:'30px',color:'gray'}} key={rating}/>
                                )
                            })
                        }
                        <p>[no reviews yet]</p>
                    </div>                     
                    <p className='compare'>
                        
                    </p>                       
                </div>
            
            </div>

         );
    }
}
 
export default SingleProduct;