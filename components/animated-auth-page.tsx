"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedAuthPage({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full max-w-lg">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg"
    >
      {children}
    </motion.div>
  );
} 