import { Star } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './style.css'
import {device} from '../../deviceinfo'  

import { useParams } from "react-router-dom";

function withRouter(Component) {
  return props => <Component {...props} params={useParams()} />;
}
class SingleProduct extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        phone:{},
        device_array:[]
    }
    
    componentDidMount(){
        const id = this.props.params;
        console.log(id.productId)
        const {device_array, phone}= this.state
        this.setState({device_array:device})
        device.find((dev)=>{
            if(dev.id == id.productId){
                console.log(dev)
                this.setState({phone:dev})
            }
        })
    }
    
    render() { 
        const {device_array, phone}= this.state
        const ratings =[1,2,3,4,5]
        return ( 
            <div class="product_card" style={{width:'50%'}}>
                <div className='device_container' style={{backgroundImage:`url(/img/${phone.img})`}}>
                </div>
                <div className='device_info_container'>
                <Link to={`/products/`} >
                      <p className='device_name'>
                        {phone.name}
                    </p> 
                </Link>
                    <p className="device_name_">{phone.name}</p>                                                        
                    <p className='device_price'>
                        {phone.price}
                    </p>                     
                    <div className='device_rating'>
                        {
                            ratings.map((rating)=>{
                                return(
                                    <Star style={{fontSize:'30px',color:'gray'}} key={rating}/>
                                )
                            })
                        }
                        <p>[no reviews]</p>
                    </div>                     
                    <p className='compare'>Lorem ipsum dolor sit amet    </p>       

                    <div><input type={"search"} placeholder='enter price here '/></div>                
                    <button className='price_alert'>Set price alert</button>
                </div>
            
            </div>

         );
    }
}
 
export default withRouter(SingleProduct);