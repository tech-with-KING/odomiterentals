import React from 'react';
import './body.css'
import './style.module.css'
import { useState,useEffect } from 'react';
import Slide_Bar from "../components/slidder/slidebar"
import Products from './shopsmart/sample'
import { device } from '../deviceinfo';
import FooterBanner from '../components/footer';
import HeaderBanner from '../components/bonus_products';

const Body=(props)=>{
    return(
	<div className='hero'>
	    <HeroImage />
	    <Products data={[...device]} h1={"Products"} desc={"get the best deasls on our products"} />
		<HeaderBanner />
		<Products data={[...device]} h1={"Products"} desc={"get the best deasls on our products"} />
		<FooterBanner />
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
	'Instagram','Facebook','Google','Our Website'
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
	    <h1>Get Updates On Deals And Prices </h1>
	    <p>Exclusive updates on prices that you'll love </p>
	    <div className='input_container'>
		<input placeholder='your email '/><button>Suscribe</button>
	    </div>
	</div>
    )
}

export default Body;
