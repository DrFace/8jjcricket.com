"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  float = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  float?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 25, rotateY: 5, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
      animate={
        float
          ? {
              y: [0, -10, 0],
              rotateX: [0, 2, 0],
              rotateY: [0, -1, 0],
            }
          : {}
      }
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotateX: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotateY: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`will-change-transform ${className}`}
      style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
