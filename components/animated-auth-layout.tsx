"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimatedAuthLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
        <header className="flex h-16 items-center px-4 md:px-6 border-b bg-background/95">
          <Link href="/" className="text-2xl font-bold">
            Cycly
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      
      <motion.main 
        className="flex-1 flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.main>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 h-full w-full opacity-20 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute left-1/3 top-1/4 h-56 w-56 rounded-full bg-purple-300 mix-blend-multiply blur-3xl"
          animate={{ 
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, 10, 0],
            scale: [1, 1.05, 1, 0.95, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-rose-300 mix-blend-multiply blur-3xl"
          animate={{ 
            x: [0, -15, 0, 15, 0],
            y: [0, 10, 0, -10, 0],
            scale: [1, 0.95, 1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute left-1/2 bottom-1/4 h-40 w-40 rounded-full bg-cyan-300 mix-blend-multiply blur-3xl"
          animate={{ 
            x: [0, 20, 0, -20, 0],
            y: [0, -5, 0, 5, 0],
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 18, 
            ease: "easeInOut",
            delay: 1 
          }}
        />
      </div>
    </div>
  );
} 