import React from "react";
import { motion, Variants } from "framer-motion";
import { Button, ButtonProps } from "@mui/material";
import { useMotion } from "../../contexts/MotionContext";

interface AnimatedButtonProps extends Omit<ButtonProps, "component"> {
  loading?: boolean;
}

const buttonVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
  loading: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  ...props
}) => {
  const { isMotionEnabled } = useMotion();

  if (!isMotionEnabled) {
    return (
      <Button disabled={disabled || loading} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <motion.div
      variants={buttonVariants}
      initial="rest"
      whileHover={!disabled && !loading ? "hover" : "rest"}
      whileTap={!disabled && !loading ? "tap" : "rest"}
      animate={loading ? "loading" : "rest"}
    >
      <Button disabled={disabled || loading} {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
