import { Favorite, Star } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import device from '../../deviceinfo'
import './bob.css'
class Carded extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        
    }
    
    render() { 
        const ratings =[1,2,3,4,5]
        return ( 
            <div class="card" style={{width:'400px'}}>
                <div className='device_container' style={{backgroundImage:`url(/img/${this.props.img})`}}>
                    <div className='like_circle'>
                        <Favorite style={{color:'white',fontSize:'25px'}}/> 
                    </div>                                                                               
                    
                </div>
                <div className='device_info_container'>
                <Link to={`/${this.props.Link}`} >
                      <p className='device_name'>
                        This is the device name _
                    </p> 
                </Link>
                    <p className='device_spec'>
                        -this is the spec
                    </p>                                                                               
                    <p className='device_price'>
                        {this.props.price}
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
                        compare with 2 online shops 
                    </p>                       
                </div>
            
            </div>

         );
    }
}
 
export default Carded;
