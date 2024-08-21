import React, { useState, useCallback, useEffect } from 'react';
import './slidebar.css';
import { Services } from '../../deviceinfo';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'

const HeaderSlideBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showText, setShowText] = useState(true);

  const nextSlide = useCallback(() => {
    setShowText(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === Services.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const textVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.8,
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
    bounce: {
      y: [0, -20, 0],
      transition: {
        y: {
          duration: 0.6,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    },
    shake: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        x: {
          duration: 0.6,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    },
  };

  return (
    <div className="services_slides_container"  >
      <div className="image_slider" style={{ backgroundImage: `url(${Services[currentIndex].image})`}} >
        <div className='text_container'>
      <AnimatePresence>
        {showText && (
          <motion.h1
            className="service_name"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="bounce"
            whileTap="shake"
          >
            {Services[currentIndex].heading}
          </motion.h1>
        )}
      </AnimatePresence>
      <Link to="/services">
        <button className="service_button">Read More</button>
      </Link>
        </div>
        </div>
    </div>
  );
};

export default HeaderSlideBar;
