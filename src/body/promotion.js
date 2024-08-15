import React from 'react';
import { Link } from 'react-router-dom';
import "./promotion.css"
const sampleHeroBanner =[ {
  smallText: 'Winter Promotion',
  midText: '50% Off All Second Day Rentals',
  largeText1: 'Enjoy Your Winter Adventures',
  image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1706283742/OdomiteRentals/Hero_Images/vddb37jv8bwcjo2k9w6o.jpg',
  product: 'winter-special-product',
  buttonText: 'Call Now To Book',
  color:'white',
  desc: 'Hurry up! Limited-time offer. Get 50% off on all second day rentals this winter season.',
},
{
  smallText: 'Summer Special',
  midText: 'No Extra Charge For Early Pickup !!!',
  largeText1: 'Enjoy Your Summer',
  image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1706283742/OdomiteRentals/Hero_Images/vddb37jv8bwcjo2k9w6o.jpg',
  product: 'Summer Special',
  buttonText: 'Call Now To Book',
  color:'white',
  desc: ' You can get your items a day before your event at no additional cost to you',
},
]
const PromotionalPage = ( { heroBanner = sampleHeroBanner, index}) => {

  return (
    <div className="promotional-product-banner" style={{backGroundColor:`${heroBanner[index].color}`}}>
      <div>
        <p className="beats-solo">{heroBanner[index].smallText}</p>
        <h3>{heroBanner[index].midText}</h3>
        <h1>{heroBanner[index].largeText1}</h1>
        <div>
          <Link to={`/contactpage`}>
            <button type="button">{heroBanner[index].buttonText}</button>
          </Link>
          <div className="promotional-product-desc">
            <p>{heroBanner[index].desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPage;
