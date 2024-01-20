        import React, { useState, useEffect } from 'react';
        import { motion, AnimatePresence } from 'framer-motion';
        import './slidebar.css';
        import { device } from '../../deviceinfo';
        
        const SlideBar = () => {
          const [index, setIndex] = useState(0);
        
          useEffect(() => {
            const interval = setInterval(() => {
              if (index >= device.length - 1) {
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
                style={{ backgroundImage: `url(${device[index].img})` }}
                key={index}
              >
                <div className="display_device">
                </div>
        
                <div className="dot-container">
                  {device.map((data) => (
                    <span
                      key={data.id}
                      onClick={() => setProduct(data.id)}
                      className={`dot`}
                      style={data.id === device[index].id ? { backgroundColor: 'rgba(250, 250, 250, 1)'} : {}}
                    ></span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          );
        };
        
        export default SlideBar;
        