import { Star } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './singleproduct.css'
class Product extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        
    }
    
    render() { 
        const ratings =[1,2,3,4,5]
        return ( 
            <div class="shop_template" style={{width:'80%'}}>
                <div className='tile' style={{backgroundImage:`url(/img/${this.props.img})`}}>                    
                </div>
                <div className='tile_info'>
                <Link to={`/${this.props.Link}`} >
                      <p className='device_name'>
                        {this.props.name}
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
                    <div className='shop_compare'>
                        <button>Jumia</button>    
                        <button>Slot</button>
                    </div>
                </div>
            </div>

         );
    }
}
 
export default Product;