"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function FAQsTwo() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-display font-semibold mb-4"
          >
            {t.faqs.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t.faqs.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion
            type="single"
            collapsible
            className="bg-white/50 backdrop-blur-md w-full rounded-[2.5rem] border border-border px-8 py-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {t.faqs.items.map(
              (
                item: { id: string; question: string; answer: string },
                index: number,
              ) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className={`border-border/50 last:border-0 ${index === 0 ? "pt-0" : ""}`}
                >
                  <AccordionTrigger className="cursor-pointer text-lg font-semibold hover:no-underline py-6 text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground text-base pb-6 leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground mt-10 text-center text-sm"
          >
            {t.faqs.cantFind}{" "}
            <Link
              href="#"
              className="text-foreground font-semibold hover:underline"
            >
              {t.faqs.contactSupport}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
