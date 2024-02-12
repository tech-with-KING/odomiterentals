import React, { useState, useRef, useEffect } from 'react';
import './style.css'; // Import your CSS file
import { ReviewCard } from '../reviews';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Header from '../../body/header';

const BankAccounts = () => {
  const bankAccountsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - bankAccountsRef.current.offsetLeft);
      setStartY(e.pageY - bankAccountsRef.current.offsetTop);
      setScrollLeft(bankAccountsRef.current.scrollLeft);
      setScrollTop(bankAccountsRef.current.scrollTop);
      bankAccountsRef.current.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        bankAccountsRef.current.style.cursor = 'grab';
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        bankAccountsRef.current.style.cursor = 'grab';
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - bankAccountsRef.current.offsetLeft;
      const y = e.pageY - bankAccountsRef.current.offsetTop;
      const walkX = (x - startX) * 1;
      const walkY = (y - startY) * 1;
      bankAccountsRef.current.scrollLeft = scrollLeft - walkX;
      bankAccountsRef.current.scrollTop = scrollTop - walkY;
    };

    const currentRef = bankAccountsRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousedown', handleMouseDown);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
      currentRef.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      const currentRef = bankAccountsRef.current;
      if (currentRef) {
        currentRef.removeEventListener('mousedown', handleMouseDown);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        currentRef.removeEventListener('mouseup', handleMouseUp);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startX, startY, scrollLeft, scrollTop]);

  useEffect(() => {
    const currentRef = bankAccountsRef.current;
    const handleWheel = (e) => {
      // Your wheel event logic
      console.log('Wheel event:', e);
    };

    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel);

      return () => {
        currentRef.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const handleScrollLeft = () => {
    bankAccountsRef.current.scrollBy({
      top: 0,
      left: -200,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    bankAccountsRef.current.scrollBy({
      top: 0,
      left: 200,
      behavior: 'smooth',
    });
  };
  const reviews = [
    {
      id: "1",
      customer_name: "Connie G",
      customer_avatar: "avatar1.jpg",
      customer_review: `They were very professional, on time and they actually picked up the tables
      and chairs at the end of our party. We called them and they came quick. I will definitely
      do more rentals with them. I recommend Odomite Rentals to everyone.`,
      time_of_review: "4 months ago",
      customer_rating: 5 
    },
    {
      id: "2",
      customer_name: "K. Grant",
      customer_avatar: "",
      customer_review: `Service was great! We had a last minute holiday party. Steven was able to
      supply our requested table and chairs colors with no problem. Communication was excellent.`,
      time_of_review: "a month ago",
      customer_rating: 5 
    },
    {
      id: "3",
      customer_name: "Darnell Brunson",
      customer_avatar: "", 
      customer_review: `I was looking around for rental chairs but I wanted a certain look. So I
      Found this amazing rental company on Facebook marketplace place. Did my research on the
      internet and found them to be legit. This was the best decision I’ve made. I own an intimate
      event space and will be using them for all my events! Communication and delivery let’s not
      forget pricing was all on point!! Thank you Thank you Thank you!`,
      time_of_review: "a year ago",
      customer_rating: 5 
    },
    {
      id: "4",
      customer_name: "Simply Stefené",
      customer_avatar: "", 
      customer_review: `I had such a great experience renting chairs for a small party. The transaction
      was smooth and the owner was super nice. I will be returning and recommending this company!`,
      time_of_review: "4 months ago",
      customer_rating: 5
    },
    {
      id: "5",
      customer_name: "Stephanie Homem",
      customer_avatar: "", 
      customer_review: `Everything was perfect we rented for Thanksgiving! Scheduled for pick up and
      delivery everything went very smoothly! Very friendly and very professional I will be renting
      from this company again. The chairs and table were clean. When I called they answered all my
      questions and everything he said was done very please thank you so much`,
      time_of_review: "a year ago",
      customer_rating: 5 
    }
  ];
  return (
    <div className="container_bank">
      <Header heading='REVIEWS' paragraph='We have a perfect 5 Stars Review from over 100 clients on Google Review' />
      <div id="bank-accounts" className="bank-accounts" ref={bankAccountsRef}>
        <div className='action-button_left' onClick={handleScrollLeft}><ArrowBackIosIcon /></div>
        {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          customerName={review.customer_name}
          customerAvatar={review.customer_avatar} 
          customerReview={review.customer_review}
          customerRating={review.customer_rating}
          timeOfReview={review.time_of_review}
        />
      ))}
        <div className='action-button_right' onClick={handleScrollRight}><ArrowForwardIosIcon /></div>
      </div>
    </div>
  );
};

export default BankAccounts;
