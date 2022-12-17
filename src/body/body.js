import React from 'react';
import './body.css'
import './style.module.css'
import { useState,useEffect } from 'react';
import Slide_Bar from "../components/slidder/slidebar"
import Sample from './shopsmart/sample';
const Body=(props)=>{
    return(
    <div className='hero'>
	      <HeroImage />
        <Sample />
        <Brands />
        <GetNewsLetter />
        
    </div>    
     )
}

const HeroImage = (props)=>{
    return(
	    <div className="hero_img">
	      <div className="hero_shop_name">
          <h1>SHOP SMART</h1>
	        <p>Shop at the <br/>right price</p>
	        <button>COMPARE PRICES</button>
	      </div>
	    <div className="hero_shop_slidder">
	     <Slide_Bar />
	    </div>
	    </div>
    )
}
const Brands = (props)=>{
  const brands = [
    'Apple','Nokia','samsung','Infinix','Tecno'
  ]
  return(
    <div className="brands_">
      <div className='fav_brands'>
         <h1>
          Shop from your trusted and favourite brands
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
      <h1>Get Updates On Deals And Prices </h1>
      <p>Exclusive updates on prices that you'll love </p>
      <div className='input_container'>
        <input placeholder='your email '/><button>Suscribe</button>
      </div>
    </div>
  )
}

export default Body;
