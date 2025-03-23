import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./promotion.css";

const sampleHeroBanner = [
  {
    smallText: 'Winter Promotion',
    midText: '50% Off All Second Day Rentals',
    largeText1: 'Enjoy Your Winter Adventures',
    image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1706283742/OdomiteRentals/Hero_Images/vddb37jv8bwcjo2k9w6o.jpg',
    product: 'winter-special-product',
    buttonText: 'Call Now To Book',
    color: ' #dcdcdc',
    desc: 'Hurry up! Limited-time offer. Get 50% off on all second day rentals this winter season.',
  },
  {
    smallText: 'Summer Special',
    midText: 'No Extra Charge For Early Pickup !!!',
    largeText1: 'Enjoy Your Summer',
    image: 'https://res.cloudinary.com/dpcvlheu9/image/upload/v1706283742/OdomiteRentals/Hero_Images/vddb37jv8bwcjo2k9w6o.jpg',
    product: 'Summer Special',
    buttonText: 'Call Now To Book',
    color: ' #dcdcdc',
    desc: ' You can get your items a day before your event at no additional cost to you',
  },
];

const PromotionalPage = ({ index = 0 }) => {
  const [heroBanner, setHeroBanner] = useState(sampleHeroBanner);

  useEffect(() => {
    setHeroBanner(sampleHeroBanner);
  }, []);

  // Ensure index is within bounds
  const safeIndex = index < heroBanner.length ? index : 0;
  const currentBanner = heroBanner[safeIndex];

  return (
    <div className="promotional-product-banner" style={{ backgroundColor: currentBanner.color }}>
      <div>
        <p className="beats-solo">{currentBanner.smallText}</p>
        <h3>{currentBanner.midText}</h3>
        <h1>{currentBanner.largeText1}</h1>
        <div>
          <Link to={`/contactpage`}>
            <button type="button">{currentBanner.buttonText}</button>
          </Link>
          <div className="promotional-product-desc">
            <p>{currentBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPage;
