import React from "react";
import { motion, Variants } from "framer-motion";
import { useMotion } from "../../contexts/MotionContext";

interface AnimatedCollapseProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

const collapseVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const AnimatedCollapse: React.FC<AnimatedCollapseProps> = ({
  children,
  isOpen,
  className,
}) => {
  const { isMotionEnabled } = useMotion();

  if (!isMotionEnabled) {
    return isOpen ? <div className={className}>{children}</div> : null;
  }

  return (
    <motion.div
      className={className}
      variants={collapseVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCollapse;
