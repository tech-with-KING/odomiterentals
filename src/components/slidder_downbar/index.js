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

  return (
    <div className="container_bank">
      <Header heading='REVIEWS' paragraph='We have a perfect 5 Stars Review from over 100 clients on Google Review' />
      <div id="bank-accounts" className="bank-accounts" ref={bankAccountsRef}>
        <div className='action-button_left' onClick={handleScrollLeft}><ArrowBackIosIcon /></div>
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <div className='action-button_right' onClick={handleScrollRight}><ArrowForwardIosIcon /></div>
      </div>
    </div>
  );
};

export default BankAccounts;
