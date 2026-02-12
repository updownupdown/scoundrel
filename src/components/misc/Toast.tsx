import type React from "react";
import "./Toast.scss";
import { toastDurationInSec } from "../../utils/dungeonFunctions";
import { motion } from "framer-motion";

interface ToastProps {
  type: string;
  children: React.ReactNode;
}

export const Toast = ({ type, children }: ToastProps) => {
  return (
    <motion.div
      initial={false}
      layout
      animate={{ opacity: [0, 1, 1, 0], y: [-20, 0, 0, -20] }}
      transition={{
        duration: toastDurationInSec,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1],
      }}
    >
      <div className={`toast toast--${type}`}>{children}</div>
    </motion.div>
  );
};
