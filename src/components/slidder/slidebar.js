import React, { useState, useEffect, useCallback } from 'react';
import './slidebar.css';
import { device } from '../../deviceinfo';
const SlideBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? device.length - 1 : prevIndex - 1
    );
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === device.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const goToSlide = useCallback((slideIndex) => {
    setCurrentIndex(slideIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);
  return (
    <div className='slide-bar'>
      <div
        style={{ backgroundImage: `url(${device[currentIndex].img})` }}
        className='slide-image'
      ></div>
      <div className='arrow left-arrow' onClick={prevSlide}>
        &#10094;
      </div>
      <div className='arrow right-arrow' onClick={nextSlide}>
        &#10095;
      </div>
      <div className='dots-container'>
        {device.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default SlideBar;
