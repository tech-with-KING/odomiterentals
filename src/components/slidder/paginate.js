import * as React from "react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import styled from "styled-components";

import { Box } from "../box";
import { MotionBox } from "../motion-box";
import { Flex } from "../flex";

const directionOffset = 800;

const variants = {
  enter: direction => ({
    x: direction < 0 ? -directionOffset : directionOffset,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: direction => ({
    zIndex: 0,
    x: direction < 0 ? -directionOffset : directionOffset,
    opacity: 0
  })
};

const Slider = styled(Box)``;
Slider.defaultProps = {
  border: 1,
  borderWidth: 2,
  bg: "brand100",
  p: 3
};

const Arrow = styled(Box)`
  cursor: pointer;
`;
Arrow.defaultProps = {
  color: "text",
  fontSize: 2,
  fontWeight: 2,
  p: 2
};

const Bullet = styled(Box)`
  cursor: pointer;
`;
Bullet.defaultProps = {
  display: "inline-block",
  borderRadius: 1,
  height: 12,
  width: 12,
  m: 1
};

// ! Fix scroll animation direction on bullets

export const MotionSlider = ({ content }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [activeBullet, setActiveBullet] = useState(0);
  const i = wrap(0, content.length, page);
  const paginate = newDirection => {
    if (page + newDirection < content.length && page + newDirection >= 0) {
      setPage([page + newDirection, 0]);
      setActiveBullet(page + newDirection);
    } else if (page + newDirection === content.length) {
      setPage([0, 0]);
      setActiveBullet(0);
    } else if (page + newDirection === -1) {
      setPage([content.length - 1, 0]);
      setActiveBullet(content.length - 1);
    }
  };
  setInterval(paginate(1),700);
  console.log(paginate);

  return (
    <>
      <AnimatePresence initial={false} exitBeforeEnter custom={direction}>
        <MotionBox
          position="relative"
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              type: "spring",
              stiffness: 800,
              damping: 100,
              duration: 0.1
            },
            opacity: { duration: 0.6 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < swipeConfidenceThreshold) {
              paginate(-1);
            } else if (swipe > -swipeConfidenceThreshold) {
              paginate(1);
            }
          }}
        >
          <Slider>
            <Box>Review #{i}</Box>
            {content[i].text}
            <Flex mt={6} fontWeight={2}>
              {content[i].name}
            </Flex>
          </Slider>
        </MotionBox>
      </AnimatePresence>
      <Flex
        position="relative"
        alignItems="center"
        top={[0, null, -64]}
        style={{ zIndex: 1, float: "right" }}
      >
        <Arrow onClick={() => paginate(-1)}>{"<"}</Arrow>

        {content.map(item => (
          <Bullet
            key={item.id}
            onClick={() => {
              setPage([item.id, 0]);
              setActiveBullet(item.id);
            }}
            bg={activeBullet === item.id ? "brand" : "text"}
          />
        ))}

        <Arrow onClick={() => paginate(1)}>{">"}</Arrow>
      </Flex>
    </>
  );
};

const swipeConfidenceThreshold = 100;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};
