        import React, { useState, useEffect } from 'react';
        import { motion, AnimatePresence } from 'framer-motion';
        import './slidebar.css';
        import { device } from '../../deviceinfo';
        
        const SlideBar = () => {
          const [index, setIndex] = useState(0);
        
          useEffect(() => {
            const interval = setInterval(() => {
              if (index > 7) {
                setIndex(0);
              } else {
                setIndex(index + 1);
              }
            }, 5000);
        
            return () => clearInterval(interval);
          }, [index]);
        
          const setProduct = (id) => {
            setIndex(id);
          };
        
          return (
            <AnimatePresence>
              <motion.div
                className="slideshow-container"
                style={{ backgroundImage: `url(/img/${device[index].img})` }}
                key={index}
              >
                <div className="display_device">
                  <div className="device_image"></div>
                  <div className="display_text">
                    <h2>{device[index].name}</h2>
                    <h3></h3>
                  </div>
                </div>
        
                <div className="dot-container">
                  {device.map((data) => (
                    <span
                      key={data.id}
                      onClick={() => setProduct(data.id)}
                      className={`dot`}
                      style={data.id === device[index].id ? { backgroundColor: 'blue' } : {}}
                    ></span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          );
        };
        
        export default SlideBar;
        