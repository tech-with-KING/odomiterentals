
import React, { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './slidebar.css';
import { device } from '../../deviceinfo';
import Header from '../../body/header';

class HeaderSlideBar extends Component {
  constructor(props) {
    super(props);
  }

  state = { index: 0 };

  componentDidMount() {
    setInterval(() => {
      if (this.state.index >= device.length - 1) {
        this.setState({ index: 0 });
      } else {
        this.setState((prevState) => ({ index: prevState.index + 1 }));
      }
    }, 4000);
  }

  render() {
    const { index } = this.state;

    return (
      <div className="slideshow-containerfor"  style={{ backgroundImage: `url(/img/${device[index].img})` }}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={index}
            className="display_device"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="device_image"
              
            ></div>
            <div className="display_text">
              <Header heading={device[index].name} paragraph={device[index].spec} />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="dot-container">
          {device.map((data) => (
            <span
              key={data.id}
              onClick={() => {
                this.setState({ index: data.id });
              }}
              className={`dot`}
              style={data.id === device[index].id ? { backgroundColor: 'blue' } : {}}
            ></span>
          ))}
        </div>
      </div>
    );
  }
}

export default HeaderSlideBar;
