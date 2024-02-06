import React from 'react';
import { Link } from 'react-router-dom';
import "./promotion.css"
const sampleHeroBanner = {
  smallText: 'Winter Promotion',
  midText: '50% Off All Rentals',
  largeText1: 'Enjoy Your Winter Adventures',
  image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1706283742/OdomiteRentals/Hero_Images/vddb37jv8bwcjo2k9w6o.jpg',
  product: 'winter-special-product',
  buttonText: 'Call Now To Book',
  desc: 'Hurry up! Limited-time offer. Get 50% off on all rentals this winter season.',
};

const PromotionalPage = ({ heroBanner = sampleHeroBanner }) => {
  return (
    <div className="promotional-product-banner">
      <div>
        <p className="beats-solo">{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <div>
          <Link to={`/contactpage`}>
            <button type="button">{heroBanner.buttonText}</button>
          </Link>
          <div className="promotional-product-desc">
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPage;
