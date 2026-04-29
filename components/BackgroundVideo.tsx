"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const BackgroundVideo = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[120vh]"
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4" type="video/mp4" />
        </video>
        {/* Subtle Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>
    </div>
  );
};
