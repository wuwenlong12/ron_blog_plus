import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const withPageTransition = (Component: React.FC<any>) => {
  return (props: any) => (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      style={{ position: "absolute", width: "100%" }}
    >
      <Component {...props} />
    </motion.div>
  );
};
