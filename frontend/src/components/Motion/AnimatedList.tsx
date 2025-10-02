import React from "react";
import { motion, Variants } from "framer-motion";
import { Box, BoxProps } from "@mui/material";
import { useMotion } from "../../contexts/MotionContext";

interface AnimatedListProps extends Omit<BoxProps, "component"> {
  children: React.ReactNode;
  staggerDelay?: number;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 0.05,
  ...props
}) => {
  const { isMotionEnabled } = useMotion();

  if (!isMotionEnabled) {
    return <Box {...props}>{children}</Box>;
  }

  return (
    <motion.div
      style={{ display: "contents" }}
      variants={{
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <Box {...props}>
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
};

export default AnimatedList;
