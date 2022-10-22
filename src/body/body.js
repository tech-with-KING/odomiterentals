import React from 'react';
import './body.css'
import { useState,useEffect } from 'react';
import Slide_Bar from "../components/slidder/slidebar"
const Body=(props)=>{
    const [dark,setdark]=useState(false)
   
  const datas =[
      {
          id:1,
          text:"this is going to be some of the best articles yuo will ever get to read",
          img:'/img/pythondev1.jpeg',
	  name:'python'
	  
      },
      {
        id:2,
        text:"this is going to be some of the best articles yuo will ever get to read",
          img:'/img/bn.png',
	  name:'Reac/js'
    },
    {
        id:3,
        text:"this is going to be some of the best articles yuo will ever get to read",
        img:'/img/cforme.jpeg',
	name:'C'
    },
      {
        id:4,
        text:"this is going to be some of the best articles yuo will ever get to read",
        img:'/img/git.png',
	name:'git'
    }
  ]

    return(
            <div className='hero'>
	    <HeroImage />
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
export default Body;
