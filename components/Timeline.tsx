"use client";

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
    <section className="py-32 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 text-black drop-shadow-sm italic tracking-tight"
          >
            {t.timeline.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-black/80 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {t.timeline.description}
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-black/10 origin-top rounded-full"
            style={{ scaleY }}
          />

          <div className="space-y-40">
            {t.timeline.steps.map((step: { title: string; description: string }, index: number) => (
              <div key={index} className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                {/* Spacer */}
                <div className="w-5/12 hidden md:block" />
                
                {/* Number Indicator */}
                <div className="z-20">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.2)] border-4 border-white"
                  >
                    {index + 1}
                  </motion.div>
                </div>

                {/* Content Card */}
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full md:w-5/12 group"
                >
                  <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-black/20 to-black/5 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    {/* Interior Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                    
                    <div className="relative p-8 md:p-10 space-y-4">
                      <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight drop-shadow-md">
                        {step.title}
                      </h3>
                      <div className="h-1 w-12 bg-white/30 rounded-full group-hover:w-20 transition-all duration-500" />
                      <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium drop-shadow-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
