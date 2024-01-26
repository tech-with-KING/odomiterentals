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
      setIsDragging(false);
      bankAccountsRef.current.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      bankAccountsRef.current.style.cursor = 'grab';
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

    const handleScroll = () => {
      const position = bankAccountsRef.current.scrollLeft;
      // Update button disabled states based on scroll position
      // (similar logic to your original code)
    };

    bankAccountsRef.current.addEventListener('mousedown', handleMouseDown);
    bankAccountsRef.current.addEventListener('mouseleave', handleMouseLeave);
    bankAccountsRef.current.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    bankAccountsRef.current.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup event listeners on component unmount
      bankAccountsRef.current.removeEventListener('mousedown', handleMouseDown);
      bankAccountsRef.current.removeEventListener('mouseleave', handleMouseLeave);
      bankAccountsRef.current.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      bankAccountsRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [isDragging, startX, startY, scrollLeft, scrollTop]);

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
      <Header heading='REVIEWS' paragraph='We Have a perfect 5 Stars Review from ove 100 clients on Google Review'/>
      <div

        id="bank-accounts"
        className="bank-accounts"
        ref={bankAccountsRef}
      >
        <div className='action-button_left' onClick={()=>{handleScrollLeft()}}><ArrowBackIosIcon/></div>
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
        <div className='action-button_right' onClick={()=>{handleScrollRight()}}><ArrowForwardIosIcon/></div>
      </div>
      {/* ... Your other HTML content ... */}
    </div>
  );
};

export default BankAccounts;
