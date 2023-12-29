import React from 'react';
import './body.css'
import './style.module.css'
import Slide_Bar from "../components/slidder/slidebar"
import HeaderBanner from '../components/bonus_products';
import { Facebook, Mail, Twitter, WhatsApp } from '@mui/icons-material';
import ProductCard from '../components/shoppingCard/card';
import "./header_contents.css"
const Body=(props)=>{
  return(
	<div className='hero'>
	  <HeroImage />
	  
	  <ProductCard />
	  <HeaderBanner />
	  <ProductCard />
	  <HeaderBanner />
      <Brands  />
      <GetNewsLetter />
	</div>
  )
}

const HeroImage = (props)=>{
  return(
	<div className="hero_img">
	  <Slide_Bar />
	</div>
  )
}
const Brands = (props)=>{
  const brands = [
	<Mail/>,<Twitter/>,<WhatsApp/>,<Facebook/>
  ]
  return(
	<div className="brands_">
	  <div className='fav_brands'>
		<h1>
		  REACH US ON THESE PLATFORMS
		</h1>
	  </div>
	  <div className='logos'>
		{brands.map((brand)=>{
		  return(
			<div className='circle_brand'>
			  {brand}
			</div>
		  )
		})}
	  </div>
	  <div>

	  </div>
	</div>
  )
}
const GetNewsLetter = (props)=>{
  return(
	<div className="news_letter">
	  <p>Get On our mailing list for great offers before your next event</p>
	  <div className='input_container'>
		<input placeholder='your email '/><button>Suscribe</button>
	  </div>
	</div>
  )
}
const BannerContent = (props)=>{
    return(
	    <div className="hero_img">
	      <div className="hero_shop_name">
          <h1>SHOP SMART</h1>
	        <p>Shop at the <br/>right price</p>
	        <button>COMPARE PRICES</button>
	      </div>
	    <div className="hero_shop_slidder">
	     
	    </div>
	    </div>
    )
}
export default Body;
