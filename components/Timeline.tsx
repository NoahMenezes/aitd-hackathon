"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export const Timeline = () => {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-display font-semibold mb-4"
          >
            {t.timeline.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t.timeline.description}
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border origin-top"
            style={{ scaleY }}
          />

          <div className="space-y-24">
            {t.timeline.steps.map((step: { title: string; description: string }, index: number) => (
              <div key={index} className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div className="w-5/12" />
                <div className="z-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-primary border-4 border-background flex items-center justify-center text-white font-bold"
                  >
                    {index + 1}
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-5/12 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
