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
    setInterval(() => {
      if (this.state.index >= Services.length - 1) {
        this.setState({ index: 0 });
      } else {
        this.setState((prevState) => ({ index: prevState.index + 1 }));
      }
    }, 4000);
  }

  render() {
    const { index } = this.state;

    return (
      <div className="services_slides_container">
        <AnimatePresence mode='wait'>
          <motion.div
            
            src={Services[index].image}
            key={index}
            className=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img src={Services[index].image} alt='image'  loading='lazy' className='service_image'></img>
          </motion.div>
        </AnimatePresence>
        <h1 className='service_name'>{Services[index].heading}</h1>
        <Link to={"/services"}><button>Read More</button></Link>
      </div>
    );
  }
}

export default HeaderSlideBar;
