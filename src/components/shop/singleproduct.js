import { Star } from '@mui/icons-material';
import { Link, withRouter } from 'react-router-dom';
import '../../globalstyle.css'
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
            <div class="shop_template" style={{width:'100%'}}>
                <div className='tile product-card' style={{backgroundImage:`url(/img/${this.props.img})`}}>
                </div>
                <div className='tile_info'>
                    <Link to={`/${this.props.id}`} >
			<p className='device_name product-name'>
                            {/* {this.props.name} */}Name
			</p>
                    </Link>
                    <p className='device_spec'>
                        -this is the spec
                    </p>
                    <p className='device_price product-price'>
                        {/* {this.props.price} */}$Price
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
                </div>
		</div>

		);
		}
		}

		export default Product;
