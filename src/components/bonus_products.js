import React from 'react';
import { Link } from 'react-router-dom';
import '../globalstyle.css'
import HeaderSlideBar from './new_slidebar/slidebar';
const HeaderBanner = () => {
  return (
    <>
      <h1 className='services_h1'>Services</h1>
      <HeaderSlideBar />
      </>
  )
}

export default HeaderBanner
