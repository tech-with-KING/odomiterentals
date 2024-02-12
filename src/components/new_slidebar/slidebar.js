import React, { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './slidebar.css';
import { Services, device } from '../../deviceinfo';
import { Link } from 'react-router-dom';


class HeaderSlideBar extends Component {
  constructor(props) {
    super(props);
  }

  state = { index: 0 };

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.index >= Services.length - 1) {
        this.setState({ index: 0 });
      } else {
        this.setState((prevState) => ({ index: prevState.index + 1 }));
      }
    }, 5000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    const { index } = this.state;

    return (
      <div className="services_slides_container">
        <img src={Services[index].image} alt='image'  loading='lazy'  className={`service_image ${index === this.state.index ? 'show' : ''}`}></img>
        <h1 className={`service_name ${index === this.state.index ? 'show' : ''}`}>{Services[index].heading}</h1>
        <Link to={"/services"}><button className='service_button'>Read More</button></Link>
      </div>
    );
  }
}

export default HeaderSlideBar;
